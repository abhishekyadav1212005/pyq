"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { Question } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Filter,
  Bookmark,
  Flame,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  Check,
  CheckCircle,
  X,
  Volume2,
  BookmarkCheck,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  RotateCcw
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Practice() {
  const { addXP, incrementSolvedCount } = useAuth();
  const {
    questions,
    bookmarks,
    toggleBookmark,
    recordAttempt,
    discussions,
    addDiscussion,
    addComment
  } = useSupabase();

  // Filter States
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedExam, setSelectedExam] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [practiceMode, setPracticeMode] = useState<"standard" | "bookmarked" | "incorrect" | "weak">("standard");

  // Quiz States
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // Discussion & Comments States
  const [showDiscussions, setShowDiscussions] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Filter Logic
  useEffect(() => {
    let result = [...questions];

    // Practice Modes
    if (practiceMode === "bookmarked") {
      result = result.filter(q => bookmarks.includes(q.id));
    } else if (practiceMode === "weak") {
      // Weak mode focuses on Electrotherapy and Physiology
      result = result.filter(q => q.subject === "Electrotherapy" || q.subject === "Physiology");
    }

    // Subjects
    if (selectedSubject !== "All") {
      result = result.filter(q => q.subject === selectedSubject);
    }

    // Exams
    if (selectedExam !== "All") {
      result = result.filter(q => q.exam === selectedExam);
    }

    // Difficulty
    if (selectedDifficulty !== "All") {
      result = result.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(result);
    setCurrentIdx(0);
    resetQuestionState();
  }, [questions, selectedSubject, selectedExam, selectedDifficulty, practiceMode, bookmarks]);

  const resetQuestionState = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowExplanation(false);
  };

  const currentQuestion = filteredQuestions[currentIdx];

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedOptionId || isAnswered) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    setIsAnswered(true);
    setShowExplanation(true);

    // Save to database
    recordAttempt(currentQuestion.id, selectedOptionId, isCorrect);

    if (isCorrect) {
      // Trigger Confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
      // Award XP
      const xpGained = currentQuestion.difficulty === "Hard" ? 25 : currentQuestion.difficulty === "Medium" ? 15 : 10;
      addXP(xpGained);
      incrementSolvedCount();
      setStreakCount(prev => prev + 1);
    } else {
      setStreakCount(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      resetQuestionState();
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      resetQuestionState();
    }
  };

  // Discussions search
  const currentDiscussion = discussions.find(d => d.questionId === currentQuestion?.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !currentDiscussion) return;
    addComment(currentDiscussion.id, newCommentText, "Abhishek Yadav");
    setNewCommentText("");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportReason("");
      setReportDetails("");
    }, 2000);
  };

  const subjects = ["All", "Anatomy", "Physiology", "Electrotherapy", "Kinesiology", "Orthopedics", "Neurology", "Cardio-respiratory"];
  const exams = ["All", "AIIMS", "ESIC", "DSSSB", "RRB", "NORCET"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  return (
    <div className="space-y-6">
      {/* 1. Header with Streaks */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Practice Board
          </h1>
          <p className="text-xs text-muted-foreground">Drill clinical and theoretical physiotherapy multiple-choice questions</p>
        </div>
        {streakCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full animate-pulse">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span className="text-xs font-bold">{streakCount} Correct Streak!</span>
          </div>
        )}
      </div>

      {/* 2. Practice Mode Selector tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-border pb-3">
        <button
          onClick={() => setPracticeMode("standard")}
          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
            practiceMode === "standard"
              ? "bg-primary text-white border-transparent"
              : "bg-card border-border hover:bg-secondary/40"
          }`}
        >
          General Mode
        </button>
        <button
          onClick={() => setPracticeMode("bookmarked")}
          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
            practiceMode === "bookmarked"
              ? "bg-primary text-white border-transparent"
              : "bg-card border-border hover:bg-secondary/40"
          }`}
        >
          Bookmarked Questions ({bookmarks.length})
        </button>
        <button
          onClick={() => setPracticeMode("weak")}
          className={`py-2 text-xs font-bold rounded-lg border transition-all ${
            practiceMode === "weak"
              ? "bg-primary text-white border-transparent"
              : "bg-card border-border hover:bg-secondary/40"
          }`}
        >
          Weak Topic Practice
        </button>
        <button
          onClick={() => {
            // Simulator reset
            resetQuestionState();
            setCurrentIdx(0);
          }}
          className="py-2 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-secondary/40 flex items-center justify-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Board
        </button>
      </div>

      {/* 3. Filters panel */}
      {practiceMode === "standard" && (
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase">Exam Boards</label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-bold uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* 4. Question Container */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-xl bg-card shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base">No Questions Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your filters or adding questions in the Admin Dashboard!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Question Box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
              {/* Question metadata */}
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground pb-3 border-b border-border">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase">
                  {currentQuestion.exam} {currentQuestion.year}
                </span>
                <span className="bg-secondary px-2.5 py-1 rounded-full">
                  {currentQuestion.subject} &middot; {currentQuestion.topic}
                </span>
                <span className={`px-2.5 py-1 rounded-full ${
                  currentQuestion.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" : currentQuestion.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Progress counter */}
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Question {currentIdx + 1} of {filteredQuestions.length}</span>
                <span>Accuracy Streak: {streakCount}</span>
              </div>

              {/* Question Text */}
              <p className="text-sm font-semibold leading-relaxed text-foreground/90">
                {currentQuestion.questionText}
              </p>

              {/* MCQs options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrectAnswer = opt.id === currentQuestion.correctOptionId;

                  let optStyles = "bg-secondary/15 border-border hover:bg-secondary/30";
                  let badge = null;

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optStyles = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400";
                      badge = <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
                    } else if (isSelected) {
                      optStyles = "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-400";
                      badge = <X className="w-4 h-4 text-rose-500 flex-shrink-0" />;
                    } else {
                      optStyles = "bg-secondary/10 border-transparent opacity-60";
                    }
                  } else if (isSelected) {
                    optStyles = "border-primary bg-primary/10 text-primary";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border text-xs font-medium text-left transition-all flex justify-between items-center gap-3 ${optStyles}`}
                    >
                      <span>{opt.text}</span>
                      {badge}
                    </button>
                  );
                })}
              </div>

              {/* Submit & Navigation controls */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className="p-2 rounded-lg border border-border hover:bg-secondary/30 text-muted-foreground transition-colors"
                    title="Bookmark Question"
                  >
                    {bookmarks.includes(currentQuestion.id) ? (
                      <Bookmark className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="p-2 rounded-lg border border-border hover:bg-secondary/30 text-muted-foreground transition-colors"
                    title="Report Issue"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </button>
                  <button
                    onClick={() => setShowDiscussions(!showDiscussions)}
                    className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                      showDiscussions ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:bg-secondary/30"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Discussion {currentDiscussion?.commentsCount ? `(${currentDiscussion.commentsCount})` : ""}
                  </button>
                </div>

                <div className="flex gap-2">
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOptionId}
                      className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs disabled:opacity-50 transition-all btn-duo-primary"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevious}
                        disabled={currentIdx === 0}
                        className="px-4 py-2 rounded-lg border border-border hover:bg-secondary text-xs disabled:opacity-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={currentIdx === filteredQuestions.length - 1}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-1"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation box */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02] shadow-sm space-y-3 overflow-hidden text-left"
                >
                  <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Answer Explanation
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                  {currentQuestion.referenceBook && (
                    <div className="pt-2 border-t border-emerald-500/10 text-[10px] font-semibold text-emerald-600/90 dark:text-emerald-400/90">
                      📚 Reference: {currentQuestion.referenceBook}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right 1 Col: Community Discussions panel */}
          <div className="space-y-4">
            {showDiscussions && currentDiscussion ? (
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <h3 className="font-bold text-xs">Community Discussions</h3>
                  <button onClick={() => setShowDiscussions(false)} className="text-xs text-muted-foreground hover:underline">
                    Close
                  </button>
                </div>

                {/* Original Question Thread */}
                <div className="space-y-1.5 border-b border-border pb-3 text-left">
                  <p className="text-xs font-bold text-foreground/90">{currentDiscussion.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{currentDiscussion.content}</p>
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>By {currentDiscussion.author}</span>
                    <span>{currentDiscussion.upvotes} Upvotes</span>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {currentDiscussion.comments.map(c => (
                    <div key={c.id} className="p-2.5 rounded bg-secondary/20 border border-transparent space-y-1 text-left">
                      <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                        <span>{c.author}</span>
                        <span>{c.upvotes} likes</span>
                      </div>
                      <p className="text-[11px] text-foreground leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment Form */}
                <form onSubmit={handlePostComment} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Ask a clarifying question or write a reply..."
                    className="w-full p-2 border border-border bg-secondary/15 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-primary hover:bg-primary-dark text-white rounded font-bold text-[10px] transition-colors"
                  >
                    Post Comment
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground/35 mx-auto" />
                <h3 className="font-bold text-xs">Community Discussions</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Join threads per question. Toggle the discussions panel to view notes and answers by experts.
                </p>
                <button
                  onClick={() => setShowDiscussions(true)}
                  className="w-full py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-semibold transition-colors"
                >
                  Open Discussions
                </button>
              </div>
            )}

            {/* Quick revision card */}
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 text-center bg-gradient-to-br from-primary/5 to-accent/5">
              <Award className="w-10 h-10 text-primary mx-auto" />
              <h3 className="font-bold text-xs">Earn XP for levels!</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Unlock new badges and climb the global leaderboards by maintaining active daily study schedules.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="font-bold text-sm text-rose-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Report Question Error
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <p className="text-sm font-semibold">Report Submitted!</p>
                <p className="text-xs text-muted-foreground">Thank you. The medical review panel will inspect this.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Reason for Flagging</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-border bg-secondary/15 rounded-lg text-xs focus:outline-none"
                  >
                    <option value="">Select reason</option>
                    <option value="incorrect_key">Incorrect Answer Key</option>
                    <option value="typo">Spelling or Grammatical Error</option>
                    <option value="bad_explanation">Explanation is unclear/missing</option>
                    <option value="out_of_syllabus">Out of Syllabus</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Details</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    required
                    placeholder="Provide details about the error..."
                    className="w-full p-3 border border-border bg-secondary/15 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-xs transition-colors"
                >
                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
