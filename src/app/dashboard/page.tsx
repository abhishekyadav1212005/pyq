"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { mockUserStats } from "@/lib/mockData";
import {
  Flame,
  Zap,
  Target,
  Trophy,
  TrendingUp,
  Clock,
  ArrowUpRight,
  PlusCircle,
  HelpCircle,
  Lightbulb,
  CheckCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { attempts } = useSupabase();
  const [stats, setStats] = useState(mockUserStats);

  // Sync with live attempts stats if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("physioprep_stats");
      if (stored) {
        setStats(JSON.parse(stored));
      }
    }
  }, [attempts]);

  if (!user) return null;

  // Render a mini circular indicator
  const accuracyColor = stats.overallAccuracy >= 80 ? "text-emerald-500" : stats.overallAccuracy >= 65 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="space-y-6">
      {/* 1. Header welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-xs text-muted-foreground">
            Targeting {user.targetExams.join(", ")} | Keep up the momentum!
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/practice"
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-md hover:bg-primary-dark transition-all btn-duo-primary"
          >
            Start Practice
          </Link>
          <Link
            href="/mock-tests"
            className="px-5 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg font-bold text-sm border border-border transition-colors"
          >
            Take Mock Test
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solved */}
        <div className="p-4 rounded-xl border border-border bg-card flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Questions Solved</span>
            <p className="text-2xl font-extrabold">{stats.questionsAttempted}</p>
            <p className="text-[10px] text-success font-medium">+{stats.solvedToday} solved today</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-xl border border-border bg-card flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Overall Accuracy</span>
            <p className={`text-2xl font-extrabold ${accuracyColor}`}>{stats.overallAccuracy}%</p>
            <p className="text-[10px] text-muted-foreground font-medium">Target accuracy: 80%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Daily Streak */}
        <div className="p-4 rounded-xl border border-border bg-card flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Study Streak</span>
            <p className="text-2xl font-extrabold text-orange-500 flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-orange-500" />
              {user.streakCount} Days
            </p>
            <p className="text-[10px] text-orange-500/80 font-medium">Protect your streak today!</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Global Rank */}
        <div className="p-4 rounded-xl border border-border bg-card flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Leaderboard Rank</span>
            <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">#{user.role === 'admin' ? 1 : stats.rank}</p>
            <p className="text-[10px] text-muted-foreground font-medium">out of 12,450 aspirants</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Center Section: Goals, Streaks, Weaks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Goals card */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Daily Practice Goal
              </h3>
              <span className="text-xs font-semibold text-primary">
                {stats.solvedToday} / {stats.goalToday} MCQs
              </span>
            </div>

            {/* Goal progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (stats.solvedToday / stats.goalToday) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {stats.solvedToday >= stats.goalToday
                  ? "🎉 Daily goal accomplished! Keep crushing it for bonus XP!"
                  : `Solve ${stats.goalToday - stats.solvedToday} more questions to hit your goal.`}
              </p>
            </div>
          </div>

          {/* Performance Charts Card */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Weekly Study Performance
              </h3>
              <p className="text-[10px] text-muted-foreground">XP gains and solved questions count over the last 7 days</p>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyActivity}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="questions" name="Solved MCQs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="xp" name="XP Gained" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GitHub-like Heatmap Calendar */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Study Consistency Calendar
              </h3>
              <p className="text-[10px] text-muted-foreground">Your daily practice activity over the last 2 months</p>
            </div>

            {/* Heatmap Grid */}
            <div className="flex flex-wrap gap-1 pt-2 justify-start">
              {Array.from({ length: 42 }).map((_, idx) => {
                // Generate color based on arbitrary mock active blocks
                const dayOffset = 41 - idx;
                const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split("T")[0];
                const activeDay = stats.heatmapData.find((d: any) => d.date === dateStr);
                const count = activeDay ? activeDay.count : 0;

                let color = "bg-secondary/40";
                if (count > 0 && count < 5) color = "bg-primary/20";
                else if (count >= 5 && count < 10) color = "bg-primary/50";
                else if (count >= 10) color = "bg-primary";

                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-md ${color} transition-all hover:scale-110 flex items-center justify-center text-[8px] font-bold text-white/50 cursor-pointer`}
                    title={`${date.toLocaleDateString()}: ${count} questions solved`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 text-[10px] text-muted-foreground justify-end pt-1">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-secondary/40 rounded-sm" /> No Activity</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary/20 rounded-sm" /> 1-4 Solved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary/50 rounded-sm" /> 5-9 Solved</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-primary rounded-sm" /> 10+ Solved</span>
            </div>
          </div>
        </div>

        {/* Right 1 col (Weak Topics & Recent Activity) */}
        <div className="space-y-6">
          {/* Weak Topics */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Target Weak Topics
              </h3>
              <p className="text-[10px] text-muted-foreground">AI detected subjects where you score lower than 65%</p>
            </div>

            <div className="space-y-3.5">
              {stats.weakTopics.map((topic: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="truncate max-w-[150px]">{topic.topic}</span>
                    <span className="text-rose-500">{topic.accuracy}% accuracy</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${topic.accuracy}%` }} />
                    </div>
                    <Link
                      href="/practice"
                      className="px-2 py-0.5 border border-primary text-primary hover:bg-primary/5 rounded text-[10px] font-bold"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Wise Accuracy Progress */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Subject Mastery
              </h3>
              <p className="text-[10px] text-muted-foreground">Subject performance analysis</p>
            </div>

            <div className="space-y-3.5">
              {stats.subjectAccuracy.map((subject: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{subject.name}</span>
                    <span className="text-primary">{subject.accuracy}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full"
                      style={{ width: `${subject.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity timeline */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <h3 className="font-bold text-sm">Recent Activity</h3>
            <div className="space-y-4 border-l border-border pl-4 relative">
              {stats.recentActivity.map((act: any) => (
                <div key={act.id} className="relative space-y-1 text-left">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                  
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold leading-none">{act.description}</p>
                    <span className="text-[9px] text-muted-foreground">{act.time}</span>
                  </div>
                  {act.result && (
                    <p className="text-[10px] text-muted-foreground bg-secondary/35 px-2 py-0.5 rounded inline-block">
                      {act.result}
                    </p>
                  )}
                  <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">+{act.xp} XP awarded</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
