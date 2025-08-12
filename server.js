import 'dotenv/config';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

app.use(express.json());
app.use(express.static('public'));

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("La clé API n'est pas définie.");
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

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ],
        });
        
        const response = await result.response;
        const text = response.text();

        res.json({ shortenedTitle: text });
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
        res.status(500).json({ error: 'Erreur lors du raccourcissement du titre.' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

export default app;
