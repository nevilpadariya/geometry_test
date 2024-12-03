const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000' // Your React app's URL
}));
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      req.body,
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error || 'Failed to process request'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});