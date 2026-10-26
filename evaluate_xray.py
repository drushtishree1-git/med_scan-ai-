
"""Safely evaluate the MediScan AI chest X-ray model."""

from pathlib import Path
import json
import numpy as np

from predict_xray import load_xray_model, preprocess_xray

BASE_DIR = Path(__file__).resolve().parent
TEST_DIR = BASE_DIR / "data" / "chest_xray" / "test"
MODEL_PATH = BASE_DIR / "xception_finetuned_best.keras"
THRESHOLD = 0.50
BATCH_SIZE = 4

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def main():
    if not TEST_DIR.is_dir():
        raise FileNotFoundError(f"Test dataset not found: {TEST_DIR}")

    print("Loading model...", flush=True)
    model, resolved_model_path = load_xray_model(MODEL_PATH)
    print(f"Model loaded: {resolved_model_path.name}", flush=True)

    tn = fp = fn = tp = 0
    evaluated = 0
    skipped = 0
    errors = []

    for folder_name, actual_label in [
        ("NORMAL", 0),
        ("PNEUMONIA", 1),
    ]:
        folder = TEST_DIR / folder_name

        if not folder.is_dir():
            raise FileNotFoundError(f"Missing folder: {folder}")

        paths = sorted(
            p for p in folder.iterdir()
            if p.suffix.lower() in IMAGE_EXTENSIONS
        )

        print(f"\n{folder_name}: {len(paths)} images", flush=True)

        for start in range(0, len(paths), BATCH_SIZE):
            batch_paths = paths[start:start + BATCH_SIZE]
            batch_images = []

            for path in batch_paths:
                try:
                    image = preprocess_xray(path)[0]
                    batch_images.append(image)
                except Exception as exc:
                    skipped += 1
                    if len(errors) < 20:
                        errors.append({
                            "image": str(path),
                            "error": str(exc),
                        })

            if not batch_images:
                continue

            x = np.asarray(batch_images, dtype=np.float32)
            scores = np.asarray(
                model.predict(x, verbose=0)
            ).reshape(-1)

            if len(scores) != len(batch_images):
                raise ValueError("Prediction count mismatch.")

            if not np.isfinite(scores).all():
                raise ValueError("Model produced invalid scores.")

            if np.any((scores < 0) | (scores > 1)):
                raise ValueError("Model scores are outside 0-1.")

            for score in scores:
                predicted_label = int(score >= THRESHOLD)
                evaluated += 1

                if actual_label == 0 and predicted_label == 0:
                    tn += 1
                elif actual_label == 0 and predicted_label == 1:
                    fp += 1
                elif actual_label == 1 and predicted_label == 0:
                    fn += 1
                else:
                    tp += 1

            done = min(start + BATCH_SIZE, len(paths))
            print(
                f"  Processed {done}/{len(paths)}",
                flush=True,
            )

    def pct(n, d):
        return round(100 * n / d, 2) if d else None

    results = {
        "model": resolved_model_path.name,
        "threshold": THRESHOLD,
        "images_evaluated": evaluated,
        "images_skipped": skipped,
        "confusion_matrix": {
            "true_normal_TN": tn,
            "false_positive_FP": fp,
            "false_negative_FN": fn,
            "true_pneumonia_TP": tp,
        },
        "metrics_percent": {
            "accuracy": pct(tn + tp, evaluated),
            "sensitivity_pneumonia": pct(tp, tp + fn),
            "specificity_normal": pct(tn, tn + fp),
            "false_positive_rate": pct(fp, fp + tn),
            "precision_pneumonia": pct(tp, tp + fp),
        },
        "warning": (
            "Experimental dataset evaluation only; "
            "not clinical validation or a medical diagnosis."
        ),
        "image_errors": errors,
    }

    print("\n===== EVALUATION RESULTS =====", flush=True)
    print(json.dumps(results, indent=2), flush=True)


if __name__ == "__main__":
    main()
