"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabase } from "@/hooks/useSupabase";
import { mockAchievements, mockLeaderboard } from "@/lib/mockData";
import {
  User,
  Building,
  GraduationCap,
  Award,
  Zap,
  Flame,
  Target,
  Trophy,
  Save,
  Edit2,
  Check,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { bookmarks } = useSupabase();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [college, setCollege] = useState(user?.college || "");
  const [gradYear, setGradYear] = useState(user?.graduationYear || 2026);
  const [targetExams, setTargetExams] = useState<string[]>(user?.targetExams || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({
      fullName,
      college,
      graduationYear: gradYear,
      targetExams
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExamToggle = (exam: string) => {
    if (targetExams.includes(exam)) {
      setTargetExams(targetExams.filter(e => e !== exam));
    } else {
      setTargetExams([...targetExams, exam]);
    }
  };

  const examOptions = ["AIIMS", "ESIC", "DSSSB", "RRB", "NORCET", "State PSC"];

  // Helper to dynamically render Lucide Icons by name
  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const IconComponent = (LucideIcons as any)[iconName] || Award;
    return (
      <IconComponent
        className={`w-6 h-6 ${
          unlocked
            ? "text-yellow-500 fill-yellow-500/20"
            : "text-muted-foreground/40"
        }`}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header banner */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-xs text-muted-foreground">Manage your credentials, view badges, and track ranking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Credentials & Settings */}
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6 relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />

            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                {user.fullName[0]}
              </div>
              <h2 className="text-lg font-bold">{user.fullName}</h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                  Level {user.level} Student
                </span>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 rounded bg-accent/15 text-accent text-[10px] font-bold">
                    Admin Access
                  </span>
                )}
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-success/15 border border-success/30 text-success text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            {/* Editable Form */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-border bg-secondary/20 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium pl-6">{user.fullName}</p>
                )}
              </div>

              {/* College */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Building className="w-3.5 h-3.5" /> College
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    className="w-full px-3 py-1.5 border border-border bg-secondary/20 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium pl-6">{user.college}</p>
                )}
              </div>

              {/* Graduation Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5" /> Graduation Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={gradYear}
                    onChange={e => setGradYear(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-border bg-secondary/20 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-xs font-medium pl-6">{user.graduationYear}</p>
                )}
              </div>

              {/* Target Exams */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  Target Exams
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {examOptions.map(exam => {
                      const isChecked = targetExams.includes(exam);
                      return (
                        <button
                          type="button"
                          key={exam}
                          onClick={() => handleExamToggle(exam)}
                          className={`py-1 rounded text-[10px] font-semibold border transition-all ${
                            isChecked
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-secondary/10 border-border"
                          }`}
                        >
                          {exam}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 pl-6">
                    {user.targetExams.map(exam => (
                      <span key={exam} className="px-2 py-0.5 rounded bg-secondary text-foreground text-[9px] font-bold">
                        {exam}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit / Save controls */}
              <div className="pt-4 border-t border-border flex justify-end">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold flex items-center gap-1 hover:bg-primary-dark"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold flex items-center gap-1 hover:bg-primary/5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Badges & Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Badge grid */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Achievements & Badges
              </h3>
              <p className="text-[10px] text-muted-foreground">Complete goals, streaks, and tests to unlock awards</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockAchievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border text-center space-y-2 flex flex-col items-center justify-between transition-all ${
                    ach.unlocked
                      ? "bg-card border-border hover:shadow-md"
                      : "bg-secondary/25 border-dashed border-border/60 opacity-60"
                  }`}
                >
                  <div className={`p-2.5 rounded-full ${ach.unlocked ? "bg-yellow-500/10" : "bg-muted/10"}`}>
                    {renderBadgeIcon(ach.icon, ach.unlocked)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{ach.title}</h4>
                    <p className="text-[9px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-yellow-600 dark:text-yellow-400">
                    {ach.unlocked ? "✓ Unlocked" : `+${ach.xpReward} XP`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard comparisons */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Global Leaderboard Position
              </h3>
              <p className="text-[10px] text-muted-foreground">Top physiotherapists ranks based on total earned XP</p>
            </div>

            <div className="space-y-2">
              {mockLeaderboard.map(lead => {
                const isSelf = lead.isCurrentUser;
                return (
                  <div
                    key={lead.rank}
                    className={`p-3 rounded-lg border flex items-center justify-between text-sm transition-all ${
                      isSelf
                        ? "bg-primary/10 border-primary shadow-sm scale-[1.01]"
                        : "bg-secondary/15 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold text-xs ${
                        lead.rank === 1 ? "text-yellow-500 text-sm" : lead.rank === 2 ? "text-slate-400" : lead.rank === 3 ? "text-amber-600" : "text-muted-foreground"
                      }`}>
                        #{lead.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-xs flex items-center gap-1.5">
                          {lead.name}
                          {isSelf && <span className="px-1.5 py-0.5 rounded bg-primary text-white text-[8px] font-bold">You</span>}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{lead.college}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-bold text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-0.5 justify-end">
                          <Zap className="w-3.5 h-3.5 fill-yellow-500/20 text-yellow-500" />
                          {lead.xp} XP
                        </p>
                        <p className="text-[9px] text-muted-foreground">{lead.solvedCount} Solved</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
