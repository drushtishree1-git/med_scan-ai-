"""
MediScan AI — Chest X-Ray Deep Learning Model Training Pipeline
Trains a high-accuracy Convolutional Neural Network (Transfer Learning with MobileNetV2 / Xception)
on the Kaggle Chest X-Ray (Pneumonia) dataset.
"""

import os
import sys
import argparse
import time
from pathlib import Path

# Fix Windows console UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Configure TensorFlow environment
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data" / "chest_xray"


def parse_arguments():
    parser = argparse.ArgumentParser(description="Train MediScan AI Chest Radiograph Classifier")
    parser.add_argument("--data_dir", type=str, default=str(DATA_DIR), help="Path to chest_xray data directory")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs (default: 5)")
    parser.add_argument("--batch_size", type=int, default=16, help="Batch size (default: 16)")
    parser.add_argument("--img_size", type=int, default=224, help="Image width/height (default: 224)")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate (default: 1e-4)")
    parser.add_argument("--output", type=str, default="best_chest_xray_model.keras", help="Output model filename")
    parser.add_argument("--backbone", type=str, default="MobileNetV2", choices=["MobileNetV2", "Xception"], help="Backbone architecture")
    parser.add_argument("--evaluate_only", action="store_true", help="Skip training and evaluate existing model")
    return parser.parse_args()


def verify_dataset_structure(data_path: Path):
    """Verifies train, val, and test directories exist and contain class images."""
    for split in ["train", "val", "test"]:
        split_path = data_path / split
        if not split_path.is_dir():
            raise FileNotFoundError(f"Missing dataset split directory: {split_path}")
        for label in ["NORMAL", "PNEUMONIA"]:
            label_path = split_path / label
            if not label_path.is_dir():
                raise FileNotFoundError(f"Missing class label directory: {label_path}")
            count = len(list(label_path.glob("*.jp*g"))) + len(list(label_path.glob("*.png")))
            print(f"  [{split.upper()}] {label}: {count} radiographs found.")


def build_pipeline(data_path: Path, img_size: int, batch_size: int):
    """Creates efficient tf.data pipelines for train, val, and test."""
    train_dir = data_path / "train"
    val_dir = data_path / "val"
    test_dir = data_path / "test"

    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="binary",
        shuffle=True,
        seed=42,
    )

    val_ds = keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="binary",
        shuffle=False,
    )

    test_ds = keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="binary",
        shuffle=False,
    )

    # Data augmentation for training only
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.08),
        layers.RandomZoom(0.08),
    ], name="data_augmentation")

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y), num_parallel_calls=autotune)
    train_ds = train_ds.prefetch(autotune)
    val_ds = val_ds.prefetch(autotune)
    test_ds = test_ds.prefetch(autotune)

    return train_ds, val_ds, test_ds


def build_classifier(backbone_name: str, img_size: int, lr: float):
    """Constructs transfer learning model with pre-trained open weights."""
    print(f"[*] Initializing pre-trained {backbone_name} backbone with ImageNet open weights...")
    
    input_shape = (img_size, img_size, 3)
    inputs = keras.Input(shape=input_shape)

    if backbone_name == "MobileNetV2":
        preprocessed = keras.applications.mobilenet_v2.preprocess_input(inputs)
        base_model = keras.applications.MobileNetV2(
            input_shape=input_shape, include_top=False, weights="imagenet"
        )
    else:
        preprocessed = keras.applications.xception.preprocess_input(inputs)
        base_model = keras.applications.Xception(
            input_shape=input_shape, include_top=False, weights="imagenet"
        )

    base_model.trainable = False

    x = base_model(preprocessed, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.4)(x)
    outputs = layers.Dense(1, activation="sigmoid", name="pneumonia_prob")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name=f"MediScan_{backbone_name}")
    model.compile(
        optimizer=optimizers.Adam(learning_rate=lr),
        loss="binary_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
            keras.metrics.AUC(name="auc"),
        ],
    )
    return model


def evaluate_model(model, test_ds):
    """Evaluates metrics and calculates clinical sensitivity and specificity."""
    print("\n[*] Evaluating model on held-out test dataset...")
    results = model.evaluate(test_ds, verbose=1)
    if not isinstance(results, (list, tuple)):
        results = [results]
    metric_names = [m.name for m in model.metrics] if (hasattr(model, "metrics") and model.metrics) else model.metrics_names
    metrics = dict(zip(metric_names, results))
    
    acc = metrics.get("accuracy", metrics.get("binary_accuracy", results[1] if len(results) > 1 else 0))
    prec = metrics.get("precision", results[2] if len(results) > 2 else 0)
    rec = metrics.get("recall", results[3] if len(results) > 3 else 0)
    f1 = (2 * prec * rec) / (prec + rec + 1e-7) if (prec + rec) > 0 else 0
    auc = metrics.get("auc", results[4] if len(results) > 4 else 0)
    
    print("\n" + "=" * 50)
    print("      MEDISCAN AI TEST BENCHMARK RESULTS")
    print("=" * 50)
    print(f" - Test Accuracy   : {acc * 100:.2f}%")
    print(f" - Precision       : {prec * 100:.2f}%")
    print(f" - Recall (Sens.)  : {rec * 100:.2f}%")
    print(f" - F1 Score        : {f1 * 100:.2f}%")
    print(f" - ROC AUC         : {auc:.4f}")
    print("=" * 50 + "\n")
    return metrics


def main():
    args = parse_arguments()
    data_path = Path(args.data_dir)

    print("\n🏥 MediScan AI — Deep Learning Training Pipeline")
    print(f"   Dataset Location: {data_path}")
    print(f"   Architecture    : {args.backbone}")
    print(f"   Batch Size      : {args.batch_size}")
    print(f"   Target Epochs   : {args.epochs}")

    verify_dataset_structure(data_path)
    train_ds, val_ds, test_ds = build_pipeline(data_path, args.img_size, args.batch_size)

    output_path = BASE_DIR / args.output

    if args.evaluate_only:
        if not output_path.is_file():
            # Check fallback to best finetuned model
            alt_path = BASE_DIR / "xception_finetuned_best.keras"
            if alt_path.is_file():
                output_path = alt_path
            else:
                raise FileNotFoundError(f"Model file not found for evaluation: {output_path}")

        print(f"[*] Loading model for evaluation: {output_path.name}")
        model = keras.models.load_model(str(output_path), compile=False)
        model.compile(
            optimizer=optimizers.Adam(learning_rate=args.lr),
            loss="binary_crossentropy",
            metrics=["accuracy", keras.metrics.Precision(name="precision"), keras.metrics.Recall(name="recall"), keras.metrics.AUC(name="auc")],
        )
        evaluate_model(model, test_ds)
        return

    model = build_classifier(args.backbone, args.img_size, args.lr)
    model.summary()

    cb_list = [
        callbacks.EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True, verbose=1),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, verbose=1),
        callbacks.ModelCheckpoint(str(output_path), monitor="val_accuracy", save_best_only=True, verbose=1),
    ]

    start_time = time.time()
    print(f"\n[*] Commencing model training for {args.epochs} epochs...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        callbacks=cb_list,
        verbose=1,
    )
    duration = time.time() - start_time
    print(f"[+] Training completed in {duration:.1f}s. Model saved to: {output_path.name}")

    evaluate_model(model, test_ds)


if __name__ == "__main__":
    main()
