import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Home Page</h1>
      <p className="mt-2 text-gray-600">
        This is the home page of the application.
      </p>
      <button
        onClick={() => setCount((count) => count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      >
        count is {count}
      </button>
    </div>
  );
}
