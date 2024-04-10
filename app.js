const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pass1Assembler = require('./pass1assembler');

const app = express();
const port = 3000;

// Set up Multer for handling file uploads
const upload = multer({
    dest: 'uploads/' // Directory where uploaded files will be stored
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint for file processing
app.post('/process', upload.fields([{ name: 'opFile', maxCount: 1 }, { name: 'inputFile', maxCount: 1 }]), (req, res) => {
    // Retrieve uploaded files
    const opFile = req.files['opFile'][0];
    const inputFile = req.files['inputFile'][0];

    // Perform pass 1 assembly
    const { outputLines, symTable } = pass1Assembler(opFile.path, inputFile.path);

    // Send a response indicating success
    res.json({ message: 'Files processed successfully.' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});