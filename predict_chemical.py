# predict_chemical.py

import sys
import joblib
import numpy as np

def main():
    concentration = float(sys.argv[1])
    pH = float(sys.argv[2])
    conductivity = float(sys.argv[3])
    temperature = float(sys.argv[4])

    model = joblib.load('chemical_model.pkl')
    scaler = joblib.load('scaler.pkl')

    input_data = np.array([[concentration, pH, conductivity, temperature]])
    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)
    print(prediction[0])

if __name__ == '__main__':
    main()
