import SchemaModel from "../models/SchemeModels.js";
import {pipeline} from "@xenova/transformers"
import * as math from "mathjs";
const { dot } = math;
async function generateEmbedding(text) {
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const embedding = await extractor(text, { pooling: "mean", normalize: true });
    return embedding.data;
}
  
  // Function to find relevant documents
  async function findRelevantDocuments(userQuery) {
    const userEmbedding = await generateEmbedding(userQuery);
    const documents = await SchemaModel.find();
  
    let results = documents.map(doc => {
      return {
        text: doc.text,
        similarity: dot(userEmbedding, doc.embedding) // Cosine similarity
      };
    });
  
    results.sort((a, b) => b.similarity - a.similarity); // Sort by relevance
  
    return results.slice(0, 3); // Return top 3 matches
  }

  const promptBasedQuery = async() => {
    try {
        const {query} = req.body;
        if (!query) {
            return res.status(400).json({ error: "Query is required" });
        }
        const results = await findRelevantDocuments(query);
        console.log(results);
        res.json({ success: true, results });
    } catch (error) {
        console.error("Error searching documents:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  export  default promptBasedQuery;