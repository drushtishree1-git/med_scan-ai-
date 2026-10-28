"""
Build Chest X-Ray Dataset Model and Reference Signatures
Extracts multi-zone radiologic features from the data/chest_xray dataset:
- data/chest_xray/train/PNEUMONIA
- data/chest_xray/train/NORMAL
- data/chest_xray/test/PNEUMONIA
- data/chest_xray/test/NORMAL

Computes prototypes, zone distributions, and reference exemplar signatures.
Saves JSON to src/data/chest_xray_dataset_model.json and api/data/chest_xray_dataset_model.json
"""

import json
import os
import math
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data" / "chest_xray"

def extract_features(img_path):
    with Image.open(img_path) as im:
        im = im.convert("L").resize((100, 100), Image.Resampling.BILINEAR)
        pixels = list(im.getdata())
        
        # 100x100 grid
        # Zone definitions (y, x):
        # Upper Left: y 15-45, x 15-45
        # Upper Right: y 15-45, x 55-85
        # Mid Left: y 45-70, x 15-45
        # Mid Right: y 45-70, x 55-85
        # Lower Left (Basal): y 70-90, x 15-45
        # Lower Right (Basal): y 70-90, x 55-85
        
        def zone_mean(y_start, y_end, x_start, x_end):
            vals = []
            for y in range(y_start, y_end):
                for x in range(x_start, x_end):
                    vals.append(pixels[y * 100 + x])
            return sum(vals) / len(vals) if vals else 0.0

        ul = zone_mean(15, 45, 15, 45)
        ur = zone_mean(15, 45, 55, 85)
        ml = zone_mean(45, 70, 15, 45)
        mr = zone_mean(45, 70, 55, 85)
        ll = zone_mean(70, 90, 15, 45)
        lr = zone_mean(70, 90, 55, 85)
        
        left_lung = (ul + ml + ll) / 3.0
        right_lung = (ur + mr + lr) / 3.0
        avg_opacity = (left_lung + right_lung) / 2.0
        asymmetry = abs(left_lung - right_lung)
        lower_opacity = (ll + lr) / 2.0
        
        return {
            "ul": round(ul, 2),
            "ur": round(ur, 2),
            "ml": round(ml, 2),
            "mr": round(mr, 2),
            "ll": round(ll, 2),
            "lr": round(lr, 2),
            "avg_opacity": round(avg_opacity, 2),
            "asymmetry": round(asymmetry, 2),
            "lower_opacity": round(lower_opacity, 2),
            "feature_vector": [round(x, 2) for x in [ul, ur, ml, mr, ll, lr]]
        }

def main():
    print("Extracting dataset features from data/chest_xray...")
    
    pneumonia_exemplars = []
    normal_exemplars = []
    
    # Collect sample images from test and train
    pneu_paths = list((DATA_DIR / "test" / "PNEUMONIA").glob("*.jpeg"))[:35] + \
                 list((DATA_DIR / "train" / "PNEUMONIA").glob("*.jpeg"))[:35]
                 
    norm_paths = list((DATA_DIR / "test" / "NORMAL").glob("*.jpeg"))[:35] + \
                 list((DATA_DIR / "train" / "NORMAL").glob("*.jpeg"))[:35]
                 
    print(f"Sampling {len(pneu_paths)} Pneumonia scans and {len(norm_paths)} Normal scans...")
    
    for p in pneu_paths:
        try:
            feats = extract_features(p)
            pneumonia_exemplars.append({
                "filename": p.name,
                "label": "PNEUMONIA",
                "split": p.parent.parent.name,
                **feats
            })
        except Exception as e:
            print(f"Error {p.name}: {e}")
            
    for p in norm_paths:
        try:
            feats = extract_features(p)
            normal_exemplars.append({
                "filename": p.name,
                "label": "NORMAL",
                "split": p.parent.parent.name,
                **feats
            })
        except Exception as e:
            print(f"Error {p.name}: {e}")
            
    # Calculate prototypes (cluster centroids)
    def calculate_centroid(exemplars):
        dim = len(exemplars[0]["feature_vector"])
        centroid = [0.0] * dim
        for ex in exemplars:
            for i in range(dim):
                centroid[i] += ex["feature_vector"][i]
        centroid = [round(c / len(exemplars), 2) for c in centroid]
        avg_opacity = round(sum(e["avg_opacity"] for e in exemplars) / len(exemplars), 2)
        avg_asymmetry = round(sum(e["asymmetry"] for e in exemplars) / len(exemplars), 2)
        avg_lower = round(sum(e["lower_opacity"] for e in exemplars) / len(exemplars), 2)
        return {
            "feature_vector": centroid,
            "avg_opacity": avg_opacity,
            "avg_asymmetry": avg_asymmetry,
            "avg_lower_opacity": avg_lower
        }
        
    pneu_centroid = calculate_centroid(pneumonia_exemplars)
    norm_centroid = calculate_centroid(normal_exemplars)
    
    dataset_model = {
        "metadata": {
            "dataset_name": "Chest X-Ray Images (Pneumonia) - Kaggle / NIH Clinical Collection",
            "total_images_in_dataset": 5856,
            "training_samples_analyzed": len(pneumonia_exemplars) + len(normal_exemplars),
            "pneumonia_samples_count": 4273,
            "normal_samples_count": 1583,
            "feature_zones": ["Upper Left", "Upper Right", "Mid Left", "Mid Right", "Lower Left Basal", "Lower Right Basal"]
        },
        "prototypes": {
            "PNEUMONIA": pneu_centroid,
            "NORMAL": norm_centroid
        },
        "reference_exemplars": {
            "pneumonia": pneumonia_exemplars[:20],
            "normal": normal_exemplars[:20]
        }
    }
    
    out_dir_src = BASE_DIR / "src" / "data"
    out_dir_src.mkdir(parents=True, exist_ok=True)
    out_path_src = out_dir_src / "chest_xray_dataset_model.json"
    with open(out_path_src, "w") as f:
        json.dump(dataset_model, f, indent=2)
        
    out_dir_api = BASE_DIR / "api" / "data"
    out_dir_api.mkdir(parents=True, exist_ok=True)
    out_path_api = out_dir_api / "chest_xray_dataset_model.json"
    with open(out_path_api, "w") as f:
        json.dump(dataset_model, f, indent=2)
        
    print(f"Saved dataset model successfully to:")
    print(f" - {out_path_src}")
    print(f" - {out_path_api}")
    print(f"Pneumonia prototype: {pneu_centroid}")
    print(f"Normal prototype: {norm_centroid}")

if __name__ == "__main__":
    main()
