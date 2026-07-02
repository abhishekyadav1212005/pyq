"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { mockUserStats } from "@/lib/mockData";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  college: string;
  graduationYear: number;
  targetExams: string[];
  xp: number;
  level: number;
  streakCount: number;
  solvedCount: number;
  role: 'student' | 'admin';
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    fullName: string,
    college: string,
    graduationYear: number,
    targetExams: string[],
    password?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  incrementSolvedCount: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const defaultUser: UserProfile = {
  id: "u1_abhishek",
  email: "abhishek.yadav@svnirtar.edu",
  fullName: "Abhishek Yadav",
  college: "SVNIRTAR, Cuttack",
  graduationYear: 2027,
  targetExams: ["AIIMS", "ESIC", "DSSSB"],
  xp: mockUserStats.xp,
  level: mockUserStats.level,
  streakCount: mockUserStats.streak,
  solvedCount: mockUserStats.questionsCorrect,
  role: "student"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial registered users list seed
const seedRegisteredUsers = [
  {
    id: "admin_user",
    email: "abhishekyadav44998@gmail.com",
    fullName: "Abhishek Yadav",
    college: "National Institute",
    graduationYear: 2027,
    targetExams: ["AIIMS", "ESIC"],
    xp: 5000,
    level: 15,
    streakCount: 99,
    solvedCount: 120,
    role: "admin",
    password: "admin123"
  },
  {
    id: "admin_backup_user",
    email: "admin@physioprep.com",
    fullName: "Admin Officer",
    college: "National Institute",
    graduationYear: 2027,
    targetExams: ["AIIMS", "ESIC"],
    xp: 5000,
    level: 15,
    streakCount: 99,
    solvedCount: 120,
    role: "admin",
    password: "admin123"
  },
  {
    id: "u1_abhishek",
    email: "abhishek.yadav@svnirtar.edu",
    fullName: "Abhishek Yadav",
    college: "SVNIRTAR, Cuttack",
    graduationYear: 2027,
    targetExams: ["AIIMS", "ESIC", "DSSSB"],
    xp: mockUserStats.xp,
    level: mockUserStats.level,
    streakCount: mockUserStats.streak,
    solvedCount: mockUserStats.questionsCorrect,
    role: "student",
    password: "student123"
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Initialize registered users list if empty
      const storedUsers = localStorage.getItem("physioprep_registered_users");
      if (!storedUsers) {
        localStorage.setItem("physioprep_registered_users", JSON.stringify(seedRegisteredUsers));
      }

      // 2. Load active user session
      const storedSession = localStorage.getItem("physioprep_user");
      if (storedSession) {
        try {
          setUser(JSON.parse(storedSession));
        } catch {
          setUser(defaultUser);
        }
      } else {
        setUser(defaultUser);
        localStorage.setItem("physioprep_user", JSON.stringify(defaultUser));
      }
      setIsLoading(false);
    }
  }, []);

  const saveUser = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem("physioprep_user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("physioprep_user");
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const storedUsers = localStorage.getItem("physioprep_registered_users");
    const users = storedUsers ? JSON.parse(storedUsers) : seedRegisteredUsers;

    const matchedUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      throw new Error("Email address is not registered on this platform.");
    }

    if (matchedUser.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    // Map matched DB properties to UserProfile session
    const loggedInUser: UserProfile = {
      id: matchedUser.id,
      email: matchedUser.email,
      fullName: matchedUser.fullName,
      college: matchedUser.college,
      graduationYear: matchedUser.graduationYear,
      targetExams: matchedUser.targetExams,
      xp: matchedUser.xp,
      level: matchedUser.level,
      streakCount: matchedUser.streakCount,
      solvedCount: matchedUser.solvedCount,
      role: matchedUser.role
    };

    saveUser(loggedInUser);
    return true;
  };

  const signUp = async (
    email: string,
    fullName: string,
    college: string,
    graduationYear: number,
    targetExams: string[],
    password?: string
  ): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const storedUsers = localStorage.getItem("physioprep_registered_users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("This email is already registered.");
    }

    const isCustomAdmin = email.toLowerCase() === "abhishekyadav44998@gmail.com";
    const role = isCustomAdmin ? "admin" : "student";

    const newUserProfile: UserProfile = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      college,
      graduationYear,
      targetExams,
      xp: 100,
      level: 1,
      streakCount: 1,
      solvedCount: 0,
      role
    };

    // Save user with password credentials
    users.push({
      ...newUserProfile,
      password: password || "password123"
    });

    localStorage.setItem("physioprep_registered_users", JSON.stringify(users));
    saveUser(newUserProfile);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);

    // Sync changes to registered database
    const storedUsers = localStorage.getItem("physioprep_registered_users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem("physioprep_registered_users", JSON.stringify(users));
      }
    }
  };

  const addXP = (amount: number) => {
    if (!user) return;
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updated = {
      ...user,
      xp: newXP,
      level: newLevel > user.level ? newLevel : user.level
    };
    saveUser(updated);

    // Sync XP changes to database
    const storedUsers = localStorage.getItem("physioprep_registered_users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        users[idx].xp = updated.xp;
        users[idx].level = updated.level;
        localStorage.setItem("physioprep_registered_users", JSON.stringify(users));
      }
    }
  };

  const incrementStreak = () => {
    if (!user) return;
    const updated = { ...user, streakCount: user.streakCount + 1 };
    saveUser(updated);

    // Sync streak to database
    const storedUsers = localStorage.getItem("physioprep_registered_users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        users[idx].streakCount = updated.streakCount;
        localStorage.setItem("physioprep_registered_users", JSON.stringify(users));
      }
    }
  };

  const incrementSolvedCount = () => {
    if (!user) return;
    const updated = { ...user, solvedCount: user.solvedCount + 1 };
    saveUser(updated);

    // Sync solvedCount to database
    const storedUsers = localStorage.getItem("physioprep_registered_users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        users[idx].solvedCount = updated.solvedCount;
        localStorage.setItem("physioprep_registered_users", JSON.stringify(users));
      }
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const storedUsers = localStorage.getItem("physioprep_registered_users");
    if (!storedUsers) return false;

    const users = JSON.parse(storedUsers);
    const idx = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (idx === -1) {
      throw new Error("No registered account found with this email address.");
    }

    users[idx].password = newPassword;
    localStorage.setItem("physioprep_registered_users", JSON.stringify(users));

    // Update active session password if currently logged in user matches
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      saveUser({ ...user });
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        logout,
        updateProfile,
        addXP,
        incrementStreak,
        incrementSolvedCount,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
