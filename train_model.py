# train_model.py

import sys
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def main():
    csv_file = sys.argv[1]

    data = pd.read_csv(csv_file)

    X = data[['Concentration', 'pH', 'Conductivity', 'Temperature']]
    y = data['Chemical']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    joblib.dump(model, 'chemical_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')

    print("✅ Model trained and saved!")

if __name__ == '__main__':
    main()
