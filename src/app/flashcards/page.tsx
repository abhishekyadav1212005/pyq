"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { Flashcard } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Flame,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";

export default function FlashcardDeck() {
  const { addXP } = useAuth();
  const { flashcards, updateFlashcard } = useSupabase();

  // Selected filters
  const [selectedSubject, setSelectedSubject] = useState("All");
  
  // Card index states
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeckCleared, setIsDeckCleared] = useState(false);

  // Filter due cards
  useEffect(() => {
    let result = [...flashcards];
    
    // Filter by subject
    if (selectedSubject !== "All") {
      result = result.filter(card => card.subject === selectedSubject);
    }
    
    // Filter due cards (due date is in the past/present)
    const now = new Date();
    const filteredDue = result.filter(card => {
      const reviewDate = new Date(card.nextReviewDate);
      return reviewDate <= now;
    });

    setDueCards(filteredDue);
    setCurrentIdx(0);
    setIsFlipped(false);
    setIsDeckCleared(filteredDue.length === 0);
  }, [flashcards, selectedSubject]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRating = (rating: "easy" | "good" | "hard") => {
    const card = dueCards[currentIdx];
    if (!card) return;

    // Save and schedule in database
    updateFlashcard(card.id, rating);

    // Award XP
    addXP(5);

    // Transition to next card or clear deck
    if (currentIdx < dueCards.length - 1) {
      setIsFlipped(false);
      // Wait for flip transition back to front
      setTimeout(() => {
        setCurrentIdx((prev: number) => prev + 1);
      }, 200);
    } else {
      // Trigger success animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsDeckCleared(true);
    }
  };

  const handleResetDeck = () => {
    // Mocking resetting all dates to now to allow re-practicing
    if (typeof window !== "undefined") {
      const reset = flashcards.map((card: Flashcard) => ({
        ...card,
        nextReviewDate: new Date().toISOString()
      }));
      localStorage.setItem("physioprep_flashcards", JSON.stringify(reset));
      window.location.reload();
    }
  };

  const subjects = ["All", "Anatomy", "Physiology", "Electrotherapy", "Kinesiology", "Orthopedics", "Neurology"];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Spaced Repetition Flashcards
          </h1>
          <p className="text-xs text-muted-foreground">Train active recall on muscle origins, nerve pathways, and modalities</p>
        </div>
        <button
          onClick={handleResetDeck}
          className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Due Cards
        </button>
      </div>

      {/* 2. Controls and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-1.5 text-left md:col-span-2">
          <label className="text-[10px] text-muted-foreground font-bold uppercase">Filter deck subject</label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Due for Review</span>
            <p className="text-xl font-extrabold text-orange-500">{dueCards.length} Cards</p>
          </div>
          <Flame className="w-8 h-8 text-orange-500 fill-orange-500/20" />
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between text-left">
          <div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase">Total Deck Size</span>
            <p className="text-xl font-extrabold">{flashcards.length} Cards</p>
          </div>
          <BookOpen className="w-8 h-8 text-primary/70" />
        </div>
      </div>

      {/* 3. Card Flipper Container */}
      <div className="flex flex-col items-center justify-center py-6">
        {isDeckCleared ? (
          <div className="p-8 max-w-md w-full border border-border rounded-2xl bg-card text-center space-y-4 shadow-md">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold">Deck Completed! 🎉</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No flashcards are due for review in this subject right now. Outstanding job!
              Come back tomorrow or filter by another subject.
            </p>
            <button
              onClick={() => setSelectedSubject("All")}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors"
            >
              Show All Decks
            </button>
          </div>
        ) : (
          dueCards[currentIdx] && (
            <div className="w-full max-w-xl space-y-6">
              {/* Progress Tracker */}
              <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold px-2">
                <span>Card {currentIdx + 1} of {dueCards.length}</span>
                <span className="bg-secondary px-2.5 py-0.5 rounded-full text-[9px] uppercase">
                  {dueCards[currentIdx].subject} &middot; {dueCards[currentIdx].topic}
                </span>
              </div>

              {/* Flipper Body */}
              <div
                onClick={handleFlip}
                className="w-full min-h-[280px] cursor-pointer rounded-2xl border border-border bg-card shadow-lg flex items-center justify-center p-8 text-center relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Visual glow backdrop inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02] -z-10" />
                
                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Concept / Question</span>
                      <p className="text-base sm:text-lg font-bold leading-relaxed text-foreground/95">
                        {dueCards[currentIdx].front}
                      </p>
                      <p className="text-[10px] text-muted-foreground animate-pulse">Click card to reveal answer</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider">Solution / Answer</span>
                      <p className="text-base sm:text-lg font-bold leading-relaxed text-emerald-600 dark:text-emerald-400 whitespace-pre-line">
                        {dueCards[currentIdx].back}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Rate difficulty below to schedule next review</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scheduler rating controls */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    <button
                      onClick={() => handleRating("hard")}
                      className="py-3 bg-rose-500/10 border border-rose-500 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl font-bold text-xs transition-all text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span>Hard</span>
                      <span className="text-[9px] font-normal opacity-80">Soon (1d)</span>
                    </button>
                    <button
                      onClick={() => handleRating("good")}
                      className="py-3 bg-amber-500/10 border border-amber-500 hover:bg-amber-500 hover:text-white text-amber-600 dark:text-amber-400 hover:text-white rounded-xl font-bold text-xs transition-all text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span>Good</span>
                      <span className="text-[9px] font-normal opacity-80">Normal ({Math.round(dueCards[currentIdx].interval * dueCards[currentIdx].easeFactor)}d)</span>
                    </button>
                    <button
                      onClick={() => handleRating("easy")}
                      className="py-3 bg-emerald-500/10 border border-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-500 rounded-xl font-bold text-xs transition-all text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span>Easy</span>
                      <span className="text-[9px] font-normal opacity-80">Later ({Math.round(dueCards[currentIdx].interval * dueCards[currentIdx].easeFactor * 1.5)}d)</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        )}
      </div>
    </div>
  );
}
