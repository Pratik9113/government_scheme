const mongoose = require("mongoose")
const SchemeSchema = new mongoose.Schema({
    state: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    steps: { type: String, required: true },
    tags: { type: [String], required: true }, 
    link: { type: String }, 
  });
  
const SchemaModel = mongoose.models.scheme || mongoose.model("scheme", SchemeSchema);
module.exports = SchemaModel;
