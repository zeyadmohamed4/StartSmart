from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# تحديد أسماء الموديلات يدويًا
MODEL_FILES = [
    "funding_amount.pkl",
    "funding_round_type.pkl",
    "project_status.pkl",
    "total_funding_recieved.pkl"
]

# تحميل الموديلات يدويًا من ملفات
models = {}

def load_models():
    for model_file in MODEL_FILES:
        try:
            model_name = model_file.replace(".pkl", "")
            models[model_name] = joblib.load(model_file)
            print(f"[+] Model '{model_name}' loaded successfully.")
        except Exception as e:
            print(f"[!] Failed to load model {model_name}: {e}")

load_models()  # تحميل الموديلات عند بدء التشغيل

# نقطة اختبار
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ML Models API is running!", "models_loaded": list(models.keys())})


# نقطة التنبؤ بموديل معين
@app.route("/predict/<model_name>", methods=["POST"])
def predict(model_name):
    if model_name not in models:
        return jsonify({"error": f"Model '{model_name}' not found."}), 404

    model = models[model_name]

    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # تحويل البيانات إلى DataFrame
        input_df = pd.DataFrame([data])

        # التنبؤ
        # حالة لو الموديل عبارة عن dict فيه model و label_map
        if isinstance(model, dict) and "model" in model:
            clf = model["model"]
            label_map = model.get("label_map", {})

            prediction = clf.predict(input_df)
            prediction_value = prediction[0]

            # رجّع التوقع كنص لو موجود في label_map
            prediction_text = label_map.get(prediction_value, str(prediction_value))

            return jsonify({
                "model": model_name,
                "prediction": prediction_text
            })

        # حالة الموديلات العادية (Regression مثلاً)
        else:
            prediction = model.predict(input_df)
            return jsonify({
                "model": model_name,
                "prediction": float(prediction[0])
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# تشغيل التطبيق
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

