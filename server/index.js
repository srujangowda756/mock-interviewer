import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Helper to extract JSON from AI response
function extractJSON(text) {
    try {
        const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (!match) return null;
        const cleaned = match[0].trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Extraction failed for:", text);
        return null;
    }
}

// Helper to read/write JSON DB
async function getDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { interviews: [] };
    }
}

async function saveDb(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        geminiConfigured: !!GEMINI_API_KEY,
        dbPath: DB_PATH
    });
});
app.post('/api/interviews', async (req, res) => {
    const { jobDescription, difficulty } = req.body;
    if (!jobDescription) return res.status(400).json({ error: 'Job description required' });
    if (!genAI) return res.status(500).json({ error: 'Gemini API key not configured' });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const prompt = `You are a senior technical interviewer.
Generate exactly 10 interview questions based on the following job description.
Difficulty level: ${difficulty || "intermediate"}.
Focus on practical technical knowledge and real-world problem solving.
Return ONLY a JSON array of 10 question strings, no other text.

Job Description:    
${jobDescription}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        let questions = extractJSON(content);
        if (!questions || !Array.isArray(questions)) {
            console.warn("Falling back to default questions. Content was:", content);
            questions = [
                "Describe your experience with these technologies.",
                "How do you solve complex technical issues?",
                "Tell me about a challenging project you've completed.",
                "How do you ensure the quality of your code?",
                "How do you stay updated with new technologies?"
            ];
        } else {
            questions = questions.slice(0, 10).map(String);
        }

        const interview = {
            id: nanoid(),
            job_description: jobDescription,
            difficulty,
            questions,
            answers: [],
            scores: [],
            status: 'in_progress',
            created_at: new Date().toISOString()
        };

        const db = await getDb();
        db.interviews.push(interview);
        await saveDb(db);

        res.json(interview);
    } catch (error) {
        console.error("Gemini Generation Error Details (Full):");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        if (error.response) {
            console.error("Response:", JSON.stringify(error.response, null, 2));
        }
        res.status(500).json({ error: 'Failed to create interview', details: error.message });
    }
});

app.get('/api/interviews/:id', async (req, res) => {
    const db = await getDb();
    const interview = db.interviews.find(i => i.id === req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
});

app.post('/api/interviews/:id/evaluate', async (req, res) => {
    const { questionIndex, answer } = req.body;
    const db = await getDb();
    const interviewIndex = db.interviews.findIndex(i => i.id === req.params.id);
    if (interviewIndex === -1) return res.status(404).json({ error: 'Interview not found' });

    const interview = db.interviews[interviewIndex];
    const question = interview.questions[questionIndex];

    if (!genAI) return res.status(500).json({ error: 'Gemini API key not configured' });
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const prompt = `Evaluate the candidate's answer for the given interview question.
Score the answer from 1–10 and provide strengths, weaknesses, and improvement suggestions.

Question: ${question}
Candidate's Answer: ${answer}

Return ONLY valid JSON in this exact format:
{
  "score": <number 1-10>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvement_suggestions": ["suggestion1", "suggestion2"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const content = response.text();

        let evaluation = extractJSON(content);
        if (!evaluation) {
            console.warn("Falling back to default evaluation. Content was:", content);
            evaluation = { score: 5, strengths: ["Attempted"], weaknesses: ["Response format issue"], improvement_suggestions: ["Provide more detail next time"] };
        }

        interview.answers[questionIndex] = answer;
        interview.scores[questionIndex] = evaluation;

        const isComplete = questionIndex >= interview.questions.length - 1;
        if (isComplete) {
            interview.status = 'completed';
            const avgScore = interview.scores.reduce((sum, s) => sum + (s?.score || 0), 0) / interview.scores.length;
            interview.overall_score = Math.round(avgScore * 10) / 10;
        }

        db.interviews[interviewIndex] = interview;
        await saveDb(db);

        res.json({ evaluation });
    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        res.status(500).json({ error: 'Evaluation failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
