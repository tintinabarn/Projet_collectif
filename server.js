const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'data.txt'); // Fichier dans le même dossier que server.js

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Sert index.html, script.js, et style.css

// Route pour récupérer la dernière ligne stockée
app.get('/last-line', async (req, res) => {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        const lines = data.split('\n').filter(line => line.trim());
        const lastLine = lines.length > 0 ? lines[lines.length - 1] : '';
        const lastText = lastLine.split(': ').slice(1).join(': ') || '';
        res.json({ lastLine: lastText });
    } catch (error) {
        res.json({ lastLine: '' });
    }
});

// Route pour récupérer tout le texte
app.get('/all-lines', async (req, res) => {
    try {
        res.download('FILE_PATH');
    } catch (error) {
        return res.status(400).json({ error: 'Fichier manquant all' });
    }
});

// Route pour stocker un nouveau message
app.post('/submit', async (req, res) => {
    console.log("Requête reçue :", req.body);
    let { name, text } = req.body;

    if (!name || !text) {
        return res.status(400).json({ error: 'Nom ou texte manquant' });
    }

    // Sécuriser les entrées
    name = sanitizeHtml(name.trim());
    text = sanitizeHtml(text.trim());

    const newEntry = `${name}: ${text}`;
    try {
        await fs.appendFile(FILE_PATH, newEntry + '\n');
        res.json({ success: true, text });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'écriture du fichier' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
