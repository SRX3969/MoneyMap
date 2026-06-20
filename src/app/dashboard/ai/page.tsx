"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Sparkles, Send, Compass, Trash2, ArrowRight } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Where did I spend the most money this month?",
  "Suggest a monthly budget limit",
  "Can I save ₹10,000 this month?",
  "What spending habits should I improve?",
  "Which category is increasing fastest?",
  "Compare spending between two months"
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
            <strong key={`bold-${match.index}`} className="font-bold text-text-primary bg-brand-bg px-1 py-0.5 rounded text-[11px]">
              {match[1]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < content.length) parts.push(...processInlineCode(content.substring(lastIndex)));

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-3 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
              <span className="flex-1 text-text-secondary">{parts.length > 0 ? parts : content}</span>
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

export default function ShynAiPage() {
  const chatHistoryRaw = useQuery(api.ai.getChatHistory);
  const chatHistory = useMemo(() => chatHistoryRaw || [], [chatHistoryRaw]);
  const sendChatMessage = useAction(api.ai.chat);
  const clearChat = useMutation(api.ai.clearChatHistory);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [chatHistory, isSending]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;
    setIsSending(true); setInput("");
    try { await sendChatMessage({ message: textToSend }); }
    catch (e) { console.error(e); }
    finally { setIsSending(false); }
  };

  const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSendMessage(input); };
  const handleClearChat = async () => { if (confirm("Clear chat history?")) await clearChat(); };

  return (
    <div className="p-5 md:p-8 max-w-[1400px] mx-auto flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-72px)]">

      {/* Header */}
      <header className="pb-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-light rounded-xl flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary">SHYN AI Coach</h1>
            <p className="text-xs text-text-secondary">Real-Time Financial Guidance & Analysis</p>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button onClick={handleClearChat} className="btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 text-accent-red hover:border-accent-red/30">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </header>

      {/* Main Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">

        {/* Suggested Prompts Sidebar */}
        <aside className="hidden lg:block card p-5 space-y-4 h-full overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Suggested Queries</div>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => handleSendMessage(prompt)}
                className="w-full text-left p-3.5 bg-page-bg hover:bg-hover border border-border text-xs font-medium text-text-secondary hover:text-text-primary rounded-xl transition-all flex items-center justify-between group">
                <span className="leading-tight">{prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-brand shrink-0" />
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Panel */}
        <section className="lg:col-span-3 card flex flex-col overflow-hidden h-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-5">
                <div className="w-14 h-14 bg-brand-bg rounded-2xl border border-purple-100 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6 text-brand" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-text-primary text-base">Welcome to SHYN AI</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Your AI financial coach. Ask questions about spending, budgets, savings goals, or get personalized advice.
                  </p>
                </div>
                {/* Mobile prompt buttons */}
                <div className="lg:hidden w-full space-y-2 pt-2">
                  {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
                    <button key={prompt} onClick={() => handleSendMessage(prompt)}
                      className="w-full text-left p-3 bg-page-bg border border-border text-xs font-medium text-text-secondary rounded-xl flex items-center justify-between group">
                      <span>{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((chat) => (
                  <div key={chat._id} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed ${
                      chat.role === "user"
                        ? "bg-gradient-to-br from-brand to-brand-light text-white rounded-tr-sm shadow-sm"
                        : "card text-text-secondary rounded-tl-sm"
                    }`}>
                      {chat.role === "assistant" ? formatMessageText(chat.message) : <p className="whitespace-pre-wrap">{chat.message}</p>}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="card text-text-muted rounded-2xl rounded-tl-sm px-4 py-3.5 text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-brand/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-4 border-t border-border flex gap-3 shrink-0">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask SHYN AI anything..."
              disabled={isSending} className="input-field flex-1 text-sm disabled:opacity-50" />
            <button type="submit" disabled={isSending || !input.trim()}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
