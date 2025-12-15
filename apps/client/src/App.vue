<script setup lang="ts">
import { nextTick, ref } from "vue";
import type { ChatRequest, ChatMessage } from "./types/ai.zod";
import MarkdownIt from "markdown-it";
import InputBoxVue from "./components/InputBox.vue";
const md = new MarkdownIt();

const sessionId = `a1b2c3d4-e5f6-7890-abcd-ef0123456789`;
const userInput = ref("");
const messages = ref<ChatMessage[]>([
  {
    role: "system",
    content: "使用中文解决问题",
  },
]);
function defineMessage() {
  messages.value.push(
    { role: "user", content: userInput.value },
    { role: "assistant", content: "" }
  );
  
  nextTick(scrollToBottom)
}
function scrollToBottom() {
  const chatWindow = document.querySelector(".chat-window");
  if (chatWindow) {
    const isAtBottom = chatWindow.scrollHeight - chatWindow.scrollTop - chatWindow.clientHeight<= 90;
    if(isAtBottom){
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }
  

}

function renderMarkdown(content: string) {
  if (!content) return "";
  return md.render(content);
}
async function sendMessage() {
  defineMessage();
  userInput.value = "";
  try {
    const response = await fetch("http://localhost:3000/api/ai/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        messages: messages.value,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      while (true) {
        const { value, done: doneReading } = await reader.read();

        buffer += decoder.decode(value || new Uint8Array(), {
          stream: !doneReading,
        });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const data = part.replace("data:", "").trim();
          if (data === "[DONE]") {
            reader.cancel();
            break;
          }
          try {
            const text = JSON.parse(data).kwargs.content || "";
            const lastMessage = messages.value[messages.value.length - 1];
            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content += text;
            } else {
              messages.value.push({ role: "assistant", content: text });
            }
            await nextTick(scrollToBottom);
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
        if (doneReading) break;
      }
      console.log(messages.value);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    messages.value.pop();
  }
}
</script>
<template>
  <div class="chat-container">
    <div class="chat-window">
      <div
        :class="{
          'message-center': message.role === 'assistant',
          'message-right': message.role === 'user',
          'message-hide': message.role === 'system',
        }"
        v-for="(message, index) in messages"
        :key="index"
      >
        <div
          v-if="message.role === 'assistant'"
          v-html="renderMarkdown(message.content)"
        ></div>

        <div v-if="message.role === 'user'">{{ message.content }}</div>
      </div>
    </div>
    <div class="input-area">
      <!-- <textarea
        v-model="userInput"
        placeholder="please input ... "
        @keydown.enter.prevent="sendMessage"
      >
      </textarea>
      <button @click="sendMessage">send</button> -->
      <InputBoxVue
        v-model:userInput="userInput"
        :send="sendMessage"/>
    </div>
  </div>
</template>
<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to bottom, #ff7f50, #1ed2ff);
}
.chat-window {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  color: #ffffff;
}
.message-hide {
  display: none;
}
.message-center {
  width: 65%;
  text-align: left;
  margin-top: 10px;

}
.message-right {
  max-width: 400px;
  align-self: flex-end;
  padding:5px 10px;
  border-radius: 20px;
  margin-top: 10px;
  margin-right: 20px;
  background: linear-gradient(to top, #00fa7d, #1ed2ff);
  word-break: break-all;
  white-space: normal;
}
.input-area{
  display: block;
}
</style>

<!-- {
    "lc":1,
    "type":"constructor",
    "id":["langchain_core","messages","AIMessageChunk"],
    "kwargs":{
        "content":" larger",
        "tool_call_chunks":[],
        "response_metadata":{},
        "tool_calls":[],
        "invalid_tool_calls":[],
        "additional_kwargs":{}
    }
} -->
