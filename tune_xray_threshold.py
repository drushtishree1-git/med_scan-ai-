
from pathlib import Path
import numpy as np

from predict_xray import load_xray_model, preprocess_xray

BASE_DIR = Path(__file__).resolve().parent
VAL_DIR = BASE_DIR / "data" / "chest_xray" / "val"
MODEL_PATH = BASE_DIR / "xception_finetuned_best.keras"
BATCH_SIZE = 4


def main():
    model, _ = load_xray_model(MODEL_PATH)
    scores = []
    labels = []

    for class_name, label in [("NORMAL", 0), ("PNEUMONIA", 1)]:
        folder = VAL_DIR / class_name
        if not folder.is_dir():
            raise FileNotFoundError(f"Missing folder: {folder}")

        paths = sorted(
            p for p in folder.iterdir()
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
        )
        print(f"{class_name}: {len(paths)} images", flush=True)

        for start in range(0, len(paths), BATCH_SIZE):
            batch_paths = paths[start:start + BATCH_SIZE]
            batch_images = [preprocess_xray(p)[0] for p in batch_paths]
            batch_scores = np.asarray(
                model.predict(np.asarray(batch_images, dtype=np.float32),
                              verbose=0)
            ).reshape(-1)

            if len(batch_scores) != len(batch_paths):
                raise ValueError("Prediction count mismatch.")
            if not np.isfinite(batch_scores).all():
                raise ValueError("Invalid prediction score.")

            scores.extend(batch_scores.tolist())
            labels.extend([label] * len(batch_scores))

    y = np.asarray(labels, dtype=np.int32)
    p = np.asarray(scores, dtype=np.float64)

    print("\nValidation threshold comparison")
    print("Threshold | Accuracy | Sensitivity | Specificity | FP | FN")
    print("-" * 67)

    for threshold in np.arange(0.20, 0.801, 0.05):
        pred = (p >= threshold).astype(np.int32)
        tn = int(np.sum((y == 0) & (pred == 0)))
        fp = int(np.sum((y == 0) & (pred == 1)))
        fn = int(np.sum((y == 1) & (pred == 0)))
        tp = int(np.sum((y == 1) & (pred == 1)))

        accuracy = 100 * (tn + tp) / len(y)
        sensitivity = 100 * tp / (tp + fn) if tp + fn else 0
        specificity = 100 * tn / (tn + fp) if tn + fp else 0

        print(
            f"{threshold:9.2f} | {accuracy:7.2f}% | "
            f"{sensitivity:10.2f}% | {specificity:10.2f}% | "
            f"{fp:2d} | {fn:2d}"
        )

    print("\nExploratory results only: validation has a small sample size.")
    print("Do not treat these thresholds as clinically validated.")


if __name__ == "__main__":
    main()
