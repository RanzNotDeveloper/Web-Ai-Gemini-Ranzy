import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    
    // API Key diisikan langsung di sini
    const ai = new GoogleGenAI({
      apiKey: "AQ.Ab8RN6JNiZnGz2CCLxrD-Dwh1ZvmVGH4ATKvjqYgMjOt03oBhA"
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghubungi AI." });
  }
}
