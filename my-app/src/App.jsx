import { useState } from "react";
import Navbar from "./components/Navbar";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

function App() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState("home");

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        {page === "home" && (
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          >
            count is {count}
          </button>
        )}
      </div>
    </>
  );
}

export default App;
