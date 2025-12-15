interface UserMessage {
  role: "user";
  content: string;
}
interface AIMessage {
  role: "assistant";
  content: string;
}
interface ToolMessage {
  role: "tool";
  content: string;
}
interface SystemMessage {
  role: "system";
  content: string;
}
enum Role {
  USER = "user",
  AI = "ai",
  TOOL = "tool",
  SYSTEM = "system",
}
type ChatMessage = UserMessage | AIMessage | ToolMessage | SystemMessage;
export type { ChatMessage, Role };
