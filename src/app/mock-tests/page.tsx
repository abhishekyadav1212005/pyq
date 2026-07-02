"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { MockTest, Question } from "@/lib/mockData";
import { formatTime } from "@/lib/utils";
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Bookmark,
  Check,
  ChevronLeft,
  Flag,
  Award
} from "lucide-react";

export default function MockTests() {
  const { addXP } = useAuth();
  const { recordAttempt, tests } = useSupabase();

  // Test Selection states
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);

  // Active Test states
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({}); // questionId -> selectedOptionId
  const [flags, setFlags] = useState<string[]>([]); // list of flagged questionIds
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef<any>(null);

  // Result states
  const [showResults, setShowResults] = useState(false);
  const [testSummary, setTestSummary] = useState<{
    score: number;
    accuracy: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    percentile: number;
    timeSpent: number;
    sectionsPerformance?: {
      sectionId: string;
      title: string;
      correctCount: number;
      incorrectCount: number;
      unattemptedCount: number;
      score: number;
      maxScore: number;
    }[];
  } | null>(null);

  // Get active list of tests (useSupabase state or fallback)
  const activeTestsList = tests && tests.length > 0 ? tests : [];

  // Find current section
  const currentQuestion = testQuestions[currentQuestionIdx];
  const currentSection = activeTest?.sections?.find(sec =>
    sec.questions.some(q => q.id === currentQuestion?.id)
  );

  // Load questions for selected mock test
  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    let pool: Question[] = [];
    if (test.sections && test.sections.length > 0) {
      test.sections.forEach(sec => {
        pool = [...pool, ...sec.questions];
      });
    } else {
      // Fallback if no sections
      // Import mockQuestions here statically if needed, or query from useSupabase
      // In this setup, we fall back to tests' questions if any, or general questions
      const storedQuestions = typeof window !== "undefined" ? localStorage.getItem("physioprep_questions") : null;
      const allQs: Question[] = storedQuestions ? JSON.parse(storedQuestions) : [];
      pool = allQs.slice(0, test.totalQuestions);
    }
    setTestQuestions(pool);
    setAnswers({});
    setFlags([]);
    setCurrentQuestionIdx(0);
    setTimeLeft(test.durationMinutes * 60);
    setIsTestRunning(true);
    setShowResults(false);
  };

  // Timer logic
  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitTest(true); // Auto-submit when timer hits zero
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, timeLeft]);

  const handleSelectOption = (optionId: string) => {
    const q = testQuestions[currentQuestionIdx];
    setAnswers(prev => ({
      ...prev,
      [q.id]: optionId
    }));
  };

  const handleClearResponse = () => {
    const q = testQuestions[currentQuestionIdx];
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[q.id];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    const q = testQuestions[currentQuestionIdx];
    if (flags.includes(q.id)) {
      setFlags(flags.filter(id => id !== q.id));
    } else {
      setFlags([...flags, q.id]);
    }
  };

  const handleSubmitTest = (isAutoSubmit = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTestRunning(false);

    if (!activeTest) return;

    // Calculate score
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    testQuestions.forEach(q => {
      const selected = answers[q.id];
      if (!selected) {
        unattempted++;
      } else if (selected === q.correctOptionId) {
        correct++;
        recordAttempt(q.id, selected, true);
      } else {
        incorrect++;
        recordAttempt(q.id, selected, false);
      }
    });

    const rawScore = (correct * activeTest.positiveMarks) - (incorrect * activeTest.negativeMarks);
    const finalScore = parseFloat(rawScore.toFixed(2));
    const totalAttempted = correct + incorrect;
    const accuracy = totalAttempted > 0 ? parseFloat(((correct / totalAttempted) * 100).toFixed(1)) : 0;
    
    // Mock percentile based on score
    const scorePercentage = testQuestions.length > 0 ? (correct / testQuestions.length) * 100 : 0;
    const percentile = parseFloat((scorePercentage * 0.9 + 8).toFixed(1)); // mock scaling

    // Award XP
    addXP(100 + Math.round(correct * 10));

    // Section-wise performance
    const sectionsPerformance = activeTest.sections?.map(sec => {
      let secCorrect = 0;
      let secIncorrect = 0;
      let secUnattempted = 0;

      sec.questions.forEach(q => {
        const selected = answers[q.id];
        if (!selected) {
          secUnattempted++;
        } else if (selected === q.correctOptionId) {
          secCorrect++;
        } else {
          secIncorrect++;
        }
      });

      const secRawScore = (secCorrect * activeTest.positiveMarks) - (secIncorrect * activeTest.negativeMarks);
      return {
        sectionId: sec.id,
        title: sec.title,
        correctCount: secCorrect,
        incorrectCount: secIncorrect,
        unattemptedCount: secUnattempted,
        score: parseFloat(secRawScore.toFixed(2)),
        maxScore: sec.questions.length * activeTest.positiveMarks
      };
    }) || [];

    setTestSummary({
      score: finalScore,
      accuracy,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      percentile,
      timeSpent: (activeTest.durationMinutes * 60) - timeLeft,
      sectionsPerformance
    });
    setShowResults(true);
  };

  const handleExitTest = () => {
    if (confirm("Are you sure you want to exit the test? All progress will be lost.")) {
      setIsTestRunning(false);
      setActiveTest(null);
      setShowResults(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MOCK SELECTION SCREEN */}
      {!isTestRunning && !showResults && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Mock Test Center
            </h1>
            <p className="text-xs text-muted-foreground">Practice timed examinations replicating official recruitment board patterns</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTestsList.map(test => (
              <div
                key={test.id}
                className="p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/45 transition-all text-left"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold ${
                      test.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" : test.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {test.difficulty} Difficulty
                    </span>
                    {test.sections && test.sections.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold">
                        {test.sections.length} Sections
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold leading-snug">{test.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {test.description}
                  </p>
                  
                  {/* Stats list */}
                  <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground pt-1.5 font-semibold">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {test.durationMinutes} Mins</span>
                    <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-primary" /> {test.totalQuestions} Questions</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> +{test.positiveMarks} / -{test.negativeMarks} Marks</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs transition-all shadow-md btn-duo-primary"
                >
                  Start Simulation
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACTIVE TEST ENGINE SCREEN */}
      {isTestRunning && activeTest && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Question view panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Section tabs at the very top */}
            {activeTest.sections && activeTest.sections.length > 0 && (
              <div className="flex gap-2 border-b border-border pb-3 mb-2 overflow-x-auto text-left">
                {activeTest.sections.map((sec) => {
                  const isCurrentSection = currentSection?.id === sec.id;
                  const answeredInSection = sec.questions.filter(q => !!answers[q.id]).length;
                  const totalInSection = sec.questions.length;
                  
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        const firstQIdx = testQuestions.findIndex(q => q.id === sec.questions[0]?.id);
                        if (firstQIdx >= 0) {
                          setCurrentQuestionIdx(firstQIdx);
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${
                        isCurrentSection
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <span>{sec.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        isCurrentSection ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                      }`}>
                        {answeredInSection}/{totalInSection}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6 text-left">
              {/* Active exam header */}
              <div className="flex justify-between items-center pb-3 border-b border-border text-xs font-bold">
                <div className="flex flex-col gap-0.5">
                  <span className="truncate max-w-[200px] sm:max-w-md">{activeTest.title}</span>
                  {currentSection && (
                    <span className="text-[10px] text-primary">{currentSection.title}</span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-orange-500 fill-orange-500 animate-pulse font-extrabold text-sm">
                  <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
                </span>
              </div>

              {/* Question metadata */}
              <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                <span>Question {currentQuestionIdx + 1} of {testQuestions.length}</span>
                <span>Marking: +{activeTest.positiveMarks} / -{activeTest.negativeMarks}</span>
              </div>

              {/* Question text */}
              <p className="text-sm font-semibold leading-relaxed">
                {testQuestions[currentQuestionIdx]?.questionText}
              </p>

              {/* MCQ Picker */}
              <div className="space-y-3">
                {testQuestions[currentQuestionIdx]?.options.map(opt => {
                  const isSelected = answers[testQuestions[currentQuestionIdx].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-xl border text-xs font-medium text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "bg-secondary/15 border-border hover:bg-secondary/35"
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Nav controls */}
              <div className="flex justify-between items-center pt-5 border-t border-border">
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleFlag}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      flags.includes(testQuestions[currentQuestionIdx].id)
                        ? "bg-amber-500/20 border-amber-500 text-amber-500"
                        : "border-border text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag Review
                  </button>
                  <button
                    onClick={handleClearResponse}
                    className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-secondary/40 text-xs font-semibold"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    disabled={currentQuestionIdx === 0}
                    className="p-2 rounded-lg border border-border hover:bg-secondary/40 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                    disabled={currentQuestionIdx === testQuestions.length - 1}
                    className="p-2 rounded-lg border border-border hover:bg-secondary/40 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar navigation panel */}
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <h3 className="font-bold text-xs">Question Board</h3>
              
              {/* Question numbers grid (grouped by section or flat) */}
              {activeTest.sections && activeTest.sections.length > 0 ? (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {activeTest.sections.map((sec) => (
                    <div key={sec.id} className="space-y-1.5">
                      <h4 className="text-[9px] uppercase font-extrabold text-muted-foreground tracking-wider truncate" title={sec.title}>
                        {sec.title}
                      </h4>
                      <div className="grid grid-cols-5 gap-1.5">
                        {sec.questions.map((q) => {
                          const idx = testQuestions.findIndex(tq => tq.id === q.id);
                          if (idx === -1) return null;
                          const isCurrent = idx === currentQuestionIdx;
                          const isAnswered = !!answers[q.id];
                          const isFlagged = flags.includes(q.id);

                          let cellColor = "bg-secondary/20 text-foreground border-transparent";
                          if (isCurrent) {
                            cellColor = "border-primary text-primary font-bold";
                          } else if (isFlagged) {
                            cellColor = "bg-amber-500/20 border-amber-400 text-amber-600";
                          } else if (isAnswered) {
                            cellColor = "bg-emerald-500/10 border-emerald-400 text-emerald-600";
                          }

                          return (
                            <button
                              key={q.id}
                              onClick={() => setCurrentQuestionIdx(idx)}
                              className={`w-8 h-8 border rounded-lg text-xs font-bold flex items-center justify-center transition-all ${cellColor}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2 max-h-[320px] overflow-y-auto">
                  {testQuestions.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIdx;
                    const isAnswered = !!answers[q.id];
                    const isFlagged = flags.includes(q.id);

                    let cellColor = "bg-secondary/20 text-foreground border-transparent";
                    if (isCurrent) {
                      cellColor = "border-primary text-primary font-bold";
                    } else if (isFlagged) {
                      cellColor = "bg-amber-500/20 border-amber-400 text-amber-600";
                    } else if (isAnswered) {
                      cellColor = "bg-emerald-500/10 border-emerald-400 text-emerald-600";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-10 h-10 border rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${cellColor}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Instructions legends */}
              <div className="space-y-1.5 text-[10px] text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary/20" /> Unvisited / Unanswered</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-400" /> Answered</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-400" /> Flagged for Review</div>
              </div>

              {/* Submit exam button */}
              <div className="space-y-2 border-t border-border pt-4">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to submit the exam?")) {
                      handleSubmitTest();
                    }
                  }}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-md transition-colors text-center"
                >
                  Submit Exam
                </button>
                <button
                  onClick={handleExitTest}
                  className="w-full py-2 border border-danger text-danger hover:bg-danger/5 rounded-lg font-bold text-xs transition-colors text-center"
                >
                  Exit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. POST-TEST ANALYTICS SCREEN */}
      {showResults && testSummary && activeTest && (
        <div className="space-y-6 text-left">
          {/* Top Banner card */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Exam Results Released</span>
                <h2 className="text-xl font-bold">{activeTest.title}</h2>
                <p className="text-xs text-muted-foreground">Test completed in {formatTime(testSummary.timeSpent)}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTest(null);
                  setShowResults(false);
                }}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-md transition-colors"
              >
                Mock Test Hub
              </button>
            </div>

            {/* Scores grids */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Score</span>
                <p className="text-2xl font-extrabold text-primary">{testSummary.score} Marks</p>
                <p className="text-[9px] text-muted-foreground">Max possible: {testQuestions.length * activeTest.positiveMarks} marks</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Mock Percentile</span>
                <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{testSummary.percentile}th</p>
                <p className="text-[9px] text-muted-foreground">Compared to 1,200 mock takers</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Accuracy</span>
                <p className="text-2xl font-extrabold text-emerald-500">{testSummary.accuracy}%</p>
                <p className="text-[9px] text-muted-foreground">Target: 80% accuracy</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Correct Responses</span>
                <p className="text-2xl font-extrabold text-foreground">{testSummary.correctCount} / {testQuestions.length}</p>
                <p className="text-[9px] text-rose-500">{testSummary.incorrectCount} incorrect, {testSummary.unattemptedCount} skipped</p>
              </div>
            </div>

            {/* Section performance breakdown breakdown */}
            {testSummary.sectionsPerformance && testSummary.sectionsPerformance.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                <h4 className="text-xs font-bold text-foreground">Section-wise Performance Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testSummary.sectionsPerformance.map(perf => {
                    const pct = perf.maxScore > 0 ? Math.round((perf.score / perf.maxScore) * 100) : 0;
                    return (
                      <div key={perf.sectionId} className="p-3 bg-secondary/15 border border-border rounded-xl space-y-2 text-left">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground/90">{perf.title}</span>
                          <span className="font-extrabold text-primary">{perf.score} / {perf.maxScore} M</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-secondary/65 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-muted-foreground font-semibold">
                          <span>Accuracy: {perf.correctCount + perf.incorrectCount > 0 ? Math.round((perf.correctCount / (perf.correctCount + perf.incorrectCount)) * 100) : 0}%</span>
                          <span>{perf.correctCount} Correct &middot; {perf.incorrectCount} Incorrect &middot; {perf.unattemptedCount} Skipped</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Responses breakdown review */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm">Response Review Sheet</h3>
            
            {activeTest.sections && activeTest.sections.length > 0 ? (
              <div className="space-y-6">
                {activeTest.sections.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <div className="border-l-4 border-primary pl-3 py-0.5 mb-1 bg-secondary/5 pr-3 rounded-r-lg">
                      <h4 className="text-xs font-bold text-foreground">{sec.title}</h4>
                      {sec.description && <p className="text-[10px] text-muted-foreground mt-0.5">{sec.description}</p>}
                    </div>
                    <div className="space-y-3">
                      {sec.questions.map((q) => {
                        const idx = testQuestions.findIndex(tq => tq.id === q.id);
                        if (idx === -1) return null;
                        const selectedOptionId = answers[q.id];
                        const selectedOption = q.options.find(o => o.id === selectedOptionId);
                        const correctOption = q.options.find(o => o.id === q.correctOptionId);
                        const isCorrect = selectedOptionId === q.correctOptionId;

                        return (
                          <div key={q.id} className="p-4 rounded-xl bg-secondary/10 border border-border/80 space-y-3">
                            <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                              <span>Question {idx + 1}</span>
                              <span className={`px-2 py-0.5 rounded ${
                                !selectedOptionId
                                  ? "bg-secondary text-muted-foreground"
                                  : isCorrect
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-rose-500/10 text-rose-500"
                              }`}>
                                {!selectedOptionId ? "Skipped" : isCorrect ? "Correct" : "Incorrect"}
                              </span>
                            </div>

                            <p className="text-xs font-semibold leading-relaxed">{q.questionText}</p>

                            <div className="space-y-1.5 text-xs">
                              {selectedOptionId ? (
                                <>
                                  <p className={`font-semibold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    Your Choice: {selectedOption?.text}
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                      Correct Choice: {correctOption?.text}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <p className="text-amber-600 font-semibold">
                                  Correct Choice: {correctOption?.text} (You skipped this question)
                                </p>
                              )}
                            </div>

                            {/* Explanations block */}
                            <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                              <span className="font-bold text-foreground">Explanation:</span> {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {testQuestions.map((q, idx) => {
                  const selectedOptionId = answers[q.id];
                  const selectedOption = q.options.find(o => o.id === selectedOptionId);
                  const correctOption = q.options.find(o => o.id === q.correctOptionId);
                  const isCorrect = selectedOptionId === q.correctOptionId;

                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-secondary/15 border border-border space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
                        <span>Question {idx + 1}</span>
                        <span className={`px-2 py-0.5 rounded ${
                          !selectedOptionId
                            ? "bg-secondary text-muted-foreground"
                            : isCorrect
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {!selectedOptionId ? "Skipped" : isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>

                      <p className="text-xs font-semibold leading-relaxed">{q.questionText}</p>

                      <div className="space-y-1.5 text-xs">
                        {selectedOptionId ? (
                          <>
                            <p className={`font-semibold ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                              Your Choice: {selectedOption?.text}
                            </p>
                            {!isCorrect && (
                              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Correct Choice: {correctOption?.text}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-amber-600 font-semibold">
                            Correct Choice: {correctOption?.text} (You skipped this question)
                          </p>
                        )}
                      </div>

                      {/* Explanations block */}
                      <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground">Explanation:</span> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
