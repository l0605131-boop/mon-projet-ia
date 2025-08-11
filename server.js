import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Accéder à la clé API sécurisée depuis les variables d'environnement de Vercel
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("La clé API n'est pas définie.");
    // Vous pouvez gérer l'erreur de manière plus élégante en production
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/shorten', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Le titre est manquant.' });
    }

    try {
        const prompt = `Raccourcis le titre suivant pour qu'il soit optimisé pour YouTube (moins de 60 caractères) tout en conservant son sens. Réponds uniquement avec le nouveau titre, sans texte supplémentaire : "${title}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ shortenedTitle: text });
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
        res.status(500).json({ error: 'Erreur lors du raccourcissement du titre.' });
    }
});

// Pour la version locale, si vous voulez tester
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Export de l'application pour Vercel (fonctions serverless)
export default app;
