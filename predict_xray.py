import os
import sys
import json

# Suppress C++ oneDNN and TF GPU warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

import numpy as np
import tensorflow as tf

tf.get_logger().setLevel('ERROR')

def run_prediction(image_path, model_path="chest_xray_model.keras", threshold=0.80):
    if not os.path.exists(image_path):
        return {"success": False, "error": f"Image not found: {image_path}"}
    
    # Load and preprocess image
    img_array = None
    if HAS_PIL:
        try:
            img = Image.open(image_path).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.expand_dims(np.array(img, dtype=np.float32), axis=0)
        except Exception as e:
            img_array = None

    if img_array is None and HAS_CV2:
        try:
            cv_img = cv2.imread(image_path)
            if cv_img is not None:
                cv_img = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
                cv_img = cv2.resize(cv_img, (224, 224))
                img_array = np.expand_dims(cv_img.astype(np.float32), axis=0)
        except Exception as e:
            img_array = None

    if img_array is None:
        return {"success": False, "error": "Could not decode or resize image using PIL or OpenCV"}

    # Load model & predict
    model = tf.keras.models.load_model(model_path)
    raw_pred = model.predict(img_array, verbose=0)[0]

    # Two-class softmax: [0]=NORMAL, [1]=PNEUMONIA
    if len(raw_pred) >= 2:
        prob_normal = float(raw_pred[0])
        prob_pneumonia = float(raw_pred[1])
    else:
        prob_pneumonia = float(raw_pred[0])
        prob_normal = 1.0 - prob_pneumonia

    if prob_pneumonia >= threshold:
        label = "PNEUMONIA"
        conf = prob_pneumonia
    else:
        label = "NORMAL"
        conf = prob_normal

    return {
        "success": True,
        "model_name": "Trained Chest X-Ray Deep Learning Model (CNN/MobileNetV2)",
        "predicted_class": label,
        "confidence": round(conf, 4),
        "confidence_percentage": f"{round(conf * 100, 2)}%",
        "probabilities": {
            "NORMAL": round(prob_normal, 4),
            "PNEUMONIA": round(prob_pneumonia, 4)
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided."}))
        sys.exit(1)
        
    result = run_prediction(sys.argv[1])
    print(json.dumps(result, indent=2))