import express from "express";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});



app.post("/ask", async (req, res) => {
  try {
    const history = req.body.history;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({
        answer: "Invalid request format."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "llama3-70b-8192", // ✅ Groq model
      messages: history,
      temperature: 0.7
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({ answer });

  } catch (err) {
    console.error("GROQ ERROR:", err);

    res.status(500).json({
      answer: "Server error while generating response."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
