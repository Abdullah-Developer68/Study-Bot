// The edge function accepts the same chat payload shape used by useChat.
// We keep this loose because the client may send extra fields, but we only
// care about role, content, and assistant parts when building the prompt.
type IncomingMessageRole = "user" | "assistant" | "system" | "tool";

type IncomingMessage = {
  role: IncomingMessageRole;
  content?: string;
  text?: string;
  parts?: Array<{ type?: string; text?: string }>;
};

// export type ChatRequestBody = {
//   messages?: IncomingMessage[];
//   model?: string;
//   session_id?: string;
// };

export type { IncomingMessage, IncomingMessageRole };
