import { useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [results, setResults] = useState([]);

  const demoSymbols = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "META", name: "Meta Platforms Inc." },
  ];

  const handleSearch = async () => {
    const filtered = [];
    for (let stock of demoSymbols) {
      try {
        const res = await fetch(`/api/quote?symbol=${stock.symbol}`);
        const data = await res.json();
        if (data.c >= minPrice && data.c <= maxPrice) {
          filtered.push({
            symbol: stock.symbol,
            name: stock.name,
            price: data.c,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    setResults(filtered);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stocks.csv";
    a.click();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">📈 Stock Picker</h1>
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="border rounded p-2 w-28"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="border rounded p-2 w-28"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>
      <ul className="space-y-2">
        {results.map((r) => (
          <li
            key={r.symbol}
            className="p-4 bg-white shadow rounded flex justify-between"
          >
            <span>{r.symbol} - {r.name}</span>
            <span className="font-semibold">${r.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
