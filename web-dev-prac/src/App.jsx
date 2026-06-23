import { useState } from "react";

function App() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState("");

  const checkEvenOdd = () => {
    if (num === "") {
      setResult("Please enter a number.");
    } else {
      if (Number(num) % 2 === 0) {
        setResult(`${num} is an Even Number`);
      } else {
        setResult(`${num} is an Odd Number`);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Even and Odd Checker</h2>

      <input
        type="number"
        placeholder="Enter a Number"
        value={num}
        onChange={(e) => setNum(e.target.value)}
      />
      <br />
      <br />

      <button onClick={checkEvenOdd}>Check</button>

      <h3>{result}</h3>
    </div>
  );
}

export default App;
