# model_train.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load data
data = pd.read_csv("onlinefood.csv")

# Preprocess
data["Gender"] = data["Gender"].map({"Male": 1, "Female": 0})
data["Marital Status"] = data["Marital Status"].map({"Married": 2, "Single": 1, "Prefer not to say": 0})
data["Occupation"] = data["Occupation"].map({"Student": 1, "Employee": 2, "Self Employeed": 3, "House wife": 4})
data["Educational Qualifications"] = data["Educational Qualifications"].map({
    "Graduate": 1, "Post Graduate": 2, "Ph.D": 3, "School": 4, "Uneducated": 5})
data["Monthly Income"] = data["Monthly Income"].map({
    "No Income": 0, "Below Rs.10000": 10000, "10001 to 25000": 25000,
    "25001 to 50000": 50000, "More than 50000": 70000})
data["Feedback"] = data["Feedback"].map({"Positive": 1, "Negative ": 0})
data["Output"] = data["Output"].map({"Yes": 1, "No": 0})

# Features
X = data[["Age", "Gender", "Marital Status", "Occupation", "Monthly Income",
          "Educational Qualifications", "Family size", "Pin code", "Feedback"]]
y = data["Output"]

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and test score
joblib.dump(model, 'model.pkl')
print(f"Model accuracy: {model.score(X_test, y_test):.3f}")
print("Model saved as 'model.pkl'")