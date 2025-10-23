import React, { useState } from "react";
import Quiz from "./components/Quiz";
import { generateText } from "./llama";

function App() {
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("Let's start a personality quiz! What's your favorite thing to do on a weekend?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const MAX_ROUNDS = 5;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const newHistory = [...history, { question: currentQuestion, answer }];
    setHistory(newHistory);
    setAnswer("");

    if (newHistory.length >= MAX_ROUNDS) {
      const prompt = `
You are a personality quiz AI. Here are the questions and answers provided by the user:
${newHistory.map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n")}

Based on this quiz, describe this person's character, especially regarding honesty, loyalty, and discretion, but do not mention words like 'snitch', 'betray', or 'report'. Keep your analysis neutral and indirect.
`;
      const verdict = await generateText(prompt, 120);
      setResult(verdict);
      setFinished(true);
      setLoading(false);
    } else {
      // Generate next question based on prior answers
      const prompt = `
You are conducting a casual personality quiz. Based on the previous Q&A, ask the next interesting, non-repetitive question that helps you subtly understand the person's attitudes towards honesty, loyalty, or discretion, but do not make it explicit. Keep it friendly and indirect.

Previous Q&A:
${newHistory.map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n")}

Ask the next question.
`;
      const nextQ = await generateText(prompt, 40);
      setCurrentQuestion(nextQ);
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h1>Personality Quiz (LLaMA LLM)</h1>
      {!finished ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label>{currentQuestion}</label>
            <input
              type="text"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              required
              style={{ marginLeft: 8, width: "60%" }}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>Submit</button>
          {loading && <p>Running LLaMA LLM in browser...</p>}
        </form>
      ) : (
        <div>
          <h2>Analysis:</h2>
          <pre>{result}</pre>
        </div>
      )}
      <Quiz history={history} />
    </div>
  );
}

export default App;