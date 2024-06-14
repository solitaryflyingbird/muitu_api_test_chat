document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('anthropicApiKey').value = localStorage.getItem('anthropicApiKey') || '';
  document.getElementById('openaiApiKey').value = localStorage.getItem('openaiApiKey') || '';

  // Add input event listeners to save API keys to localStorage
  document.getElementById('anthropicApiKey').addEventListener('input', () => {
    localStorage.setItem('anthropicApiKey', document.getElementById('anthropicApiKey').value);
  });

  document.getElementById('openaiApiKey').addEventListener('input', () => {
    localStorage.setItem('openaiApiKey', document.getElementById('openaiApiKey').value);
  });
});

async function sendMessage() {
  const apiProvider = document.getElementById('apiProvider').value;
  const anthropicApiKey = document.getElementById('anthropicApiKey').value;
  const openaiApiKey = document.getElementById('openaiApiKey').value;
  const userInput = document.getElementById('userInput').value;
  
  const apiKey = apiProvider === 'anthropic' ? anthropicApiKey : openaiApiKey;

  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userInput, apiProvider: apiProvider, apiKey: apiKey })
  });
  const data = await response.json();
  document.getElementById('chatbox').innerText = apiProvider === 'anthropic' ? 'Claude: ' + data.reply : 'GPT: ' + data.reply;
}
