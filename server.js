// Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Création de l'application Express
const app = express();
const PORT = 3000;  // Port d'écoute du serveur
const FILE_PATH = 'data.txt';  // Chemin du fichier où les données sont stockées

// Configuration des middlewares
app.use(cors());  // Activation du CORS
app.use(express.json());  // Middleware pour analyser les requêtes JSON
app.use(express.static('public'));  // Servir les fichiers statiques du répertoire 'public'

// Route pour récupérer la dernière ligne stockée
app.get('/last-line', (req, res) => {
    if (!fs.existsSync(FILE_PATH)) {  // Si le fichier n'existe pas
        return res.json({ lastLine: '' });
    }
    const lines = fs.readFileSync(FILE_PATH, 'utf8')
                    .split('\n')
                    .filter(line => line.trim());  // Lecture et filtration des lignes non vides
    const lastLine = lines.length > 0 ? lines[lines.length - 1] : '';  // Dernière ligne non vide
    res.json({ lastLine });
});

// Route pour stocker un nouveau message
app.post('/submit', (req, res) => {
    console.log("Requête reçue :", req.body);  // Afficher les données reçues dans la console

    const { name, text } = req.body;  // Extraire le nom et le texte de la requête

    if (!name || !text) {  // Vérifier que les champs ne sont pas vides
        return res.status(400).json({ error: 'Nom ou texte manquant' });
    }

    const newEntry = `${name}: ${text}`;  // Créer une nouvelle entrée
    fs.appendFileSync(FILE_PATH, newEntry + '\n');  // Ajouter l'entrée au fichier
    res.json({ success: true });  // Répondre avec succès
});

// Lancer le serveur et écouter sur le port défini
app.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
