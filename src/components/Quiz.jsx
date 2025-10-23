import React from "react";

function Quiz({ history }) {
  return (
    <div>
      <h3>Quiz Q&A History</h3>
      <ol>
        {history.map((item, i) => (
          <li key={i}>
            <strong>Q:</strong> {item.question}
            <br />
            <strong>A:</strong> {item.answer}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Quiz;