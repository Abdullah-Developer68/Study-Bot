type ChatThread = {
  session_id: string;
  profile_id: string;
  title: string;
  model: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

type ChatMessage = {
  message_id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  attachments?: Array<{ document_id: string; name: string; type: string }>;
  created_at: string;
}

export type { ChatThread, ChatMessage };
