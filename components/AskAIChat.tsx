"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Sparkles, Bot } from "lucide-react";
import { Product } from "@/data/products";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AskAIChatProps {
  product: Product;
}

export default function AskAIChat({ product }: AskAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm here to help you with the ${product.name}. Ask me anything about specifications, usage, or compatibility!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call your AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          productContext: {
            name: product.name,
            specs: product.specifications,
            features: product.features,
          },
        }),
      });

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      // Fallback to FAQ-style responses
      const fallbackResponse = getFallbackResponse(input, product);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (question: string, product: Product): string => {
    const q = question.toLowerCase();

    if (q.includes("torque") || q.includes("power")) {
      const torqueSpec = product.specifications.find((s) =>
        s.label.toLowerCase().includes("torque")
      );
      return torqueSpec
        ? `The ${product.name} has a torque range of ${torqueSpec.value} ${
            torqueSpec.unit || ""
          }.`
        : "Please check the specifications tab for detailed torque information.";
    }

    if (q.includes("weight")) {
      const weightSpec = product.specifications.find((s) =>
        s.label.toLowerCase().includes("weight")
      );
      return weightSpec
        ? `The ${product.name} weighs ${weightSpec.value} ${
            weightSpec.unit || ""
          }.`
        : "Weight specifications can be found in the specifications tab.";
    }

    if (q.includes("price") || q.includes("cost") || q.includes("quote")) {
      return 'For pricing information and quotes, please use the "Request Quote" button or contact our sales team.';
    }

    if (q.includes("feature") || q.includes("what can")) {
      return `Key features of ${product.name}: ${product.features
        .slice(0, 3)
        .join(", ")}. Check the specifications section for more details.`;
    }

    if (q.includes("model") || q.includes("variant")) {
      if (product.selectorData?.models) {
        return `Available models: ${product.selectorData.models.join(
          ", "
        )}. Each model has different specifications tailored for specific applications.`;
      }
      return "Check the specifications tab for available variants and their details.";
    }

    return `I don't have specific information about that, but you can explore the specifications tab or contact our support team for detailed answers about the ${product.name}.`;
  };

  const quickQuestions = [
    "What is the torque range?",
    "How much does it weigh?",
    "What are the key features?",
    "Show available models",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-[#D6212F] to-[#B51D27] text-white p-3 sm:p-4 rounded-full shadow-2xl z-40 flex items-center gap-2"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{ delay: 2 }}
          className="overflow-hidden whitespace-nowrap font-semibold text-sm sm:text-base pr-1"
        >
          Ask AI
        </motion.span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed inset-x-0 bottom-0 sm:right-4 sm:bottom-20 sm:left-auto sm:inset-x-auto sm:w-96 h-[85vh] sm:h-[600px] bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#D6212F] to-[#B51D27] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">AI Assistant</h3>
                    <p className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/50">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-[#D6212F] text-white rounded-br-sm"
                          : "bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-[#D6212F]" />
                          <span className="text-xs text-gray-500">
                            AI Assistant
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-60 mt-1.5">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-900 border border-gray-800 p-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-[#D6212F] rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-[#D6212F] rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-[#D6212F] rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-3 bg-gray-950/30 border-t border-gray-800">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Quick questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs bg-gray-900 border border-gray-800 hover:border-[#D6212F] hover:text-[#D6212F] text-gray-400 px-3 py-1.5 rounded-full transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-gray-900/50 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2.5 bg-gray-950 border border-gray-800 text-white placeholder-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6212F] focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-[#D6212F] hover:bg-[#B51D27] text-white p-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
