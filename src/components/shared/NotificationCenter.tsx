"use client";

import { useState } from "react";
import { Bell, Flame, Calendar, Info, Check } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "streak":
        return <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />;
      case "exam":
        return <Calendar className="w-4 h-4 text-primary" />;
      default:
        return <Info className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-secondary/40 hover:bg-secondary/80 border border-border transition-colors relative"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-foreground/80" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border glass-card p-4 shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <h3 className="font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    <Check className="w-3. h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex gap-3 ${
                        notif.isRead
                          ? "bg-secondary/10 border-transparent hover:bg-secondary/20"
                          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`text-xs font-semibold ${notif.isRead ? "text-foreground/80" : "text-foreground"}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
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
