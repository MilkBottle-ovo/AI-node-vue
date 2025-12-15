import {ChatOllama} from "@langchain/ollama";
import type { Request, Response } from "express";
import type { ChatRequest } from "../schemas/aiSchema.js";

const ollamaModel  = new ChatOllama({
    model:"qwen2.5:7b",
    baseUrl: "http://localhost:11434",
    temperature: 0.7,
})

interface ValidatedRequest extends Request {
    body: ChatRequest
}

const runAI = async(req: ValidatedRequest,res: Response,) => {
    try {
        const{sessionId,messages} = req.body;
        const result = await ollamaModel.stream(messages);
        for await(const chunk of result){
            const sseChunk = `data:${JSON.stringify(chunk)}\n\n`;
            res.write(sseChunk);
            if(res.writableEnded){
                break;
            }
        }
        res.write(`data:[DONE]\n\n`);
        res.end();
    } catch (error ) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("未知错误:", error);
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }    
}
const aiController = {
    runAI,
};
export default aiController;    
    