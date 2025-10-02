export default async function handler(req, res) {
  const { symbol } = req.query;
  const apiKey = process.env.FINNHUB_KEY;

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
