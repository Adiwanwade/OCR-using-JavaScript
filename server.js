const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle OCR requests
app.post('/perform-ocr', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  // Perform OCR using Tesseract
  Tesseract.recognize(
    req.file.buffer,
    'eng',
    { logger: info => console.log(info) }
  ).then(({ data: { text } }) => {
    res.json({ text });
  }).catch(error => {
    console.error('OCR Error:', error.message);
    res.status(500).json({ error: 'Error performing OCR.' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
