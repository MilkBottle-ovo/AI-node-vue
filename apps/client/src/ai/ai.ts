import {ChatOllama} from "@langchain/ollama";
import {createAgent} from "langchain";
export const model = new ChatOllama({
  
  model: "qwen2.5:7b",
  baseUrl: "http://localhost:11434",
  temperature: 0.7,
});

export const runAI = async () => {

  const promot = `帮我生成一个Vite+Vue3的项目脚手架`;
  const stream = await model.stream(promot);
  for await (const chunk of stream) {
    const text = chunk?.content ?? "";
    for (const c of text) {
      console.log(c); // \n 会照常换行
   await new Promise((r) => setTimeout(r, 20));
    }
  }
};
