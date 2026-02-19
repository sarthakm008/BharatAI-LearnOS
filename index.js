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
    const history = req.body.history;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({
        answer: "Invalid request format."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: history
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      answer: "Server error while generating response."
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
