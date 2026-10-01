from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load("models/energy_consumption_model.pkl")

# Load feature names
feature_names = joblib.load("models/feature_names.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/model-info")
def model_info():
    return jsonify({
        "model": "Tuned XGBoost",
        "features": feature_names
    })


@app.route("/api/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        required_features = [
            "Hour",
            "Day",
            "Month",
            "Day_of_Week",
            "Is_Weekend",
            "Lag_1",
            "Lag_24",
            "Lag_168",
            "Rolling_3",
            "Rolling_24",
            "Rolling_168"
        ]

        missing = [
            feature for feature in required_features
            if feature not in data or data[feature] == ""
        ]

        if missing:
            return jsonify({
                "success": False,
                "error": "Missing values: " + ", ".join(missing)
            }), 400

        if not 0 <= data["Hour"] <= 23:
            raise ValueError("Hour must be between 0 and 23")

        if not 1 <= data["Day"] <= 31:
            raise ValueError("Day must be between 1 and 31")

        if not 1 <= data["Month"] <= 12:
            raise ValueError("Month must be between 1 and 12")

        if not 0 <= data["Day_of_Week"] <= 6:
            raise ValueError("Day of Week must be between 0 and 6")

        if data["Is_Weekend"] not in [0, 1]:
            raise ValueError("Is Weekend must be 0 or 1")

        features = [
            data["Hour"],
            data["Day"],
            data["Month"],
            data["Day_of_Week"],
            data["Is_Weekend"],
            data["Lag_1"],
            data["Lag_24"],
            data["Lag_168"],
            data["Rolling_3"],
            data["Rolling_24"],
            data["Rolling_168"]
        ]

        input_data = np.array(features).reshape(1, -1)

        prediction = model.predict(input_data)[0]

        return jsonify({
            "success": True,
            "prediction": float(prediction)
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route("/api/forecast")
def forecast():

    # Temporary forecast data
    forecast_data = [
        {"time": "00:00", "value": 2.45},
        {"time": "01:00", "value": 2.31},
        {"time": "02:00", "value": 2.18},
        {"time": "03:00", "value": 2.05},
        {"time": "04:00", "value": 2.12},
        {"time": "05:00", "value": 2.30},
        {"time": "06:00", "value": 2.65},
        {"time": "07:00", "value": 3.10},
        {"time": "08:00", "value": 3.45},
        {"time": "09:00", "value": 3.20},
        {"time": "10:00", "value": 3.05},
        {"time": "11:00", "value": 2.90},
        {"time": "12:00", "value": 2.85},
        {"time": "13:00", "value": 2.95},
        {"time": "14:00", "value": 3.10},
        {"time": "15:00", "value": 3.25},
        {"time": "16:00", "value": 3.40},
        {"time": "17:00", "value": 3.65},
        {"time": "18:00", "value": 3.90},
        {"time": "19:00", "value": 3.75},
        {"time": "20:00", "value": 3.50},
        {"time": "21:00", "value": 3.20},
        {"time": "22:00", "value": 2.90},
        {"time": "23:00", "value": 2.65}
    ]

    return jsonify(forecast_data)
@app.route("/api/weekly-forecast")
def weekly_forecast():

    weekly_data = [
        {"day": "Monday", "value": 2.85},
        {"day": "Tuesday", "value": 3.10},
        {"day": "Wednesday", "value": 2.95},
        {"day": "Thursday", "value": 3.25},
        {"day": "Friday", "value": 3.40},
        {"day": "Saturday", "value": 2.70},
        {"day": "Sunday", "value": 2.50}
    ]

    return jsonify(weekly_data)


if __name__ == "__main__":
    app.run(debug=True)