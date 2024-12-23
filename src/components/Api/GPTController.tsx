import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';
const API_KEY = 'YOUR_API_KEY_HERE'; // Reemplaza con tu clave de API

export const fetchGPTResponse = async (prompt: string) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        prompt,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    throw error;
  }
};