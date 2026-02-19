import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/ask", async (req, res) => {
  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.json({ answer: "Invalid chat history." });
    }

    // ✅ LIMIT CONTEXT SIZE
    const trimmedHistory = [
      history[0],
      ...history.slice(-10)
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: trimmedHistory,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content ??
      "⚠️ Model returned empty response.";

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.json({
      answer: "Server error while generating response."
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);