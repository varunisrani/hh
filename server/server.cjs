const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FilmScriptAnalyzer } = require('./pdfscript.cjs'); // Assuming pdfscript.js is in the same directory

const app = express();
const port = 3001;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.post('/api/analyze-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  const pdfPath = req.file.path;
  const scriptName = req.file.originalname?.replace(/\.pdf$/i, '') || 'unknown_script';

  console.log(`Processing PDF: ${req.file.originalname} -> ${scriptName}`);
  console.log(`File path: ${pdfPath}`);

  try {
    const analyzer = new FilmScriptAnalyzer(pdfPath, scriptName);
    const analysisResult = await analyzer.runCompleteAnalysis();
    res.json({ success: true, data: analysisResult });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 