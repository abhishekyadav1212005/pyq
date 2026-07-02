"use client";

import { useState } from "react";
import { Sparkles, X, Send, Bot, User, BrainCircuit, CalendarCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockUserStats } from "@/lib/mockData";

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string }[]>([
    {
      sender: "bot",
      text: "Hello! I am your PhysioPrep AI Tutor. I can explain complex clinical scenarios, map out study schedules, or analyze your weak areas. What can I help you with today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { text: "Recommend a study plan 📅", action: "plan" },
    { text: "Analyze my weak topics 🧠", action: "weak" },
    { text: "Explain patellofemoral tracking 🦵", action: "explain" }
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg = { sender: "user" as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // AI logic response simulation
    setTimeout(() => {
      let botResponse = "I've analyzed your query. To target that area, focus on the force couples of the rotator cuff and review biomechanical angles of abduction.";

      const query = textToSend.toLowerCase();
      if (query.includes("plan") || query.includes("study plan")) {
        botResponse = `Based on your target exams (AIIMS/ESIC) and 78.4% accuracy, here is your 7-day study plan:
• Day 1-2: Anatomy of Shoulder Joint & Upper Limb (Focus on Supraspinatus & Brachial Plexus).
• Day 3: Electrotherapy (Review SWD electrode setups & Iontophoresis polarities).
• Day 4: Gait Biomechanics (Eccentric vs Concentric muscle work during heel strike).
• Day 5: Stroke Syndromes (Anterior vs Middle Cerebral Artery deficits).
• Day 6: Full length Mock Test simulation.
• Day 7: Revision of incorrect questions and flagged flashcards.`;
      } else if (query.includes("weak") || query.includes("weak areas") || query.includes("weak topics")) {
        botResponse = `Here is your AI Diagnostic Report:
1. Nerve Conduction Velocity (Physiology): Current accuracy is 55%. Focus on myelin sheath conduction, nodes of Ranvier, and compound action potentials.
2. Shortwave Diathermy Setup (Electrotherapy): Current accuracy is 58%. Review condenser vs inductor electrode spacing.
3. Stroke Syndromes (Neurology): Current accuracy is 60%. Study contralateral lower extremity hemiparesis in ACA occlusion.`;
      } else if (query.includes("patellofemoral") || query.includes("tracking")) {
        botResponse = `Patellofemoral tracking refers to the motion of the patella within the trochlear groove of the femur during knee flexion/extension:
• Lateral forces (pull patella out): Vastus Lateralis, Iliotibial (IT) Band, lateral retinaculum.
• Medial forces (stabilize patella): Vastus Medialis Oblique (VMO), medial retinaculum, adductor tubercle.
• Clinical tip: Patellofemoral Pain Syndrome (PFPS) often presents with lateral tracking due to a weak VMO and tight lateral structures. Strengthen VMO in terminal 30 degrees of extension.`;
      }

      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-tr from-primary to-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all focus:outline-none"
        title="Ask AI Assistant"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5 animate-pulse" />}
      </button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="w-80 sm:w-96 rounded-2xl border border-border glass-card shadow-2xl p-4 mt-3 flex flex-col h-[400px] overflow-hidden text-left"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border pb-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs flex items-center gap-1">
                  AI Study Tutor
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-[8px] font-bold uppercase">Online</span>
                </h3>
                <p className="text-[9px] text-muted-foreground">Powered by PhysioPrep Medical Models</p>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 items-start ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    msg.sender === "bot" ? "bg-primary" : "bg-accent"
                  }`}>
                    {msg.sender === "bot" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[80%] whitespace-pre-line ${
                    msg.sender === "bot"
                      ? "bg-secondary/20 text-foreground"
                      : "bg-primary text-white"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/20 text-muted-foreground text-[11px] flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 py-2">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.text)}
                    className="px-2.5 py-1 rounded bg-secondary/30 hover:bg-secondary border border-border text-[9px] font-semibold transition-colors"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex gap-2 border-t border-border pt-2.5 mt-auto"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask me about joint glides, polarities..."
                className="flex-1 px-3 py-1.5 border border-border bg-secondary/15 rounded-lg text-[11px] focus:outline-none"
              />
              <button
                type="submit"
                className="p-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
