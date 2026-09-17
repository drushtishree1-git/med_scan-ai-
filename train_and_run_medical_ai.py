"""Chest X-Ray Deep Learning Classification & Medical AI Assistant Pipeline.

Loads/prepares Chest X-Ray datasets, trains a Convolutional Neural Network
(MobileNetV2 backbone), evaluates metrics, and integrates predictions into a
Medical AI Assistant report.
"""

import json
import os
from pathlib import Path
import time

import keras
from keras import callbacks, layers, models, optimizers
import numpy as np
from PIL import Image
import tensorflow as tf

# Suppress TensorFlow logging warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"


def setup_dataset(data_dir: str = "./data/chest_xray"):
    """Ensures dataset directory structure exists.

    If no images are found, creates a sample synthetic X-ray dataset.
    """
    train_dir = os.path.join(data_dir, "train")
    test_dir = os.path.join(data_dir, "test")
    val_dir = os.path.join(data_dir, "val")

    classes = ["NORMAL", "PNEUMONIA"]

    has_data = False
    if os.path.exists(train_dir):
        for class_name in classes:
            class_path = os.path.join(train_dir, class_name)
            if os.path.exists(class_path) and len(os.listdir(class_path)) > 0:
                has_data = True
                break

    if not has_data:
        print("[!] Creating synthetic sample Chest X-Ray dataset...")
        for split_dir in [train_dir, test_dir, val_dir]:
            for class_name in classes:
                os.makedirs(os.path.join(split_dir, class_name), exist_ok=True)

        np.random.seed(42)
        counts = {"train": 30, "test": 10, "val": 10}
        for split, count in counts.items():
            for class_name in classes:
                split_class_dir = os.path.join(data_dir, split, class_name)
                for i in range(count):
                    base = np.random.normal(120, 30, (224, 224)).astype(
                        np.float32
                    )
                    if class_name == "PNEUMONIA":
                        x_grid, y_grid = np.ogrid[:224, :224]
                        mask = (x_grid - 100) ** 2 + (
                            y_grid - 120
                        ) ** 2 <= 40**2
                        base[mask] += 60.0

                    base = np.clip(base, 0, 255).astype(np.uint8)
                    img = Image.fromarray(base).convert("RGB")
                    file_path = os.path.join(
                        split_class_dir, f"{class_name.lower()}_{i+1}.jpg"
                    )
                    img.save(file_path)
        print("[+] Sample synthetic dataset created successfully!")

    return train_dir, test_dir, val_dir, classes


class ChestXRayClassifier:
    """Deep learning classifier using MobileNetV2 for Chest X-Ray evaluation."""

    def __init__(self, img_size=(224, 224), batch_size=16):
        """Initialize image size, batch size, and target classes."""
        self.img_size = img_size
        self.batch_size = batch_size
        self.classes = ["NORMAL", "PNEUMONIA"]
        self.model = None

    def build_model(self):
        """Builds a MobileNetV2 transfer learning model."""
        print("[*] Building Transfer Learning CNN Model (MobileNetV2)...")
        base_model = keras.applications.MobileNetV2(
            input_shape=(*self.img_size, 3), include_top=False, weights="imagenet"
        )
        base_model.trainable = False

        inputs = keras.Input(shape=(*self.img_size, 3))
        x = layers.RandomFlip("horizontal")(inputs)
        x = layers.RandomRotation(0.1)(x)
        x = layers.RandomZoom(0.1)(x)
        x = keras.applications.mobilenet_v2.preprocess_input(x)

        x = base_model(x, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dense(128, activation="relu")(x)
        x = layers.Dropout(0.4)(x)
        outputs = layers.Dense(len(self.classes), activation="softmax")(x)

        self.model = models.Model(
            inputs=inputs, outputs=outputs, name="ChestXRayClassifier"
        )

        self.model.compile(
            optimizer=optimizers.Adam(learning_rate=1e-3),
            loss="categorical_crossentropy",
            metrics=[
                "accuracy",
                tf.keras.metrics.Precision(name="precision"),
                tf.keras.metrics.Recall(name="recall"),
            ],
        )
        self.model.summary()
        return self.model

    def load_datasets(self, train_dir, val_dir, test_dir):
        """Loads train, validation, and test datasets from directory."""
        train_ds = keras.utils.image_dataset_from_directory(
            train_dir,
            image_size=self.img_size,
            batch_size=self.batch_size,
            label_mode="categorical",
            shuffle=True,
        )
        val_ds = keras.utils.image_dataset_from_directory(
            val_dir,
            image_size=self.img_size,
            batch_size=self.batch_size,
            label_mode="categorical",
            shuffle=False,
        )
        test_ds = keras.utils.image_dataset_from_directory(
            test_dir,
            image_size=self.img_size,
            batch_size=self.batch_size,
            label_mode="categorical",
            shuffle=False,
        )
        return train_ds, val_ds, test_ds

    def train(
        self, train_ds, val_ds, epochs=5, save_path="chest_xray_model.keras"
    ):
        """Trains model with early stopping and model checkpointing."""
        print(f"[*] Training Chest X-Ray Model for {epochs} epochs...")
        cb_list = [
            callbacks.EarlyStopping(
                monitor="val_loss", patience=3, restore_best_weights=True
            ),
            callbacks.ReduceLROnPlateau(
                monitor="val_loss", factor=0.5, patience=2
            ),
            callbacks.ModelCheckpoint(
                save_path, monitor="val_accuracy", save_best_only=True
            ),
        ]

        history = self.model.fit(
            train_ds, validation_data=val_ds, epochs=epochs, callbacks=cb_list
        )
        print(f"[+] Training complete! Saved best model to '{save_path}'")
        return history

    def evaluate(self, test_ds):
        """Evaluates model metrics on the test dataset."""
        print("[*] Evaluating model on test dataset...")
        results = self.model.evaluate(test_ds)
        metrics_dict = dict(zip(self.model.metrics_names, results))

        precision = metrics_dict.get("precision", 0)
        recall = metrics_dict.get("recall", 0)
        f1_score = (2 * precision * recall) / (precision + recall + 1e-7)
        metrics_dict["f1_score"] = f1_score

        print("=== Test Evaluation Metrics ===")
        for key, value in metrics_dict.items():
            print(f" - {key.capitalize()}: {value:.4f}")
        return metrics_dict

    def predict(self, image_path):
        """Predicts class for a single input Chest X-Ray image file."""
        img = Image.open(image_path).convert("RGB").resize(self.img_size)
        img_array = np.expand_dims(np.array(img), axis=0)

        preds = self.model.predict(img_array, verbose=0)[0]
        pred_idx = int(np.argmax(preds))
        confidence = float(preds[pred_idx])
        pred_class = self.classes[pred_idx]

        return {
            "predicted_class": pred_class,
            "confidence": confidence,
            "probabilities": {
                "NORMAL": float(preds[0]),
                "PNEUMONIA": float(preds[1]),
            },
        }


class MedicalAIAssistant:
    """Medical AI Assistant for clinical case analysis and report generation."""

    def __init__(self, classifier: ChestXRayClassifier):
        """Initialize assistant with trained classifier and knowledge base."""
        self.classifier = classifier
        self.knowledge_base = {
            "PNEUMONIA": {
                "description": (
                    "Inflammation of lung tissue caused by infection."
                ),
                "common_findings": [
                    "Consolidation",
                    "Infiltrates",
                    "Opacity in lung fields",
                    "Fever",
                    "Cough",
                ],
                "recommendations": [
                    "Perform clinical correlation with auscultation findings",
                    "Check inflammatory markers (WBC, CRP, ESR)",
                    "Consider empirical antibiotic therapy if indicated",
                    "Follow-up chest radiograph in 4-6 weeks after treatment",
                ],
            },
            "NORMAL": {
                "description": "Clear lung fields with normal structures.",
                "common_findings": [
                    "No focal consolidation",
                    "No pleural effusion",
                    "Normal lung parenchyma",
                ],
                "recommendations": [
                    "Routine follow-up if asymptomatic",
                    "Consider alternative causes if patient exhibits symptoms",
                ],
            },
        }

    def process_case(self, patient_info: dict, xray_image_path: str):
        """Processes patient info, image prediction, and generates AI report."""
        print("\n==========================================")
        print(" MEDICAL AI ASSISTANT CLINICAL ANALYSIS")
        print("==========================================")
        print(f"Patient ID: {patient_info.get('id', 'N/A')}")
        patient_desc = (
            f"{patient_info.get('age', 'N/A')} / "
            f"{patient_info.get('gender', 'N/A')}"
        )
        print(f"Age/Gender: {patient_desc}")
        print(f"Symptoms: {patient_info.get('symptoms', 'N/A')}")
        print(f"Vitals: {patient_info.get('vitals', {})}")

        print("\n[*] Running Deep Learning Chest X-Ray Classification...")
        prediction = self.classifier.predict(xray_image_path)
        pred_class = prediction["predicted_class"]
        conf = prediction["confidence"] * 100

        print(f"[+] Model Result: {pred_class} ({conf:.2f}% confidence)")

        kb_entry = self.knowledge_base.get(pred_class, {})

        report = {
            "patient_id": patient_info.get("id"),
            "radiology_finding": {
                "classification": pred_class,
                "confidence": f"{conf:.2f}%",
                "probabilities": prediction["probabilities"],
            },
            "clinical_impression": kb_entry.get("description"),
            "characteristic_features": kb_entry.get("common_findings"),
            "actionable_recommendations": kb_entry.get("recommendations"),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        }

        print("\n--- GENERATED AI DIAGNOSTIC REPORT ---")
        print(json.dumps(report, indent=2))
        return report


def main():
    """Main execution entry point."""
    print("=" * 60)
    print(" CHEST X-RAY MODEL TRAINING & MEDICAL AI ASSISTANT")
    print("=" * 60)

    train_dir, test_dir, val_dir, _ = setup_dataset()

    clf = ChestXRayClassifier(img_size=(224, 224), batch_size=8)
    clf.build_model()

    train_ds, val_ds, test_ds = clf.load_datasets(train_dir, val_dir, test_dir)

    clf.train(train_ds, val_ds, epochs=3, save_path="chest_xray_model.keras")

    clf.evaluate(test_ds)

    assistant = MedicalAIAssistant(classifier=clf)

    pneumonia_dir = os.path.join(test_dir, "PNEUMONIA")
    sample_img_name = os.listdir(pneumonia_dir)[0]
    sample_img_path = os.path.join(pneumonia_dir, sample_img_name)

    sample_patient = {
        "id": "P-2026-9941",
        "age": 45,
        "gender": "Female",
        "symptoms": (
            "Fever (38.8 C), productive cough, sharp right-sided chest pain"
        ),
        "vitals": {"BP": "124/82", "HR": 94, "SpO2": "94%"},
    }

    assistant.process_case(sample_patient, sample_img_path)
    print("\n[+] Process completed successfully!")


if __name__ == "__main__":
    main()
