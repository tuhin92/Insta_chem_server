const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const port = 5000; // you can choose any port

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Chemical Prediction API!');
});
// app.get('/health', (req, res) => {})

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to upload CSV and train the model
app.post('/train', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);

  const pythonProcess = spawn('python', ['train_model.py', filePath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`train_model.py exited with code ${code}`);
    res.json({ message: 'Model trained successfully!' });
  });
});

// Route to predict chemical from input values
app.post('/predict', (req, res) => {
  const { concentration, pH, conductivity, temperature } = req.body;

  const pythonProcess = spawn('python', ['predict_chemical.py', concentration, pH, conductivity, temperature]);

  let result = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`predict_chemical.py exited with code ${code}`);
    res.json({ chemical: result.trim() });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
