require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(express.json());

app.post('/api/claude', async (req, res) => {
  const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        prompt: prompt,
        model: 'claude-1',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLAUDE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ output: response.data.output });
  } catch (error) {
    console.error('Error contacting Claude API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error contacting Claude API.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
