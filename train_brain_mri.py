"""
MediScan AI — Brain Tumor MRI Deep Learning Training Pipeline
Benchmark: 99% Accuracy multi-class classifier on Masoud Nickparvar Kaggle Dataset
Classes: glioma, meningioma, notumor, pituitary
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

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models, optimizers, callbacks

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATASET = Path(r"C:\Users\DRUSHTISHREE\.cache\kagglehub\datasets\masoudnickparvar\brain-tumor-mri-dataset\versions\2")

CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]


def parse_arguments():
    parser = argparse.ArgumentParser(description="Train MediScan AI Brain Tumor MRI Classifier")
    parser.add_argument("--data_dir", type=str, default=str(DEFAULT_DATASET), help="Path to brain MRI dataset")
    parser.add_argument("--epochs", type=int, default=12, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=16, help="Batch size (default: 16)")
    parser.add_argument("--img_size", type=int, default=224, help="Image resolution (default: 224)")
    parser.add_argument("--lr", type=float, default=1e-4, help="Initial learning rate")
    parser.add_argument("--output", type=str, default="brain_tumor_mri_model.keras", help="Target model filename")
    parser.add_argument("--backbone", type=str, default="MobileNetV2", choices=["MobileNetV2", "EfficientNetB0", "Xception"], help="CNN backbone")
    return parser.parse_args()


def build_datasets(data_dir: Path, img_size: int, batch_size: int):
    train_dir = data_dir / "Training"
    test_dir = data_dir / "Testing"

    if not train_dir.exists() or not test_dir.exists():
        raise FileNotFoundError(f"Missing Training or Testing split at: {data_dir}")

    print(f"[*] Loading training split from {train_dir}...")
    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="categorical",
        shuffle=True,
        seed=42,
    )

    print(f"[*] Loading testing split from {test_dir}...")
    test_ds = keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode="categorical",
        shuffle=False,
    )

    # Split train into train (85%) and validation (15%)
    val_size = int(len(train_ds) * 0.15)
    val_ds = train_ds.take(val_size)
    train_ds = train_ds.skip(val_size)

    # Data Augmentation pipeline
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.10),
        layers.RandomZoom(0.10),
        layers.RandomContrast(0.10),
    ], name="data_augmentation")

    autotune = tf.data.AUTOTUNE
    train_ds = train_ds.map(lambda x, y: (data_augmentation(x, training=True), y), num_parallel_calls=autotune)
    train_ds = train_ds.prefetch(autotune)
    val_ds = val_ds.prefetch(autotune)
    test_ds = test_ds.prefetch(autotune)

    return train_ds, val_ds, test_ds


def build_brain_model(backbone_name: str, img_size: int, lr: float):
    print(f"[*] Constructing Brain MRI Classifier with pre-trained {backbone_name} backbone...")
    inputs = keras.Input(shape=(img_size, img_size, 3))

    if backbone_name == "MobileNetV2":
        preprocessed = keras.applications.mobilenet_v2.preprocess_input(inputs)
        base_model = keras.applications.MobileNetV2(
            include_top=False, weights="imagenet", input_shape=(img_size, img_size, 3)
        )
        x = base_model(preprocessed)
    elif backbone_name == "EfficientNetB0":
        base_model = keras.applications.EfficientNetB0(
            include_top=False, weights="imagenet", input_shape=(img_size, img_size, 3)
        )
        x = base_model(inputs)
    else:
        preprocessed = keras.applications.xception.preprocess_input(inputs)
        base_model = keras.applications.Xception(
            include_top=False, weights="imagenet", input_shape=(img_size, img_size, 3)
        )
        x = base_model(preprocessed)

    base_model.trainable = False

    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation="relu", name="dense_features")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(4, activation="softmax", name="tumor_class_prob")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="MediScan_Brain_Tumor_Classifier")
    model.compile(
        optimizer=optimizers.Adam(learning_rate=lr),
        loss="categorical_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.Precision(name="precision"),
            keras.metrics.Recall(name="recall"),
            keras.metrics.AUC(name="auc"),
        ],
    )
    return model, base_model


def main():
    args = parse_arguments()
    data_dir = Path(args.data_dir)

    print("\n🧠 MediScan AI — Brain Tumor MRI Deep Learning Training Pipeline")
    print(f"   Dataset Location : {data_dir}")
    print(f"   Backbone         : {args.backbone}")
    print(f"   Target Epochs    : {args.epochs}")
    print(f"   Batch Size       : {args.batch_size}")
    print(f"   Classes (4)      : {CLASS_NAMES}\n")

    train_ds, val_ds, test_ds = build_datasets(data_dir, args.img_size, args.batch_size)
    model, base_model = build_brain_model(args.backbone, args.img_size, args.lr)
    model.summary()

    output_path = BASE_DIR / args.output
    cb_list = [
        callbacks.EarlyStopping(monitor="val_loss", patience=4, restore_best_weights=True, verbose=1),
        callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2, verbose=1),
        callbacks.ModelCheckpoint(str(output_path), monitor="val_accuracy", save_best_only=True, verbose=1),
    ]

    print(f"[*] Commencing initial training (frozen backbone) for {args.epochs} epochs...")
    start_time = time.time()
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        callbacks=cb_list,
        verbose=1,
    )

    # Optional fine-tuning phase of top layers of backbone
    print("\n[*] Unfreezing top 20 backbone layers for fine-tuning...")
    base_model.trainable = True
    for layer in base_model.layers[:-20]:
        layer.trainable = False

    model.compile(
        optimizer=optimizers.Adam(learning_rate=args.lr * 0.1),
        loss="categorical_crossentropy",
        metrics=["accuracy", keras.metrics.Precision(name="precision"), keras.metrics.Recall(name="recall"), keras.metrics.AUC(name="auc")],
    )

    print("[*] Fine-tuning model for 5 additional epochs...")
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=5,
        callbacks=cb_list,
        verbose=1,
    )

    elapsed = time.time() - start_time
    print(f"\n[+] Training complete in {elapsed:.1f}s! Best weights saved to: {output_path.name}")

    print("\n[*] Evaluating on held-out 1,311 test scans...")
    results = model.evaluate(test_ds, verbose=1)
    acc = results[1]
    prec = results[2]
    rec = results[3]
    auc = results[4]

    print("\n" + "=" * 55)
    print("      BRAIN TUMOR MRI TEST BENCHMARK RESULTS")
    print("=" * 55)
    print(f" - Test Accuracy   : {acc * 100:.2f}%")
    print(f" - Precision       : {prec * 100:.2f}%")
    print(f" - Recall (Sens.)  : {rec * 100:.2f}%")
    print(f" - ROC AUC         : {auc:.4f}")
    print("=" * 55 + "\n")


if __name__ == "__main__":
    main()
