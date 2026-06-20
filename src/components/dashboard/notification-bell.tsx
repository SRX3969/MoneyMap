"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "@/types";
import { Bell, Calendar, Sparkles, AlertTriangle, CheckCircle, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const notifications = useQuery(api.notifications.list) || [];
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const removeNotification = useMutation(api.notifications.remove);

  const [isOpen, setIsOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case "budget_warning": return <AlertTriangle className="w-4 h-4 text-accent-red" />;
      case "goal_milestone": return <CheckCircle className="w-4 h-4 text-accent-green" />;
      case "recurring_due": return <Calendar className="w-4 h-4 text-accent-blue" />;
      default: return <Sparkles className="w-4 h-4 text-brand" />;
    }
  };

  const handleMarkRead = async (id: Id<"notifications">, e: React.MouseEvent) => {
    e.stopPropagation();
    await markRead({ id });
  };

  const handleDelete = async (id: Id<"notifications">, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeNotification({ id });
  };

  return (
    <div className="relative">
      {/* Bell Trigger */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-primary hover:bg-hover rounded-full transition-all">
        <Bell className="w-5 h-5" />
        {unread.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2.5 w-80 bg-card border border-border rounded-[20px] shadow-float z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-xs font-bold text-text-primary">Notifications</span>
                {unread.length > 0 && (
                  <button onClick={async () => await markAllRead()}
                    className="text-[10px] text-text-muted hover:text-text-primary font-semibold flex items-center gap-0.5 transition-colors">
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-sm text-text-muted">No notifications</div>
                ) : (
                  notifications.map((note) => (
                    <div key={note._id}
                      onClick={async () => !note.read && (await markRead({ id: note._id }))}
                      className={`flex gap-3 p-3.5 transition-colors cursor-pointer hover:bg-hover-row ${
                        !note.read ? "bg-brand-bg/30" : ""
                      }`}>
                      <div className="mt-0.5 shrink-0">{getIcon(note.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs text-text-primary leading-tight ${!note.read ? "font-bold" : "font-medium"}`}>
                            {note.title}
                          </h4>
                          <span className="text-[9px] text-text-muted shrink-0">
                            {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-relaxed">{note.message}</p>
                        <div className="flex justify-end gap-1.5 pt-1">
                          {!note.read && (
                            <button onClick={(e) => handleMarkRead(note._id, e)}
                              className="text-[9px] font-semibold text-text-muted hover:text-text-primary flex items-center gap-0.5 transition-colors">
                              <Check className="w-3 h-3" /> Read
                            </button>
                          )}
                          <button onClick={(e) => handleDelete(note._id, e)}
                            className="text-[9px] font-semibold text-text-muted hover:text-accent-red flex items-center gap-0.5 transition-colors">
                            <X className="w-3 h-3" /> Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
