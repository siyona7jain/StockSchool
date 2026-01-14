import { Message } from "@/components/learn/AITutor";

const CHAT_STORAGE_PREFIX = "chat_";
const CHAT_LIST_PREFIX = "chatlist_";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export function saveChat(userId: string, chatId: string, messages: Message[]) {
  if (!userId || !chatId) return;
  const key = `${CHAT_STORAGE_PREFIX}${userId}_${chatId}`;
  localStorage.setItem(key, JSON.stringify(messages));
  
  // Update chat list
  updateChatList(userId, chatId, messages);
}

export function loadChat(userId: string, chatId: string): Message[] | null {
  if (!userId || !chatId) return null;
  const key = `${CHAT_STORAGE_PREFIX}${userId}_${chatId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading chat:", e);
      return null;
    }
  }
  return null;
}

export function deleteChat(userId: string, chatId: string) {
  if (!userId || !chatId) return;
  const key = `${CHAT_STORAGE_PREFIX}${userId}_${chatId}`;
  localStorage.removeItem(key);
  
  // Remove from chat list
  const listKey = `${CHAT_LIST_PREFIX}${userId}`;
  const chatList = getChatList(userId);
  const updatedList = chatList.filter(chat => chat.id !== chatId);
  localStorage.setItem(listKey, JSON.stringify(updatedList));
}

export function getChatList(userId: string): ChatSession[] {
  if (!userId) return [];
  const listKey = `${CHAT_LIST_PREFIX}${userId}`;
  const stored = localStorage.getItem(listKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading chat list:", e);
      return [];
    }
  }
  return [];
}

function updateChatList(userId: string, chatId: string, messages: Message[]) {
  const listKey = `${CHAT_LIST_PREFIX}${userId}`;
  const chatList = getChatList(userId);
  
  // Find or create chat session
  let chatSession = chatList.find(chat => chat.id === chatId);
  
  if (!chatSession) {
    // Create new chat session
    const firstUserMessage = messages.find(m => m.role === "user");
    const title = firstUserMessage 
      ? (firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? "..." : ""))
      : "New Chat";
    
    chatSession = {
      id: chatId,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    chatList.unshift(chatSession); // Add to beginning
  } else {
    // Update existing chat session
    chatSession.updatedAt = Date.now();
    const firstUserMessage = messages.find(m => m.role === "user");
    if (firstUserMessage) {
      chatSession.title = firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? "..." : "");
    }
    // Move to beginning (most recently updated first)
    const index = chatList.findIndex(chat => chat.id === chatId);
    if (index > 0) {
      chatList.splice(index, 1);
      chatList.unshift(chatSession);
    }
  }
  
  localStorage.setItem(listKey, JSON.stringify(chatList));
}

export function createNewChat(userId: string): string {
  const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return chatId;
}
