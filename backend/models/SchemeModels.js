import mongoose from "mongoose"
const SchemeSchema = new mongoose.Schema({
    state: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    steps: { type: String, required: true },
    tags: { type: [String], required: true }, 
    link: { type: String }, 
    embeddings:{type:[Number]},
  });
  
const SchemaModel = mongoose.models.schemes || mongoose.model("schemes", SchemeSchema);
export default SchemaModel;