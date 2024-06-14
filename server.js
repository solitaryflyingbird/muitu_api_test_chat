import express from 'express';
import bodyParser from 'body-parser';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));  // public 디렉토리에서 정적 파일 제공

async function getSummaryFromGPT(content, apiKey) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
    const data = {
        model: 'gpt-4o',
        messages: [{ role: 'user', content: content }],
        max_tokens: 350,
        temperature: 0.7,
        n: 1
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData.choices[0].message.content.trim();
}

async function getSummaryFromCLAUDE(content, apiKey) {
  const anthropic = new Anthropic({ apiKey });

  const data = {
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{ role: "user", content: content }],
  };

  const response = await anthropic.messages.create(data);

  if (!response) {
      throw new Error('Failed to get response from Claude');
  }

  return response.content[0].text.trim();
}



app.post('/chat', async (req, res) => {
    const { message, apiProvider, apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    try {
        if (apiProvider === 'anthropic') {
            const reply = await getSummaryFromCLAUDE(message, apiKey);
            res.json({ reply: reply });
        } else if (apiProvider === 'openai') {
            const reply = await getSummaryFromGPT(message, apiKey);
            res.json({ reply: reply });
        } else {
            res.status(400).json({ error: 'Invalid API provider' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get response from the chatbot' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
