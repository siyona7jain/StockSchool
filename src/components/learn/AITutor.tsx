import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { MessageCircle, Send, Sparkles, User, Trash2, Plus, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveChat, loadChat, deleteChat, getChatList, createNewChat, ChatSession } from "@/lib/chatStorage";
import { cn } from "@/lib/utils";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessage: Message = {
  role: "assistant",
  content: "Hi! I'm your StockSchool AI tutor. 👋\n\nI'm here to help you understand how the stock market works. Ask me anything about stocks, investing, or financial markets!",
};

const suggestedQuestions = [
  "What is a stock?",
  "Why do stock prices go up and down?",
  "What is an ETF?",
  "How does diversification help?",
];

export function AITutor() {
  const { user } = useAuth();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [chatList, setChatList] = useState<ChatSession[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isLoadingChatRef = useRef(false);

  // Load chat list on mount
  useEffect(() => {
    if (user && !hasLoaded) {
      const chats = getChatList(user.id);
      setChatList(chats);
      
      // Load the most recent chat if available
      if (chats.length > 0) {
        const mostRecentChat = chats[0];
        setCurrentChatId(mostRecentChat.id);
        const savedMessages = loadChat(user.id, mostRecentChat.id);
        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      }
      
      setHasLoaded(true);
    } else if (!user) {
      setHasLoaded(false);
      setMessages([initialMessage]);
      setChatList([]);
      setCurrentChatId(null);
    }
  }, [user, hasLoaded]);

  // Save chat whenever messages change (but skip initial load and chat switching)
  useEffect(() => {
    if (user && hasLoaded && currentChatId && messages.length > 1 && !isLoadingChatRef.current) {
      saveChat(user.id, currentChatId, messages);
      // Refresh chat list to update titles
      const chats = getChatList(user.id);
      setChatList(chats);
    }
  }, [messages, user, currentChatId, hasLoaded]);

  // Load chat when currentChatId changes
  useEffect(() => {
    if (user && currentChatId && hasLoaded) {
      isLoadingChatRef.current = true;
      const savedMessages = loadChat(user.id, currentChatId);
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        setMessages([initialMessage]);
      }
      // Reset flag after messages are set
      setTimeout(() => {
        isLoadingChatRef.current = false;
      }, 100);
    }
  }, [currentChatId, user, hasLoaded]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewChat = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to create and save chats.",
        variant: "destructive",
      });
      return;
    }

    const newChatId = createNewChat(user.id);
    setCurrentChatId(newChatId);
    setMessages([initialMessage]);
    
    // Refresh chat list
    const chats = getChatList(user.id);
    setChatList(chats);
  };

  const handleSelectChat = (chatId: string) => {
    if (chatId === currentChatId) return; // Prevent re-selecting the same chat
    isLoadingChatRef.current = true;
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    deleteChat(user.id, chatId);
    
    // Refresh chat list
    const chats = getChatList(user.id);
    setChatList(chats);
    
    // If we deleted the current chat, switch to a new one or create one
    if (chatId === currentChatId) {
      if (chats.length > 0) {
        const newCurrentChatId = chats[0].id;
        setCurrentChatId(newCurrentChatId);
        // Load the new chat's messages
        const savedMessages = loadChat(user.id, newCurrentChatId);
        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages);
        } else {
          setMessages([initialMessage]);
        }
      } else {
        setCurrentChatId(null);
        setMessages([initialMessage]);
        handleNewChat();
      }
    }

    toast({
      title: "Chat deleted",
      description: "The chat has been deleted.",
    });
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Create new chat if none exists
    if (!currentChatId && user) {
      const newChatId = createNewChat(user.id);
      setCurrentChatId(newChatId);
      const chats = getChatList(user.id);
      setChatList(chats);
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      toast({
        title: "API key not configured",
        description: "Please add VITE_OPENAI_API_KEY to your .env file",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a friendly and knowledgeable AI tutor for StockSchool, an educational platform about the stock market. Help students understand stocks, investing, financial markets, and related concepts in a clear and engaging way. Keep your responses concise and educational.",
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            userMessage,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get response from AI tutor";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    };

  return (
    <>
      {/* Regular view - only shown when modal is closed */}
      {!isFullscreen && (
        <div className="flex gap-4 h-[600px]">
      {/* Chat Sidebar */}
      {user && (
        <Card className="w-40 flex-shrink-0 flex flex-col">
          <CardHeader className="pb-2 border-b px-3 pt-3">
            <Button
              onClick={handleNewChat}
              className="w-full text-xs h-8"
              variant="default"
              size="sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Chat
            </Button>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-1.5 space-y-0.5">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={cn(
                    "group relative flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-colors",
                    currentChatId === chat.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:w-5 w-0 flex-shrink-0 transition-all overflow-hidden"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                      <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{chat.title}</p>
                      </div>
                </div>
              ))}
              {chatList.length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground px-2">
                  No chats yet. Start a new conversation!
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Chat Content */}
      <Card variant="highlighted" className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              AI Tutor
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-8 w-8"
            >
                <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-secondary-light text-secondary"
                        : "bg-primary-light text-primary"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 py-3">
              {suggestedQuestions.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 pt-3 border-t border-border mt-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the stock market..."
              className="min-h-[44px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
      )}

      {/* Modal Popup Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogPortal>
          <DialogOverlay className="bg-white/80 backdrop-blur-sm" />
          <DialogPrimitive.Content className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-[900px] max-h-[90vh] h-auto translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg overflow-hidden flex flex-col"
          )}>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            <div className="flex gap-4 h-full min-h-[600px] max-h-[calc(90vh-2rem)]">
            {/* Chat Sidebar */}
            {user && (
              <Card className="w-56 flex-shrink-0 flex flex-col">
                <CardHeader className="pb-2 border-b px-3 pt-3">
                  <Button
                    onClick={handleNewChat}
                    className="w-full text-xs h-8"
                    variant="default"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    New Chat
                  </Button>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <div className="p-1.5 space-y-0.5">
                    {chatList.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={cn(
                          "group relative flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-colors",
                          currentChatId === chat.id
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:w-5 w-0 flex-shrink-0 transition-all overflow-hidden"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{chat.title}</p>
                        </div>
                      </div>
                    ))}
                    {chatList.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted-foreground px-2">
                        No chats yet. Start a new conversation!
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            )}

            {/* Chat Content */}
            <Card variant="highlighted" className="flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    AI Tutor
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="h-8 w-8"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0 overflow-hidden">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            msg.role === "user"
                              ? "bg-secondary-light text-secondary"
                              : "bg-primary-light text-primary"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                            msg.role === "user"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 py-3">
                    {suggestedQuestions.map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSend(q)}
                        className="text-xs"
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2 pt-3 border-t border-border mt-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about the stock market..."
                    className="min-h-[44px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
}
