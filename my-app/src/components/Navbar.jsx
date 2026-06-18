export default function Navbar({ page, setPage }) {
  function handleClick(pg) {
    setPage(pg);
  }
  return (
    <nav className="bg-gray-800 sticky top-0 inset-x-0 w-full text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">My App</div>
          <div className="space-x-4">
            <a
              href="/"
              className="hover:text-gray-300"
              onClick={() => handleClick("home")}
            >
              Home
            </a>
            <a
              href="#about"
              className="hover:text-gray-300"
              onClick={() => handleClick("about")}
            >
              About
            </a>
            <a
              href="#contact"
              className="hover:text-gray-300"
              onClick={() => handleClick("contact")}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
