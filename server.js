const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.join(__dirname, 'db', 'db.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Function to read from db.json
const readDbFile = () => {
  try {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return [];
  }
};

// Function to write to db.json
const writeDbFile = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', (req, res) => {
  const notes = readDbFile();
  res.json(notes);
});

// POST a new note
app.post('/api/notes', (req, res) => {
  const notes = readDbFile();
  const newNote = req.body;
  newNote.id = Date.now().toString(); // Generate unique ID (for demo purposes)
  notes.push(newNote);
  writeDbFile(notes);
  res.status(201).json(newNote);
});

// DELETE a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let notes = readDbFile();
  notes = notes.filter(note => note.id !== id);
  writeDbFile(notes);
  res.sendStatus(204);
});

// Serve the index.html file for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});