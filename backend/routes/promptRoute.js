import express from "express";
import promptBasedQuery from "../controllers/promptController.js";

const PromptRouter = express.Router();
PromptRouter.post("/prompt", promptBasedQuery);
export default PromptRouter;
