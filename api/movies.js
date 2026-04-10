module.exports = async function handler(req, res) {
  const query = req.query.query;
  const page = req.query.page || 1;
  const apiKey = process.env.OMDB_API_KEY;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const url = `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`;

  try {
    const apiRes = await fetch(url);
    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data from OMDB" });
  }
};
