"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

import { auth } from "@/lib/firebase";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: string;
  firebaseUid: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getUserFromFirebase = async (firebaseUser: FirebaseUser | null): Promise<AuthUser | null> => {
  if (!firebaseUser) return null;

  const token = await firebaseUser.getIdToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: firebaseUser.displayName ?? "Cravio user",
      email: firebaseUser.email,
      phone: firebaseUser.phoneNumber,
      avatar: firebaseUser.photoURL,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sync authenticated user.");
  }

  const data = await response.json();

  return {
    id: data.data.id,
    email: data.data.email,
    name: data.data.name,
    avatar: data.data.avatar,
    role: data.data.role,
    firebaseUid: data.data.firebaseUid,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncSession = async (nextFirebaseUser: FirebaseUser | null) => {
    if (!nextFirebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const syncedUser = await getUserFromFirebase(nextFirebaseUser);
      setUser(syncedUser ?? null);
    } catch (error) {
      console.error("Auth sync failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser);
      await syncSession(nextUser);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      loading,
      refreshSession: async () => {
        if (!auth || !firebaseUser) {
          setUser(null);
          return;
        }

        const refreshed = await getUserFromFirebase(firebaseUser);
        setUser(refreshed ?? null);
      },
    }),
    [firebaseUser, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
