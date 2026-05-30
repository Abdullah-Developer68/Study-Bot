import { SupabaseClient } from "@supabase/supabase-js";
import type { ChatThread, ChatMessage } from "../types/chat.sdk.types";

// Creates a new chat thread in the database.
const createChatThread = async (
  supabase: SupabaseClient,
  userId: string,
  title: string = "New Chat",
  model: string = "z-ai/glm-4.5-air:free",
): Promise<ChatThread | null> => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      profile_id: userId,
      title,
      model,
      is_archived: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create thread:", error);
  }

  return data as ChatThread;
};

// Fetches all threads for a given user from the database.
const fetchUserThreads = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<ChatThread[]> => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch threads:", error);
    return [];
  }

  return data as ChatThread[];
};

// Fetches a thread with its messages from the database.
const fetchThreadWithMessages = async (
  supabase: SupabaseClient,
  threadId: string,
  userId: string,
): Promise<{ thread: ChatThread | null; messages: ChatMessage[] }> => {
  const { data: threadData, error: threadError } = await supabase
    .from("chat_sessions")
    .select()
    .eq("session_id", threadId)
    .single();

  if (threadError) {
    console.error("Failed to fetch thread:", threadError);
    return { thread: null, messages: [] };
  }

  const { data: messageData, error: messageError } = await supabase
    .from("chat_messages")
    .select()
    .eq("session_id", threadId)
    .order("created_at", { ascending: false });

  if (messageError) {
    console.error("Failed to fetch messages:", messageError);
    return { thread: threadData as ChatThread, messages: [] };
  }

  return {
    thread: threadData as ChatThread,
    messages: messageData as ChatMessage[],
  };
};

// Update thread title
const updateThreadTitle = async (
  supabase: SupabaseClient,
  threadId: string,
  title: string,
): Promise<ChatThread | null> => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("session_id", threadId)
    .select()
    .single();

  if (error) {
    console.error("Failed to update thread:", error);
    return null;
  }

  return data as ChatThread;
};

// Archive thread
const archiveThread = async (
  client: SupabaseClient,
  threadId: string,
): Promise<boolean> => {
  const { error } = await client
    .from("chat_sessions")
    .update({ is_archived: true })
    .eq("session_id", threadId);

  if (error) {
    console.error("Failed to archive thread:", error);
    return false;
  }

  return true;
};

export {
  createChatThread,
  fetchUserThreads,
  fetchThreadWithMessages,
  updateThreadTitle,
  archiveThread,
};
