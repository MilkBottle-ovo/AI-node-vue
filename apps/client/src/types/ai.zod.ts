import { z } from "zod";
const MessageSchema = z.object({
  role: z.union([
    z.literal("user"),
    z.literal("system"),
    z.literal("assistant"),

  ]),
  content: z.string().trim().min(1, "Content cannot be empty"),
});

const ChatRequestSchema = z.object({
  sessionId: z.string().describe("Unique identifier for the chat session"),
  messages: z.array(MessageSchema).min(1, "At least one message is required"),
  //temperature:z.number().min(0).max(1).optional(),
});
type ChatRequest = z.infer<typeof ChatRequestSchema>;
type ChatMessage = z.infer<typeof MessageSchema>;

export type { ChatRequest, ChatMessage };
