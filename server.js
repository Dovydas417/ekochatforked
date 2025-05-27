const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // ← Load .env variables

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // ← Loaded from .env
  })
);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).json({ error: 'Failed to connect to OpenAI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EkoChat running at http://localhost:${PORT}`));
