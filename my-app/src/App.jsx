import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        {page === "home" && (
          <Home />
        )}
        {page === "about" && (
          <About />
        )}
        {page === "contact" && (
          <Contact />
        )}
      </div>
    </>
  );
}

export default App;
