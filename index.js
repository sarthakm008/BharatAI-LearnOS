import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Explain clearly for a student." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    res.json({ answer: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ answer: "Error: " + err.message });
  }
});

app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000"));
