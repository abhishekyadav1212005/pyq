"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { Question, MockTest } from "@/lib/mockData";
import {
  ShieldAlert,
  Users,
  Database,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  XCircle,
  Settings
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth() as any;
  const { questions, addQuestion, deleteQuestion, tests, addMockTest, deleteMockTest } = useSupabase();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"users" | "questions" | "tests" | "csv">("users");

  // Form States for creating a single question (in MCQ Manager tab)
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [reference, setReference] = useState("");
  const [subject, setSubject] = useState("Anatomy");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [exam, setExam] = useState("AIIMS");
  const [year, setYear] = useState(2023);
  const [formSuccess, setFormSuccess] = useState(false);

  // CSV States
  const [csvText, setCsvText] = useState("");
  const [csvSuccessCount, setCsvSuccessCount] = useState<number | null>(null);
  const [csvError, setCsvError] = useState("");

  // Test Builder States
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  
  // General Test Info
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testDuration, setTestDuration] = useState(60);
  const [testDifficulty, setTestDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [testPosMarks, setTestPosMarks] = useState(1);
  const [testNegMarks, setTestNegMarks] = useState(0.25);
  
  // Sections List
  const [testSections, setTestSections] = useState<any[]>([]);
  
  // Add Section form
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");

  // Write new question directly under section
  const [addingQToSectionId, setAddingQToSectionId] = useState<string | null>(null);
  const [inlineQText, setInlineQText] = useState("");
  const [inlineOptA, setInlineOptA] = useState("");
  const [inlineOptB, setInlineOptB] = useState("");
  const [inlineOptC, setInlineOptC] = useState("");
  const [inlineOptD, setInlineOptD] = useState("");
  const [inlineCorrectOpt, setInlineCorrectOpt] = useState("A");
  const [inlineExplanation, setInlineExplanation] = useState("");
  const [inlineReference, setInlineReference] = useState("");
  const [inlineSubject, setInlineSubject] = useState("Anatomy");
  const [inlineTopic, setInlineTopic] = useState("");
  const [inlineDifficulty, setInlineDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Select question from pool under section
  const [selectingQForSectionId, setSelectingQForSectionId] = useState<string | null>(null);
  const [poolSearch, setPoolSearch] = useState("");
  const [poolSubjectFilter, setPoolSubjectFilter] = useState("All");

  // Success indicator for test saving
  const [testSuccessMessage, setTestSuccessMessage] = useState("");

  // Users Mock data list
  const mockUsersList = [
    { id: "u1", name: "Abhishek Yadav", email: "abhishek.yadav@svnirtar.edu", college: "SVNIRTAR, Cuttack", xp: 820, streak: 7, role: "student" },
    { id: "u2", name: "Sneha Sharma", email: "sneha.sharma@ipgmer.edu", college: "IPGMER, Kolkata", xp: 4520, streak: 12, role: "student" },
    { id: "u3", name: "Rahul Verma", email: "rahul.v@kem.edu", college: "KEM Hospital, Mumbai", xp: 4180, streak: 19, role: "student" },
    { id: "u4", name: "Priya Nair", email: "priya.nair@manipal.edu", college: "MCOPS, Manipal", xp: 3950, streak: 2, role: "student" },
    { id: "u5", name: "Admin Officer", email: "admin@physioprep.com", college: "National Institute", xp: 5000, streak: 99, role: "admin" }
  ];

  // Shield admin role access
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-danger mb-4 animate-bounce" />
        <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
        <p className="text-xs text-muted-foreground mb-4">You do not have administrative permissions to view this dashboard.</p>
      </div>
    );
  }

  // Handle manual question creation
  const handleCreateQuestion = (e: any) => {
    e.preventDefault();
    setFormSuccess(false);

    const newQ = {
      exam,
      subject,
      topic: topic || "General Topic",
      year,
      questionText,
      options: [
        { id: "opt_a", text: optionA },
        { id: "opt_b", text: optionB },
        { id: "opt_c", text: optionC },
        { id: "opt_d", text: optionD }
      ],
      correctOptionId: correctOption === "A" ? "opt_a" : correctOption === "B" ? "opt_b" : correctOption === "C" ? "opt_c" : "opt_d",
      explanation,
      referenceBook: reference,
      difficulty
    };

    addQuestion(newQ);
    setFormSuccess(true);

    // Reset Form
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setTopic("");
    setExplanation("");
    setReference("");

    setTimeout(() => setFormSuccess(false), 3000);
  };

  // CSV Importer parser
  const handleCsvImport = (e: any) => {
    e.preventDefault();
    setCsvError("");
    setCsvSuccessCount(null);

    if (!csvText.trim()) {
      setCsvError("CSV text is empty.");
      return;
    }

    try {
      const rows = csvText.split("\n").filter((row: string) => row.trim());
      if (rows.length < 2) {
        setCsvError("No question rows found (CSV must include header).");
        return;
      }

      // Check header
      const header = rows[0].split(",").map((h: string) => h.trim().toLowerCase());
      const expectedHeaders = ["questiontext", "optiona", "optionb", "optionc", "optiond", "correctoption", "explanation", "subject", "topic", "difficulty", "exam", "year"];
      const missing = expectedHeaders.filter((h: string) => !header.includes(h));

      if (missing.length > 0) {
        setCsvError(`Missing required headers: ${missing.join(", ")}`);
        return;
      }

      let count = 0;
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c: string) => c.replace(/^"|"$/g, "").trim());
        
        if (cols.length < expectedHeaders.length) continue;

        const getVal = (headerName: string) => cols[header.indexOf(headerName)];

        const text = getVal("questiontext");
        const a = getVal("optiona");
        const b = getVal("optionb");
        const c = getVal("optionc");
        const d = getVal("optiond");
        const correct = getVal("correctoption").toUpperCase();
        const expl = getVal("explanation");
        const sub = getVal("subject");
        const top = getVal("topic");
        const diff = (getVal("difficulty") || "Medium") as "Easy" | "Medium" | "Hard";
        const ex = getVal("exam");
        const yr = parseInt(getVal("year") || "2023");

        const newQ = {
          exam: ex,
          subject: sub,
          topic: top,
          year: yr,
          questionText: text,
          options: [
            { id: "opt_a", text: a },
            { id: "opt_b", text: b },
            { id: "opt_c", text: c },
            { id: "opt_d", text: d }
          ],
          correctOptionId: correct === "A" ? "opt_a" : correct === "B" ? "opt_b" : correct === "C" ? "opt_c" : "opt_d",
          explanation: expl,
          referenceBook: "",
          difficulty: diff
        };

        addQuestion(newQ);
        count++;
      }

      setCsvSuccessCount(count);
      setCsvText("");
    } catch (err: any) {
      setCsvError(`Parsing error: ${err.message}`);
    }
  };

  const sampleCsvHeader = "questionText,optionA,optionB,optionC,optionD,correctOption,explanation,subject,topic,difficulty,exam,year\n";
  const sampleCsvRow = `"Which muscle initiates abduction?","Supraspinatus","Deltoid","Infraspinatus","Subscapularis",A,"Supraspinatus initiates first 15 degrees.","Anatomy","Shoulder","Easy","AIIMS",2022`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Portal</h1>
        <p className="text-xs text-muted-foreground">Manage user accounts, add test questions, and view platform metrics</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "questions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="w-4 h-4" /> MCQ Manager
        </button>
        <button
          onClick={() => setActiveTab("tests")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "tests" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" /> Mock Test Builder
        </button>
        <button
          onClick={() => setActiveTab("csv")}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === "csv" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="w-4 h-4" /> CSV Importer
        </button>
      </div>

      {/* 1. USERS LIST TAB */}
      {activeTab === "users" && (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4 text-left">
          <h3 className="font-bold text-sm">Active User Logs</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">College</th>
                  <th className="pb-3 pr-4">Streak</th>
                  <th className="pb-3 pr-4">XP</th>
                  <th className="pb-3 pr-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockUsersList.map(u => (
                  <tr key={u.id} className="text-foreground/90">
                    <td className="py-3.5 pr-4 font-semibold">{u.name}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3.5 pr-4">{u.college}</td>
                    <td className="py-3.5 pr-4 font-bold text-orange-500">{u.streak} days</td>
                    <td className="py-3.5 pr-4 font-bold text-primary">{u.xp} XP</td>
                    <td className="py-3.5 pr-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "admin" ? "bg-accent/15 text-accent" : "bg-secondary text-foreground"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. QUESTIONS CRUD TAB */}
      {activeTab === "questions" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
          {/* Create Question Form */}
          <div className="lg:col-span-1 p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
              <Plus className="w-4 h-4" /> Add Single MCQ
            </h3>

            {formSuccess && (
              <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Question added to local database!
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Question Text</label>
                <textarea
                  rows={3}
                  required
                  value={questionText}
                  onChange={(e: any) => setQuestionText(e.target.value)}
                  placeholder="Enter the MCQ description..."
                  className="w-full p-2.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold">Option A</label>
                  <input
                    type="text"
                    required
                    value={optionA}
                    onChange={(e: any) => setOptionA(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Option B</label>
                  <input
                    type="text"
                    required
                    value={optionB}
                    onChange={(e: any) => setOptionB(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Option C</label>
                  <input
                    type="text"
                    required
                    value={optionC}
                    onChange={(e: any) => setOptionC(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Option D</label>
                  <input
                    type="text"
                    required
                    value={optionD}
                    onChange={(e: any) => setOptionD(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Correct key */}
              <div className="space-y-1">
                <label className="font-semibold">Correct Option</label>
                <select
                  value={correctOption}
                  onChange={(e: any) => setCorrectOption(e.target.value)}
                  className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              {/* Explanation & Reference */}
              <div className="space-y-1">
                <label className="font-semibold">Explanation</label>
                <textarea
                  rows={2}
                  required
                  value={explanation}
                  onChange={(e: any) => setExplanation(e.target.value)}
                  className="w-full p-2.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold">Reference Book</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e: any) => setReference(e.target.value)}
                  placeholder="e.g. BD Chaurasia Vol 1"
                  className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                />
              </div>

              {/* Categories */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold">Subject</label>
                  <select
                    value={subject}
                    onChange={(e: any) => setSubject(e.target.value)}
                    className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  >
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Electrotherapy">Electrotherapy</option>
                    <option value="Kinesiology">Kinesiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Cardio-respiratory">Cardio-respiratory</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Topic</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e: any) => setTopic(e.target.value)}
                    placeholder="e.g. Shoulder Joint"
                    className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value as any)}
                    className="w-full px-1.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Exam</label>
                  <input
                    type="text"
                    required
                    value={exam}
                    onChange={(e: any) => setExam(e.target.value)}
                    className="w-full px-1.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Year</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e: any) => setYear(parseInt(e.target.value))}
                    className="w-full px-1.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition-all shadow-md btn-duo-primary"
              >
                Create Question
              </button>
            </form>
          </div>

          {/* List/Delete table */}
          <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm">MCQ Pools ({questions.length} total)</h3>

            <div className="overflow-y-auto max-h-[580px] space-y-3 pr-2">
              {questions.map((q: Question) => (
                <div key={q.id} className="p-3 border border-border/80 rounded-xl bg-secondary/10 flex justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex gap-1.5 items-center text-[9px] font-bold text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">{q.exam} {q.year}</span>
                      <span>{q.subject} &middot; {q.topic}</span>
                    </div>
                    <p className="font-semibold text-foreground/90 line-clamp-2">{q.questionText}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this question?")) {
                        deleteQuestion(q.id);
                      }
                    }}
                    className="p-2 border border-border hover:bg-danger/10 hover:border-danger/30 text-danger rounded-lg transition-colors flex-shrink-0 self-center"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MOCK TEST BUILDER TAB */}
      {activeTab === "tests" && (
        <div className="space-y-6 text-left">
          {!isCreatingTest ? (
            // LIST VIEW OF TESTS
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-sm">Configured Mock Tests</h3>
                  <p className="text-xs text-muted-foreground">Manage and configure mock tests available to students.</p>
                </div>
                <button
                  onClick={() => {
                    // Reset all test builder form states
                    setTestTitle("");
                    setTestDescription("");
                    setTestDuration(60);
                    setTestDifficulty("Medium");
                    setTestPosMarks(1);
                    setTestNegMarks(0.25);
                    setTestSections([]);
                    setEditingTestId(null);
                    setIsCreatingTest(true);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create New Mock Test
                </button>
              </div>

              {testSuccessMessage && (
                <div className="p-3 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {testSuccessMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests && tests.map((test) => (
                  <div key={test.id} className="p-4 rounded-xl border border-border bg-secondary/10 flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          test.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" : test.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {test.difficulty}
                        </span>
                        {test.sections && test.sections.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold">
                            {test.sections.length} Sections
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm truncate">{test.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{test.description}</p>
                      
                      <div className="flex gap-4 text-[10px] text-muted-foreground font-semibold">
                        <span>Duration: {test.durationMinutes}m</span>
                        <span>Total Qs: {test.totalQuestions}</span>
                        <span>Marking: +{test.positiveMarks}/-{test.negativeMarks}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Load test into form states
                          setEditingTestId(test.id);
                          setTestTitle(test.title);
                          setTestDescription(test.description);
                          setTestDuration(test.durationMinutes);
                          setTestDifficulty(test.difficulty);
                          setTestPosMarks(test.positiveMarks);
                          setTestNegMarks(test.negativeMarks);
                          setTestSections(test.sections || []);
                          setIsCreatingTest(true);
                        }}
                        className="p-2 border border-border bg-card hover:bg-secondary/40 text-foreground rounded-lg transition-colors"
                        title="Edit Mock Test"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                            deleteMockTest(test.id);
                          }
                        }}
                        className="p-2 border border-border bg-card hover:bg-danger/10 hover:border-danger/30 text-danger rounded-lg transition-colors"
                        title="Delete Mock Test"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!tests || tests.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center col-span-2 py-8">No mock tests configured. Click the button above to create one.</p>
                )}
              </div>
            </div>
          ) : (
            // TEST BUILDER FORM EDITOR
            <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                  <h3 className="font-bold text-sm">{editingTestId ? "Edit Mock Test" : "Create Mock Test"}</h3>
                  <p className="text-xs text-muted-foreground">Configure details, structure sections, and allocate MCQs.</p>
                </div>
                <button
                  onClick={() => setIsCreatingTest(false)}
                  className="px-3 py-1.5 border border-border hover:bg-secondary/40 text-foreground rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              {/* 1. General Info Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">1. Test Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold">Mock Test Title</label>
                    <input
                      type="text"
                      required
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="e.g. AIIMS Mini Mock Test - 1"
                      className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold">Difficulty Level</label>
                    <select
                      value={testDifficulty}
                      onChange={(e) => setTestDifficulty(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    placeholder="Enter short description explaining test coverage..."
                    className="w-full p-2.5 border border-border bg-secondary/15 rounded-lg focus:outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={testDuration}
                      onChange={(e) => setTestDuration(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold">Positive Marks / Correct Q</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min={0}
                      value={testPosMarks}
                      onChange={(e) => setTestPosMarks(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold">Negative Marks / Incorrect Q</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min={0}
                      value={testNegMarks}
                      onChange={(e) => setTestNegMarks(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 border border-border bg-secondary/15 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Sections Manager */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">2. Test Sections ({testSections.length})</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setNewSectionTitle("");
                      setNewSectionDesc("");
                      setShowAddSection(true);
                    }}
                    className="px-3 py-1.5 bg-secondary hover:bg-secondary/40 text-foreground border border-border rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Section
                  </button>
                </div>

                {/* Inline Add Section Form */}
                {showAddSection && (
                  <div className="p-4 rounded-xl border border-border bg-secondary/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-foreground">Configure New Section</span>
                      <button onClick={() => setShowAddSection(false)} type="button">
                        <XCircle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1 md:col-span-1">
                        <label className="font-semibold">Section Name</label>
                        <input
                          type="text"
                          required
                          value={newSectionTitle}
                          onChange={(e) => setNewSectionTitle(e.target.value)}
                          placeholder="e.g. Section A: Anatomy"
                          className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="font-semibold">Section Description (Optional)</label>
                        <input
                          type="text"
                          value={newSectionDesc}
                          onChange={(e) => setNewSectionDesc(e.target.value)}
                          placeholder="e.g. Core anatomical questions covering upper and lower limbs."
                          className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSectionTitle.trim()) {
                          alert("Section title is required.");
                          return;
                        }
                        const newSec = {
                          id: "sec_" + Math.random().toString(36).substr(2, 9),
                          title: newSectionTitle,
                          description: newSectionDesc,
                          questions: []
                        };
                        setTestSections([...testSections, newSec]);
                        setShowAddSection(false);
                      }}
                      className="px-3.5 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark"
                    >
                      Save Section
                    </button>
                  </div>
                )}

                {/* Sections List */}
                <div className="space-y-4">
                  {testSections.map((sec, secIdx) => (
                    <div key={sec.id} className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
                      {/* Section Title Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                            <span className="bg-primary/10 text-primary w-5 h-5 rounded flex items-center justify-center font-bold text-[10px]">{secIdx + 1}</span>
                            {sec.title}
                          </h5>
                          {sec.description && <p className="text-[10px] text-muted-foreground">{sec.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove section "${sec.title}" and all its questions?`)) {
                              setTestSections(testSections.filter(s => s.id !== sec.id));
                            }
                          }}
                          className="p-1 text-muted-foreground hover:text-danger rounded transition-colors"
                          title="Remove Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section Questions List */}
                      <div className="space-y-2 pl-6 border-l-2 border-primary/20">
                        {sec.questions.map((q: any, qIdx: number) => (
                          <div key={q.id} className="p-2.5 rounded-lg border border-border bg-secondary/10 flex justify-between items-center gap-4 text-[11px]">
                            <div className="min-w-0">
                              <span className="font-bold text-muted-foreground mr-1">Q{qIdx + 1}.</span>
                              <span className="font-semibold text-foreground/90 line-clamp-1">{q.questionText}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = testSections.map(s => {
                                  if (s.id !== sec.id) return s;
                                  return {
                                    ...s,
                                    questions: s.questions.filter((item: any) => item.id !== q.id)
                                  };
                                });
                                setTestSections(updated);
                              }}
                              className="text-muted-foreground hover:text-danger flex-shrink-0"
                              title="Remove Question"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {sec.questions.length === 0 && (
                          <p className="text-[10px] text-muted-foreground italic py-1">No questions added in this section yet.</p>
                        )}
                      </div>

                      {/* Add Question Controls */}
                      <div className="flex gap-3 pl-6 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => {
                            setAddingQToSectionId(addingQToSectionId === sec.id ? null : sec.id);
                            setSelectingQForSectionId(null);
                          }}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Write New MCQ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectingQForSectionId(selectingQForSectionId === sec.id ? null : sec.id);
                            setAddingQToSectionId(null);
                            setPoolSearch("");
                            setPoolSubjectFilter("All");
                          }}
                          className="text-accent hover:underline flex items-center gap-1"
                        >
                          <Database className="w-3.5 h-3.5" /> Add from Question Pool
                        </button>
                      </div>

                      {/* 2a. Inline Form to Write New Question */}
                      {addingQToSectionId === sec.id && (
                        <div className="p-4 rounded-xl border border-border bg-secondary/15 space-y-3 text-xs pl-6">
                          <h6 className="font-bold text-foreground text-[11px] mb-1">Write New MCQ & Add to Section</h6>
                          <div className="space-y-1">
                            <label className="font-semibold">Question Text</label>
                            <textarea
                              rows={2}
                              required
                              value={inlineQText}
                              onChange={(e) => setInlineQText(e.target.value)}
                              placeholder="Enter the MCQ description..."
                              className="w-full p-2.5 border border-border bg-card rounded-lg focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="font-semibold">Option A</label>
                              <input
                                type="text"
                                required
                                value={inlineOptA}
                                onChange={(e) => setInlineOptA(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Option B</label>
                              <input
                                type="text"
                                required
                                value={inlineOptB}
                                onChange={(e) => setInlineOptB(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Option C</label>
                              <input
                                type="text"
                                required
                                value={inlineOptC}
                                onChange={(e) => setInlineOptC(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Option D</label>
                              <input
                                type="text"
                                required
                                value={inlineOptD}
                                onChange={(e) => setInlineOptD(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="font-semibold">Correct Option</label>
                              <select
                                value={inlineCorrectOpt}
                                onChange={(e) => setInlineCorrectOpt(e.target.value)}
                                className="w-full px-2 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              >
                                <option value="A">Option A</option>
                                <option value="B">Option B</option>
                                <option value="C">Option C</option>
                                <option value="D">Option D</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Difficulty</label>
                              <select
                                value={inlineDifficulty}
                                onChange={(e) => setInlineDifficulty(e.target.value as any)}
                                className="w-full px-2 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold">Explanation</label>
                            <textarea
                              rows={2}
                              required
                              value={inlineExplanation}
                              onChange={(e) => setInlineExplanation(e.target.value)}
                              placeholder="Provide clinical explanation..."
                              className="w-full p-2.5 border border-border bg-card rounded-lg focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="font-semibold">Subject</label>
                              <select
                                value={inlineSubject}
                                onChange={(e) => setInlineSubject(e.target.value)}
                                className="w-full px-2 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              >
                                <option value="Anatomy">Anatomy</option>
                                <option value="Physiology">Physiology</option>
                                <option value="Electrotherapy">Electrotherapy</option>
                                <option value="Kinesiology">Kinesiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Cardio-respiratory">Cardio-respiratory</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Topic</label>
                              <input
                                type="text"
                                required
                                value={inlineTopic}
                                onChange={(e) => setInlineTopic(e.target.value)}
                                placeholder="e.g. Knee ligaments"
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold">Reference Book</label>
                              <input
                                type="text"
                                value={inlineReference}
                                onChange={(e) => setInlineReference(e.target.value)}
                                placeholder="e.g. BD Chaurasia Vol 2"
                                className="w-full px-2.5 py-1.5 border border-border bg-card rounded-lg focus:outline-none"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!inlineQText || !inlineOptA || !inlineOptB || !inlineOptC || !inlineOptD) {
                                alert("Please fill in question text and all options.");
                                return;
                              }
                              const newQObj = {
                                exam: "Mock Test",
                                subject: inlineSubject,
                                topic: inlineTopic || "General",
                                year: new Date().getFullYear(),
                                questionText: inlineQText,
                                options: [
                                  { id: "opt_a", text: inlineOptA },
                                  { id: "opt_b", text: inlineOptB },
                                  { id: "opt_c", text: inlineOptC },
                                  { id: "opt_d", text: inlineOptD }
                                ],
                                correctOptionId: inlineCorrectOpt === "A" ? "opt_a" : inlineCorrectOpt === "B" ? "opt_b" : inlineCorrectOpt === "C" ? "opt_c" : "opt_d",
                                explanation: inlineExplanation,
                                referenceBook: inlineReference,
                                difficulty: inlineDifficulty
                              };
                              const addedQ = addQuestion(newQObj);
                              const updated = testSections.map(s => {
                                if (s.id !== sec.id) return s;
                                return {
                                  ...s,
                                  questions: [...s.questions, addedQ]
                                };
                              });
                              setTestSections(updated);
                              
                              setInlineQText("");
                              setInlineOptA("");
                              setInlineOptB("");
                              setInlineOptC("");
                              setInlineOptD("");
                              setInlineExplanation("");
                              setInlineReference("");
                              setInlineTopic("");
                              setAddingQToSectionId(null);
                            }}
                            className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-sm"
                          >
                            Add to Section
                          </button>
                        </div>
                      )}

                      {/* 2b. Inline Form to Select from Pool */}
                      {selectingQForSectionId === sec.id && (
                        <div className="p-4 rounded-xl border border-border bg-secondary/15 space-y-3 text-xs pl-6">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h6 className="font-bold text-foreground text-[11px]">Select MCQs from Platform Pool</h6>
                            
                            <div className="flex gap-2 items-center">
                              <select
                                value={poolSubjectFilter}
                                onChange={(e) => setPoolSubjectFilter(e.target.value)}
                                className="px-2 py-1 border border-border bg-card rounded-md focus:outline-none text-[10px]"
                              >
                                <option value="All">All Subjects</option>
                                <option value="Anatomy">Anatomy</option>
                                <option value="Physiology">Physiology</option>
                                <option value="Electrotherapy">Electrotherapy</option>
                                <option value="Kinesiology">Kinesiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Cardio-respiratory">Cardio-respiratory</option>
                              </select>

                              <input
                                type="text"
                                placeholder="Search pool questions..."
                                value={poolSearch}
                                onChange={(e) => setPoolSearch(e.target.value)}
                                className="px-2.5 py-1 border border-border bg-card rounded-md focus:outline-none text-[10px] w-40"
                              />
                            </div>
                          </div>

                          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-border/50 p-2 rounded-lg bg-card">
                            {questions
                              .filter(q => {
                                const matchSearch = q.questionText.toLowerCase().includes(poolSearch.toLowerCase()) || q.topic.toLowerCase().includes(poolSearch.toLowerCase());
                                const matchSub = poolSubjectFilter === "All" || q.subject === poolSubjectFilter;
                                const alreadyInSection = sec.questions.some((item: any) => item.id === q.id);
                                return matchSearch && matchSub && !alreadyInSection;
                              })
                              .map(q => (
                                <div key={q.id} className="p-2 border border-border rounded bg-secondary/5 flex justify-between gap-3 items-center text-[10px]">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex gap-1.5 items-center font-bold text-muted-foreground text-[8px] mb-0.5">
                                      <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded">{q.subject}</span>
                                      <span>{q.topic}</span>
                                    </div>
                                    <p className="font-semibold text-foreground/95 truncate">{q.questionText}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = testSections.map(s => {
                                        if (s.id !== sec.id) return s;
                                        return {
                                          ...s,
                                          questions: [...s.questions, q]
                                        };
                                      });
                                      setTestSections(updated);
                                    }}
                                    className="px-2.5 py-1 bg-accent hover:bg-accent-dark text-white rounded font-bold"
                                  >
                                    Add
                                  </button>
                                </div>
                              ))}
                            {questions.filter(q => {
                              const matchSearch = q.questionText.toLowerCase().includes(poolSearch.toLowerCase()) || q.topic.toLowerCase().includes(poolSearch.toLowerCase());
                              const matchSub = poolSubjectFilter === "All" || q.subject === poolSubjectFilter;
                              const alreadyInSection = sec.questions.some((item: any) => item.id === q.id);
                              return matchSearch && matchSub && !alreadyInSection;
                            }).length === 0 && (
                              <p className="text-[10px] text-muted-foreground text-center py-4">No matching questions found in pool.</p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectingQForSectionId(null)}
                            className="px-3.5 py-1 bg-secondary text-foreground border border-border font-bold rounded-lg hover:bg-secondary/40"
                          >
                            Done Selecting
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {testSections.length === 0 && (
                    <div className="border border-dashed border-border p-8 rounded-xl text-center text-xs text-muted-foreground">
                      No sections created for this mock test yet. Click "+ Add Section" above to define test sections.
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Save Controls */}
              <div className="flex gap-3 pt-6 border-t border-border justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreatingTest(false)}
                  className="px-5 py-2.5 border border-border hover:bg-secondary/40 text-foreground rounded-lg text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!testTitle.trim()) {
                      alert("Test title is required.");
                      return;
                    }
                    if (testSections.length === 0) {
                      alert("Please create at least one section.");
                      return;
                    }
                    const emptySec = testSections.find(s => s.questions.length === 0);
                    if (emptySec) {
                      alert(`Section "${emptySec.title}" has no questions. Please add questions or remove the section.`);
                      return;
                    }

                    const totalQs = testSections.reduce((acc, s) => acc + s.questions.length, 0);

                    const testPayload: MockTest = {
                      id: editingTestId || undefined,
                      title: testTitle,
                      description: testDescription || "Section-based practice test.",
                      durationMinutes: testDuration || 60,
                      totalQuestions: totalQs,
                      positiveMarks: testPosMarks,
                      negativeMarks: testNegMarks,
                      difficulty: testDifficulty,
                      sections: testSections
                    } as any;

                    addMockTest(testPayload);
                    setTestSuccessMessage(editingTestId ? `Mock test "${testTitle}" updated successfully!` : `Mock test "${testTitle}" created successfully!`);
                    setIsCreatingTest(false);
                    setEditingTestId(null);
                    setTimeout(() => setTestSuccessMessage(""), 4000);
                  }}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Save Mock Test
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CSV IMPORT TAB */}
      {activeTab === "csv" && (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6 text-left">
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Bulk Question Import
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Import physiotherapy questions in bulk by pasting comma-separated values (CSV) below.
              The parser automatically reads fields and appends them to your active database pool.
            </p>
          </div>

          {csvSuccessCount !== null && (
            <div className="p-3.5 rounded-lg bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Successfully imported {csvSuccessCount} questions!
            </div>
          )}

          {csvError && (
            <div className="p-3.5 rounded-lg bg-danger/15 border border-danger/30 text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {csvError}
            </div>
          )}

          {/* Guidelines */}
          <div className="p-4 rounded-xl bg-secondary/15 border border-border space-y-2 text-xs">
            <p className="font-bold text-foreground/80">CSV Format Blueprint:</p>
            <pre className="p-2.5 bg-black/5 dark:bg-black/30 rounded overflow-x-auto text-[10px] leading-relaxed">
              {sampleCsvHeader}
              {sampleCsvRow}
            </pre>
            <p className="text-[10px] text-muted-foreground">
              * Note: Double quotes are required around fields that contain commas to prevent parsing offsets.
            </p>
          </div>

          <form onSubmit={handleCsvImport} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Paste CSV Text Content</label>
              <textarea
                rows={8}
                required
                value={csvText}
                onChange={(e: any) => setCsvText(e.target.value)}
                placeholder="Paste CSV rows here, starting with header..."
                className="w-full p-3.5 border border-border bg-secondary/15 rounded-lg text-xs font-mono focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs shadow-md transition-colors"
            >
              Parse & Import Questions
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
