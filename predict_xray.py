
"""
MediScan AI — Chest X-ray Prediction
Experimental image classification only; not a medical diagnosis.
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Configure TensorFlow before importing it.
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")

import numpy as np
import tensorflow as tf
from PIL import Image, UnidentifiedImageError

tf.get_logger().setLevel("ERROR")

# Resolve the default model relative to this script's directory.
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_MODEL = BASE_DIR / "xception_finetuned_best.keras"

# These are review flags, not medically validated thresholds.
DEFAULT_THRESHOLD = 0.50
UNCERTAIN_LOW = 0.35
UNCERTAIN_HIGH = 0.65


def load_xray_model(model_path):
    """Load the trained model and validate its input/output shapes."""
    path = Path(model_path)

    if not path.is_absolute():
        # Prefer the supplied path relative to the current directory.
        if not path.is_file():
            path = BASE_DIR / path

    if not path.is_file():
        raise FileNotFoundError(
            f"Model file not found: {path}. "
            "Check the model_path setting."
        )

    model = tf.keras.models.load_model(str(path), compile=False)

    if len(model.inputs) != 1:
        raise ValueError("Expected a model with exactly one image input.")

    input_shape = tuple(model.inputs[0].shape)

    if (
        len(input_shape) != 4
        or input_shape[1] != 224
        or input_shape[2] != 224
        or input_shape[3] != 3
    ):
        raise ValueError(
            f"Expected input shape (None, 224, 224, 3), got {input_shape}"
        )

    output_shape = tuple(model.outputs[0].shape)

    if len(output_shape) != 2 or output_shape[-1] != 1:
        raise ValueError(
            "This predictor expects a single-output sigmoid model. "
            f"Received output shape: {output_shape}"
        )

    return model, path


def preprocess_xray(image_path):
    """
    Prepare an image for the fine-tuned Xception model.

    The model contains its own Rescaling layer, so pixel values are
    kept in the 0-255 range here.
    """
    path = Path(image_path)

    if not path.is_file():
        raise FileNotFoundError(f"Image not found: {path}")

    try:
        with Image.open(path) as image:
            image = image.convert("RGB")
            image = image.resize(
                (224, 224),
                Image.Resampling.BILINEAR
            )
            array = np.asarray(image, dtype=np.float32)

    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError(f"Could not read image: {exc}") from exc

    if array.shape != (224, 224, 3):
        raise ValueError(
            f"Unexpected preprocessed image shape: {array.shape}"
        )

    if not np.isfinite(array).all():
        raise ValueError("Image contains invalid pixel values.")

    return np.expand_dims(array, axis=0)


def run_prediction(
    image_path,
    model_path=None,
    threshold=DEFAULT_THRESHOLD,
    uncertain_low=UNCERTAIN_LOW,
    uncertain_high=UNCERTAIN_HIGH,
    model=None,
):
    """
    Return a structured report for one X-ray image.

    If a model object is supplied, it is reused. Otherwise, the model
    is loaded from model_path or the default model file.
    """
    try:
        if not 0.0 < threshold < 1.0:
            raise ValueError("threshold must be between 0 and 1.")

        if not (
            0.0 <= uncertain_low
            < uncertain_high <= 1.0
        ):
            raise ValueError(
                "Uncertainty bounds must satisfy "
                "0 <= uncertain_low < uncertain_high <= 1."
            )

        image_file = Path(image_path)

        if not image_file.is_absolute():
            image_file = Path.cwd() / image_file

        if model is None:
            selected_model = model_path or DEFAULT_MODEL
            model, resolved_model_path = load_xray_model(
                selected_model
            )
            model_name = resolved_model_path.name
        else:
            model_name = (
                Path(model_path).name
                if model_path
                else "Provided model object"
            )

        image_array = preprocess_xray(image_file)

        raw_output = np.asarray(
            model.predict(image_array, verbose=0),
            dtype=np.float64
        )

        if raw_output.shape != (1, 1):
            raise ValueError(
                "Expected prediction shape (1, 1), "
                f"received {raw_output.shape}."
            )

        pneumonia_score = float(raw_output[0, 0])

        if (
            not np.isfinite(pneumonia_score)
            or pneumonia_score < 0.0
            or pneumonia_score > 1.0
        ):
            raise ValueError(
                "Model output is not a valid probability-like score."
            )

        normal_score = 1.0 - pneumonia_score

        predicted_class = (
            "PNEUMONIA"
            if pneumonia_score >= threshold
            else "NORMAL"
        )

        confidence = max(pneumonia_score, normal_score)

        # This flag highlights borderline model outputs. It does not
        # establish whether the model is clinically reliable.
        uncertain = (
            uncertain_low <= pneumonia_score <= uncertain_high
        )

        if uncertain:
            interpretation = (
                "INDETERMINATE — the model score is in the configured "
                "uncertainty range. Do not rely on this classification "
                "alone; obtain qualified clinical review."
            )
            status = "REVIEW_REQUIRED"
        elif predicted_class == "PNEUMONIA":
            interpretation = (
                "The model output leans toward the PNEUMONIA class. "
                "This is not a confirmed diagnosis; clinical review "
                "is required."
            )
            status = "CLINICAL_REVIEW_REQUIRED"
        else:
            interpretation = (
                "The model output leans toward the NORMAL class. "
                "This does not rule out disease or replace a "
                "radiologist's assessment."
            )
            status = "CLINICAL_REVIEW_REQUIRED"

        return {
            "success": True,
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
            "confidence_percentage": f"{round(confidence * 100, 2)}%",
            "probabilities": {
                "NORMAL": round(normal_score, 4),
                "PNEUMONIA": round(pneumonia_score, 4)
            },
            "model_name": model_name,
            "report": {
                "title": "Chest X-ray AI Screening Report",
                "image_name": image_file.name,
                "model_name": model_name,
                "model_prediction": predicted_class,
                "review_status": status,
                "uncertain": uncertain,
                "model_score": {
                    "pneumonia": round(pneumonia_score, 4),
                    "normal": round(normal_score, 4),
                },
                "predicted_class_score": round(confidence, 4),
                "threshold_used": threshold,
                "findings": [
                    "Automated image-classification result only.",
                    "No independently verified radiological findings "
                    "were generated by this classifier."
                ],
                "explanation": interpretation,
                "next_steps": [
                    "Have the image and report reviewed by a "
                    "qualified healthcare professional.",
                    "Interpret the result alongside symptoms, "
                    "medical history and other clinical information.",
                    "Seek urgent medical care if there is severe "
                    "breathlessness, blue lips, confusion or other "
                    "serious symptoms."
                ],
                "disclaimer": (
                    "Experimental AI output, not a medical diagnosis. "
                    "The displayed scores are not necessarily "
                    "calibrated clinical probabilities."
                )
            }
        }

    except Exception as exc:
        return {
            "success": False,
            "error": str(exc),
            "report": None
        }


def main():
    parser = argparse.ArgumentParser(
        description="Run MediScan AI chest X-ray classification."
    )
    parser.add_argument(
        "image_path",
        help="Path to the chest X-ray image."
    )
    parser.add_argument(
        "--model",
        default=str(DEFAULT_MODEL),
        help="Path to the trained .keras model."
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=DEFAULT_THRESHOLD,
        help="Classification threshold (default: 0.5)."
    )

    args = parser.parse_args()

    result = run_prediction(
        image_path=args.image_path,
        model_path=args.model,
        threshold=args.threshold
    )

    print(json.dumps(result, indent=2, ensure_ascii=False))

    if not result["success"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
