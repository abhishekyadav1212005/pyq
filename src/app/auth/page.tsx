"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, GraduationCap, Building, ClipboardList, ShieldAlert, Check } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [gradYear, setGradYear] = useState<number>(2026);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password reset states
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const examOptions = ["AIIMS", "ESIC", "DSSSB", "RRB", "NORCET", "State PSC"];

  // Parse reset parameters from URL on load without Suspense warnings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeVal = params.get("mode");
      const tokenVal = params.get("token");

      if (modeVal === "reset" && tokenVal) {
        try {
          const decodedPayload = JSON.parse(atob(tokenVal));
          if (decodedPayload.expires < Date.now()) {
            setErrorMsg("Your password reset link has expired. Please request a new one.");
            setMode("forgot");
          } else {
            setMode("reset");
            setResetEmail(decodedPayload.email);
          }
        } catch (e) {
          setErrorMsg("The password reset token is invalid.");
          setMode("signin");
        }
      }
    }
  }, []);

  const handleExamToggle = (exam: string) => {
    if (selectedExams.includes(exam)) {
      setSelectedExams(selectedExams.filter((e: string) => e !== exam));
    } else {
      setSelectedExams([...selectedExams, exam]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        if (!email || !password) {
          setErrorMsg("Please fill in all fields.");
          setIsSubmitting(false);
          return;
        }
        await signIn(email, password);
        router.push("/dashboard");
      } else if (mode === "signup") {
        if (!email || !fullName || !college || selectedExams.length === 0 || !password) {
          setErrorMsg("Please complete all details and define a password.");
          setIsSubmitting(false);
          return;
        }
        await signUp(email, fullName, college, gradYear, selectedExams, password);
        router.push("/dashboard");
      } else if (mode === "forgot") {
        if (!email) {
          setErrorMsg("Please enter your email.");
          setIsSubmitting(false);
          return;
        }

        // Call our API route to dispatch reset email
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          setErrorMsg(data.error || "Failed to dispatch reset link.");
        } else {
          setInfoMsg(data.message);
        }
        setIsSubmitting(false);
      } else if (mode === "reset") {
        if (!newPassword || !confirmNewPassword) {
          setErrorMsg("Please enter and confirm your new password.");
          setIsSubmitting(false);
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setErrorMsg("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }
        if (newPassword.length < 6) {
          setErrorMsg("Password must be at least 6 characters long.");
          setIsSubmitting(false);
          return;
        }

        await resetPassword(resetEmail, newPassword);
        setInfoMsg("Your password has been updated! You can now log in using your new credentials.");
        
        // Clean address bar query parameters
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        setMode("signin");
        setEmail(resetEmail);
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "An authentication error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(screen-80px)] py-12 px-6 flex items-center justify-center bg-background relative overflow-hidden">
      {/* Glow balls */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-[80px] -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/10 blur-[100px] -z-10" />

      <motion.div
        layout
        className="w-full max-w-lg border border-border glass-card p-6 md:p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {mode === "signin"
              ? "Welcome Back"
              : mode === "signup"
              ? "Create Account"
              : mode === "reset"
              ? "Set New Password"
              : "Reset Password"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your physiotherapy preparation boards"
              : mode === "signup"
              ? "Start training with personalized study goals and streaks"
              : mode === "reset"
              ? `Update password credentials for ${resetEmail}`
              : "We will send you instructions to recover your password"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-success text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-1">
                <label className="text-xs font-semibold">Physiotherapy College</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. SVNIRTAR, Cuttack"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              {/* Graduation Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Graduation Year</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      required
                      min={2015}
                      max={2035}
                      value={gradYear}
                      onChange={e => setGradYear(parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Account Role</label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      onChange={e => {
                        if (e.target.value === "admin") {
                          setEmail("abhishekyadav44998@gmail.com");
                        } else {
                          setEmail("");
                        }
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin Mock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Exams */}
              <div className="space-y-2">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Target Recruitment Exams
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {examOptions.map(exam => {
                    const isChecked = selectedExams.includes(exam);
                    return (
                      <button
                        type="button"
                        key={exam}
                        onClick={() => handleExamToggle(exam)}
                        className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                          isChecked
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-secondary/25 border-border hover:bg-secondary"
                        }`}
                      >
                        {exam}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Email input (hidden in reset mode) */}
          {mode !== "reset" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
          )}

          {/* Password Input (Sign In / Sign Up) */}
          {mode !== "forgot" && mode !== "reset" && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </div>
          )}

          {/* New Password Input (Reset Mode) */}
          {mode === "reset" && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 btn-duo-primary"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "reset" ? (
              "Save New Password"
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* Mode Toggles */}
        <div className="border-t border-border pt-4 text-center text-xs space-y-2">
          {mode === "signin" ? (
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-primary hover:underline font-bold">
                Sign Up
              </button>
            </p>
          ) : mode === "reset" ? (
            <button onClick={() => setMode("signin")} className="text-primary hover:underline font-bold block mx-auto">
              Back to Sign In
            </button>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-primary hover:underline font-bold">
                Sign In
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button onClick={() => setMode("signin")} className="text-primary hover:underline font-bold block mx-auto">
              Back to login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
