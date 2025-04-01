import { pipeline } from "@xenova/transformers";
import SchemaModel from "./models/SchemeModels.js";

async function generateEmedding(text){
    const extracter = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const emedding = await extracter(text, {pooling:"mean", normalize:true});
    return emedding.data;
}

const generate  = async function insertDocumentsIntoVectorFormation(){
    try {
        const document = await SchemaModel.find();
        for(const scheme of document){
            const combinedText = `${scheme.title} ${scheme.description} ${scheme.steps}`
            scheme.emedding = await generateEmedding(combinedText);
            await SchemaModel.create(scheme);
        }
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

export default generate;