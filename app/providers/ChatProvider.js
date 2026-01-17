"use client";
import { useChat } from "@ai-sdk/react";
import ChatContext from "@/app/context/ChatContext";
import { useEffect } from "react";

// Provides access to the context
const ChatProvider = ({ children }) => {
  const chat = useChat({
    api: "/api/chat",
    experimental_throttle: 30, // throttles updates to every 30ms
  });

  useEffect(() => {
    console.log("Chat context:", chat);
    console.log("Available methods:", Object.keys(chat));
  }, [chat]);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
