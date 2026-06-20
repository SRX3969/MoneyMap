"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useAction, useMutation } from "@/hooks/use-convex";
import { api } from "../../../convex/_generated/api";
import { useDashboard } from "@/context/dashboard-context";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Compass, ArrowRight, Trash2 } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Where did I spend the most this month?",
  "Suggest a monthly budget",
  "Can I save ₹10,000 this month?",
  "What spending habits should I improve?"
];

function formatMessageText(text: string) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        const listMatch = line.match(/^[\*\-]\s+(.*)$/);
        let content = line;
        let isBullet = false;
        if (listMatch) { content = listMatch[1]; isBullet = true; }

        const parts: React.ReactNode[] = [];
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match;
        while ((match = boldRegex.exec(content)) !== null) {
          const before = content.substring(lastIndex, match.index);
          if (before) parts.push(...processInlineCode(before));
          parts.push(
            <strong key={`bold-${match.index}`} className="font-bold text-text-primary bg-brand-bg border-b border-purple-200 px-1 py-0.5 rounded text-[11px]">
              {match[1]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < content.length) parts.push(...processInlineCode(content.substring(lastIndex)));

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-3 mt-1.5 text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
              <span className="flex-1">{parts.length > 0 ? parts : content}</span>
            </div>
          );
        }
        return (
          <p key={lineIdx} className="min-h-[1em] text-text-secondary leading-relaxed">
            {parts.length > 0 ? parts : content}
          </p>
        );
      })}
    </div>
  );
}

function processInlineCode(text: string): React.ReactNode[] {
  const codeRegex = /`([^`]+)`/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  while ((match = codeRegex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index);
    if (before) parts.push(before);
    parts.push(
      <code key={`code-${match.index}`} className="px-1.5 py-0.5 bg-page-bg text-brand font-mono text-[10.5px] rounded-md border border-border font-semibold">
        {match[1]}
      </code>
    );
    lastIndex = codeRegex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.substring(lastIndex));
  return parts;
}

export default function FloatingAiWidget() {
  const { isAiAssistantOpen, setAiAssistantOpen } = useDashboard();
  const chatHistoryRaw = useQuery(api.ai.getChatHistory);
  const chatHistory = useMemo(() => chatHistoryRaw || [], [chatHistoryRaw]);
  const sendChatMessage = useAction(api.ai.chat);
  const clearChat = useMutation(api.ai.clearChatHistory);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isAiAssistantOpen) setTimeout(scrollToBottom, 100);
  }, [isAiAssistantOpen, chatHistory, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
    setIsSending(true); setInput("");
    try { await sendChatMessage({ message: textToSend }); }
    catch (err) { console.error(err); }
    finally { setIsSending(false); }
  };

  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSendMessage(input); };

  const handleClearChat = async () => {
    if (confirm("Clear chat history with SHYN AI?")) await clearChat();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-40">
        <button onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-3 btn-primary rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm group">
          <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200 group-hover:scale-110 transition-transform" />
          <span>SHYN AI</span>
        </button>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isAiAssistantOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
              onClick={() => setAiAssistantOpen(false)} className="fixed inset-0 z-50 bg-black" />

            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-card border-l border-border flex flex-col shadow-float overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-gradient-to-br from-brand to-brand-light text-white rounded-xl shadow-sm">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">SHYN AI</h3>
                    <p className="text-[10px] text-text-muted font-medium">Your Finance Guide</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chatHistory.length > 0 && (
                    <button onClick={handleClearChat} title="Clear Chat"
                      className="p-1.5 hover:bg-red-50 text-text-muted hover:text-accent-red rounded-full transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setAiAssistantOpen(false)}
                    className="p-1.5 hover:bg-hover text-text-muted hover:text-text-primary rounded-full transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-page-bg">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                    <div className="w-14 h-14 bg-brand-bg rounded-2xl border border-purple-100 shadow-sm flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-brand" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="font-bold text-text-primary text-sm">Ask SHYN AI</h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Analyze spending, check budgets, get savings tips, or ask financial questions.
                      </p>
                    </div>
                    <div className="w-full space-y-2 pt-4">
                      <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider text-left mb-2 px-1">Suggested</div>
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button key={prompt} onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left p-3.5 bg-card hover:bg-hover border border-border text-xs font-medium text-text-secondary hover:text-text-primary rounded-xl transition-all flex items-center justify-between group shadow-sm">
                          <span>{prompt}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-brand" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((chat) => (
                      <div key={chat._id} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          chat.role === "user"
                            ? "bg-gradient-to-br from-brand to-brand-light text-white rounded-tr-sm shadow-sm"
                            : "bg-card border border-border text-text-secondary rounded-tl-sm shadow-sm"
                        }`}>
                          {chat.role === "assistant" ? formatMessageText(chat.message) : <p className="whitespace-pre-wrap">{chat.message}</p>}
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-card border border-border text-text-muted rounded-2xl rounded-tl-sm px-4 py-3.5 text-xs shadow-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleFormSubmit} className="p-4 border-t border-border bg-card flex gap-2.5 shrink-0">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask SHYN AI anything..." disabled={isSending}
                  className="input-field flex-1 text-sm disabled:opacity-50" />
                <button type="submit" disabled={isSending || !input.trim()}
                  className="btn-primary p-2.5 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
