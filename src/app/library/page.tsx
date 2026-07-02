"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Question } from "@/lib/mockData";
import {
  Library,
  Search,
  Bookmark,
  ExternalLink,
  Download,
  Filter,
  CheckCircle,
  FileDown
} from "lucide-react";

export default function PyqLibrary() {
  const { questions, bookmarks, toggleBookmark } = useSupabase();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedExam, setSelectedExam] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Detail Modal State
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showAnswerInModal, setShowAnswerInModal] = useState(false);

  // Filtered List
  const [filtered, setFiltered] = useState<Question[]>([]);

  useEffect(() => {
    let result = [...questions];

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.questionText.toLowerCase().includes(q) ||
          item.topic.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q)
      );
    }

    // Subject
    if (selectedSubject !== "All") {
      result = result.filter(item => item.subject === selectedSubject);
    }

    // Exam
    if (selectedExam !== "All") {
      result = result.filter(item => item.exam === selectedExam);
    }

    // Year
    if (selectedYear !== "All") {
      result = result.filter(item => item.year?.toString() === selectedYear);
    }

    // Difficulty
    if (selectedDifficulty !== "All") {
      result = result.filter(item => item.difficulty === selectedDifficulty);
    }

    setFiltered(result);
  }, [questions, searchQuery, selectedSubject, selectedExam, selectedYear, selectedDifficulty]);

  const uniqueYears = Array.from(new Set(questions.map(q => q.year).filter(Boolean))).sort((a, b) => (b as number) - (a as number));
  const uniqueSubjects = Array.from(new Set(questions.map(q => q.subject)));
  const uniqueExams = Array.from(new Set(questions.map(q => q.exam)));

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-primary" />
            PYQ Library
          </h1>
          <p className="text-xs text-muted-foreground">Search and download previous years question papers and clinical archives</p>
        </div>
        <button
          onClick={() => alert("Downloading full PYQ compilation PDF... (Mock)")}
          className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <FileDown className="w-4 h-4" /> Download PDF Compilation
        </button>
      </div>

      {/* 2. Search and filter panel */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword, topic, or biomechanical joints..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/15 focus:outline-none focus:ring-2 focus:ring-primary text-xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground font-bold uppercase">Subject</label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {uniqueSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground font-bold uppercase">Exam Board</label>
            <select
              value={selectedExam}
              onChange={e => setSelectedExam(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="All">All Exams</option>
              {uniqueExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground font-bold uppercase">Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="All">All Years</option>
              {uniqueYears.map(yr => <option key={yr} value={yr?.toString()}>{yr}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] text-muted-foreground font-bold uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Grid of questions cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-xl bg-card shadow-sm">
          <Library className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
          <h3 className="font-bold text-sm">No Match Found</h3>
          <p className="text-xs text-muted-foreground">Adjust your search parameters and filters to expand lookup</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(q => {
            const isBookmarked = bookmarks.includes(q.id);
            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {q.exam} {q.year}
                    </span>
                    <span>{q.subject}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground/90 line-clamp-3 leading-relaxed">
                    {q.questionText}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-border/50">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    q.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" : q.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {q.difficulty}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="p-1.5 rounded border border-border hover:bg-secondary/40 text-muted-foreground"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedQuestion(q);
                        setShowAnswerInModal(false);
                      }}
                      className="px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 font-bold text-[10px] flex items-center gap-1 transition-colors"
                    >
                      View Question <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details View Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl p-6 space-y-4 shadow-xl text-left">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="font-bold text-sm">
                {selectedQuestion.exam} {selectedQuestion.year} Question
              </h3>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                <span>Subject: {selectedQuestion.subject}</span>
                <span>Topic: {selectedQuestion.topic}</span>
              </div>

              <p className="text-xs font-bold leading-relaxed">{selectedQuestion.questionText}</p>

              {/* Display Options read-only */}
              <div className="space-y-2">
                {selectedQuestion.options.map(opt => {
                  const isCorrect = opt.id === selectedQuestion.correctOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-lg border text-xs font-medium ${
                        showAnswerInModal && isCorrect
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold"
                          : "bg-secondary/10 border-transparent"
                      }`}
                    >
                      {opt.text}
                    </div>
                  );
                })}
              </div>

              {showAnswerInModal ? (
                <div className="p-4 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400">Explanation</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedQuestion.explanation}</p>
                  {selectedQuestion.referenceBook && (
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                      📚 Ref: {selectedQuestion.referenceBook}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswerInModal(true)}
                  className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs transition-colors"
                >
                  Reveal Correct Answer & Explanation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
