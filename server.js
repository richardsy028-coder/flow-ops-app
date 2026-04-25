const express = require("express");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3010;

console.log("KEY LOADED:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/diagnose", async (req, res) => {
  try {
    const { industry, problem } = req.body;

    if (!problem) {
      return res.status(400).json({ error: "Problem is required." });
    }

    const prompt = `
You are a senior COO and operations strategist.

Diagnose this business operations problem.

Industry: ${industry}

Problem:
${problem}

Return ONLY valid JSON:
{
  "executiveSummary": "",
  "coreProblem": "",
  "rootCauses": [],
  "priorityActions": [],
  "kpis": [],
  "expectedOutcome": "",
  "cooVerdict": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const raw = completion.choices[0].message.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI did not return JSON.");
    }

    res.json(JSON.parse(jsonMatch[0]));

  } catch (err) {
    console.error("BACKEND ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});