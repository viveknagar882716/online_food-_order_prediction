# app.py
from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load model
try:
    model = joblib.load('model.pkl')
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", e)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data
        data = request.json
        
        # Extract and convert
        features = np.array([[
            int(data['age']),
            int(data['gender']),
            int(data['marital']),
            int(data['occupation']),
            int(data['income']),
            int(data['education']),
            int(data['family']),
            int(data['pincode']),
            int(data['feedback'])
        ]])

        # Predict
        prediction = model.predict(features)[0]
        proba = model.predict_proba(features)[0].tolist()  # [P(No), P(Yes)]

        return jsonify({
            'success': True,
            'prediction': 'Yes' if prediction == 1 else 'No',
            'confidence': max(proba) * 100
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)