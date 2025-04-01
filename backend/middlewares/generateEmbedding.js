
import axios from "axios";
export default async function generateEmbedding(text) {
    try {
      const response = await axios.post(EMBEDDING_API_URL, {
        input: text,
        model: "llama3" 
      }, {
        headers: { "Authorization": `Bearer ${API_KEY}` }
      });
  
      return response.data.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  };