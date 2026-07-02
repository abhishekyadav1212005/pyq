"use client";

import { useState, useEffect } from "react";
import {
  mockQuestions,
  mockFlashcards,
  mockDiscussions,
  mockTests,
  mockUserStats,
  Question,
  Flashcard,
  DiscussionThread,
  MockTest
} from "@/lib/mockData";

export const useSupabase = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<{ questionId: string; isCorrect: boolean; selectedOptionId: string }[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tests, setTests] = useState<MockTest[]>([]);

  // Initialize from LocalStorage or mockData
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Questions
    const storedQuestions = localStorage.getItem("physioprep_questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      setQuestions(mockQuestions);
      localStorage.setItem("physioprep_questions", JSON.stringify(mockQuestions));
    }

    // 2. Flashcards
    const storedFlashcards = localStorage.getItem("physioprep_flashcards");
    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    } else {
      setFlashcards(mockFlashcards);
      localStorage.setItem("physioprep_flashcards", JSON.stringify(mockFlashcards));
    }

    // 3. Discussions
    const storedDiscussions = localStorage.getItem("physioprep_discussions");
    if (storedDiscussions) {
      setDiscussions(JSON.parse(storedDiscussions));
    } else {
      setDiscussions(mockDiscussions);
      localStorage.setItem("physioprep_discussions", JSON.stringify(mockDiscussions));
    }

    // 4. Bookmarks
    const storedBookmarks = localStorage.getItem("physioprep_bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      const initialBookmarks = ["q1", "q4"]; // default bookmarks
      setBookmarks(initialBookmarks);
      localStorage.setItem("physioprep_bookmarks", JSON.stringify(initialBookmarks));
    }

    // 5. Attempts
    const storedAttempts = localStorage.getItem("physioprep_attempts");
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts));
    } else {
      setAttempts([]);
      localStorage.setItem("physioprep_attempts", JSON.stringify([]));
    }

    // 6. Notifications
    const storedNotifications = localStorage.getItem("physioprep_notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      const initialNotifications = [
        { id: "n1", title: "Streak Alert! 🔥", message: "You are on a 7-day study streak. Complete a question today to keep it alive!", type: "streak", isRead: false, createdAt: new Date().toISOString() },
        { id: "n2", title: "Upcoming Exam Announcement 📅", message: "AIIMS Physiotherapist recruitment application is now open. Apply before July 15.", type: "exam", isRead: false, createdAt: new Date(Date.now() - 24*60*60*1000).toISOString() },
        { id: "n3", title: "Daily Goal Reminder 🧠", message: "Review your weak topic: 'Nerve Conduction Velocity' to boost your score.", type: "reminder", isRead: true, createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem("physioprep_notifications", JSON.stringify(initialNotifications));
    }

    // 7. Tests
    const storedTests = localStorage.getItem("physioprep_tests");
    if (storedTests) {
      setTests(JSON.parse(storedTests));
    } else {
      setTests(mockTests);
      localStorage.setItem("physioprep_tests", JSON.stringify(mockTests));
    }
  }, []);

  // Questions CRUD (Admin helper)
  const addQuestion = (newQuestion: Omit<Question, "id">) => {
    const questionWithId: Question = {
      ...newQuestion,
      id: "q_" + Math.random().toString(36).substr(2, 9)
    };
    const updated = [questionWithId, ...questions];
    setQuestions(updated);
    localStorage.setItem("physioprep_questions", JSON.stringify(updated));
    return questionWithId;
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem("physioprep_questions", JSON.stringify(updated));
  };

  // Bookmark Toggle
  const toggleBookmark = (questionId: string) => {
    let updated: string[];
    if (bookmarks.includes(questionId)) {
      updated = bookmarks.filter(id => id !== questionId);
    } else {
      updated = [...bookmarks, questionId];
    }
    setBookmarks(updated);
    localStorage.setItem("physioprep_bookmarks", JSON.stringify(updated));
  };

  // Record an Attempt
  const recordAttempt = (questionId: string, selectedOptionId: string, isCorrect: boolean) => {
    const newAttempt = { questionId, selectedOptionId, isCorrect };
    const updated = [...attempts, newAttempt];
    setAttempts(updated);
    localStorage.setItem("physioprep_attempts", JSON.stringify(updated));

    // Update global activity in mock stats helper
    const activeStats = JSON.parse(localStorage.getItem("physioprep_stats") || "{}");
    const updatedStats = {
      ...mockUserStats,
      ...activeStats,
      solvedToday: (activeStats.solvedToday || 0) + 1,
      questionsAttempted: (activeStats.questionsAttempted || 102) + 1,
      questionsCorrect: (activeStats.questionsCorrect || 80) + (isCorrect ? 1 : 0),
    };
    updatedStats.overallAccuracy = parseFloat(((updatedStats.questionsCorrect / updatedStats.questionsAttempted) * 100).toFixed(1));
    localStorage.setItem("physioprep_stats", JSON.stringify(updatedStats));
  };

  // Spaced Repetition Logic (SuperMemo-2 algorithm variant)
  const updateFlashcard = (id: string, rating: "easy" | "good" | "hard") => {
    const updated = flashcards.map(card => {
      if (card.id !== id) return card;

      let interval = card.interval;
      let easeFactor = card.easeFactor;

      if (rating === "hard") {
        interval = 1; // repeat tomorrow
        easeFactor = Math.max(1.3, easeFactor - 0.2);
      } else if (rating === "good") {
        interval = interval === 0 ? 1 : Math.round(interval * easeFactor);
        // keep easeFactor steady
      } else if (rating === "easy") {
        interval = interval === 0 ? 3 : Math.round(interval * easeFactor * 1.5);
        easeFactor = Math.min(3.0, easeFactor + 0.15);
      }

      const nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString();

      return {
        ...card,
        interval,
        easeFactor,
        nextReviewDate
      };
    });

    setFlashcards(updated);
    localStorage.setItem("physioprep_flashcards", JSON.stringify(updated));
  };

  // Discussions & Comments
  const addDiscussion = (questionId: string, title: string, content: string, author: string) => {
    const newThread: DiscussionThread = {
      id: "d_" + Math.random().toString(36).substr(2, 9),
      questionId,
      author,
      title,
      content,
      upvotes: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      comments: []
    };
    const updated = [newThread, ...discussions];
    setDiscussions(updated);
    localStorage.setItem("physioprep_discussions", JSON.stringify(updated));
  };

  const addComment = (discussionId: string, content: string, author: string) => {
    const updated = discussions.map(disc => {
      if (disc.id !== discussionId) return disc;
      const newComment = {
        id: "c_" + Math.random().toString(36).substr(2, 9),
        author,
        content,
        upvotes: 0,
        createdAt: new Date().toISOString()
      };
      return {
        ...disc,
        commentsCount: disc.commentsCount + 1,
        comments: [...disc.comments, newComment]
      };
    });
    setDiscussions(updated);
    localStorage.setItem("physioprep_discussions", JSON.stringify(updated));
  };

  // Notifications read toggling
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setNotifications(updated);
    localStorage.setItem("physioprep_notifications", JSON.stringify(updated));
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updated);
    localStorage.setItem("physioprep_notifications", JSON.stringify(updated));
  };

  // Tests CRUD (Admin helper)
  const addMockTest = (newTest: Omit<MockTest, "id"> & { id?: string }) => {
    const testWithId: MockTest = {
      ...newTest,
      id: newTest.id || "mock_" + Math.random().toString(36).substr(2, 9)
    };
    const index = tests.findIndex(t => t.id === testWithId.id);
    let updated: MockTest[];
    if (index >= 0) {
      updated = [...tests];
      updated[index] = testWithId;
    } else {
      updated = [testWithId, ...tests];
    }
    setTests(updated);
    localStorage.setItem("physioprep_tests", JSON.stringify(updated));
    return testWithId;
  };

  const deleteMockTest = (id: string) => {
    const updated = tests.filter(t => t.id !== id);
    setTests(updated);
    localStorage.setItem("physioprep_tests", JSON.stringify(updated));
  };

  return {
    questions,
    flashcards,
    discussions,
    bookmarks,
    attempts,
    notifications,
    tests,
    addQuestion,
    deleteQuestion,
    toggleBookmark,
    recordAttempt,
    updateFlashcard,
    addDiscussion,
    addComment,
    markNotificationRead,
    markAllNotificationsRead,
    addMockTest,
    deleteMockTest
  };
};
