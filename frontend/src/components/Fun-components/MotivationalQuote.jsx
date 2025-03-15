import { useState, useEffect } from "react";

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("Fetching quote...");
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    try {
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent("https://zenquotes.io/api/random")}&t=${new Date().getTime()}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      const parsedData = JSON.parse(data.contents || "{}");
      if (!parsedData[0]?.q || !parsedData[0]?.a) {
        throw new Error("Invalid quote data");
      }
      setQuote(`${parsedData[0].q} — ${parsedData[0].a}`);
      setError(null);
    } catch (err) {
      setError("⚠️ Could not load quote. Please try again.");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-md text-center max-w-sm mx-auto mt-4">
      <h3 className="text-lg font-bold">🌟 Daily Motivation</h3>
      <p className="text-xl mt-2">{error || quote}</p>
      <button
        onClick={fetchQuote}
        className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Get New Quote
      </button>
    </div>
  );
};

export default MotivationalQuote;