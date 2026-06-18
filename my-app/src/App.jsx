import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
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
          <div className="text-center">
            <h1 className="text-3xl font-bold">About Page</h1>
            <p className="mt-2 text-gray-600">
              This is the about page of the application.
            </p>
          </div>
        )}
        {page === "contact" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Contact Page</h1>
            <p className="mt-2 text-gray-600">
              This is the contact page of the application.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
