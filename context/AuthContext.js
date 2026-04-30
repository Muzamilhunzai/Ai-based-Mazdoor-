// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Helper: fetch profile with fallback
  const fetchProfile = async (firebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) return userDoc.data();

      // Create default profile
      const defaultProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email,
        role: "customer",
        phone: firebaseUser.phoneNumber || "",
        photoURL: firebaseUser.photoURL || "",
        createdAt: serverTimestamp(),
      };
      try { await setDoc(doc(db, "users", firebaseUser.uid), defaultProfile); } catch (e) {}
      return defaultProfile;
    } catch {
      return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email,
        role: "customer",
        phone: firebaseUser.phoneNumber || "",
        photoURL: firebaseUser.photoURL || "",
      };
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const prof = await fetchProfile(firebaseUser);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // ──────────────────────────────────────────────────────
  //  LOGIN
  // ──────────────────────────────────────────────────────
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const prof = await fetchProfile(cred.user);
    setProfile(prof);
    toast.success("Welcome back!");
    return prof.role;
  };

  // ──────────────────────────────────────────────────────
  //  SIGNUP – returns role so caller can redirect
  // ──────────────────────────────────────────────────────
  const signup = async (email, password, name, role, phone = "") => {
    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    // 2. Build user data
    const userData = {
      uid: cred.user.uid,
      name,
      email,
      phone,
      role,
      photoURL: cred.user.photoURL || "",
      createdAt: serverTimestamp(),
    };

    // 3. Save to Firestore (best‑effort)
    try {
      await setDoc(doc(db, "users", cred.user.uid), userData);
    } catch (e) {
      toast.error("Could not save profile – you can update later.");
    }

    // 4. If worker, create worker doc (best‑effort)
    if (role === "worker") {
      try {
        await setDoc(doc(db, "workers", cred.user.uid), {
          uid: cred.user.uid,
          skill: "",
          hourlyRate: 0,
          isVerified: false,
          rating: 0,
          reviewCount: 0,
          location: "",
          isOnline: false,
          bio: "",
          categories: [],
          portfolio: [],
          experience: 0,
          jobsCompleted: 0,
          totalEarnings: 0,
          createdAt: serverTimestamp(),
        });
      } catch (e) {}
    }

    // 5. Set local state immediately → dashboard picks it up
    setProfile(userData);
    toast.success("Account created!");
    return role;          // ← caller uses this to redirect
  };

  // ──────────────────────────────────────────────────────
  //  GOOGLE SIGN‑IN (popup for simplicity)
  // ──────────────────────────────────────────────────────
  const googleSignIn = async (signupRole = null) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user already exists in Firestore
    let prof;
    try {
      const snap = await getDoc(doc(db, "users", result.user.uid));
      if (snap.exists()) {
        prof = snap.data();
      } else {
        // New Google user – use signupRole if provided, else default to customer
        const role = signupRole || "customer";
        prof = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          phone: result.user.phoneNumber || "",
          role,
          photoURL: result.user.photoURL || "",
          createdAt: serverTimestamp(),
        };
        try { await setDoc(doc(db, "users", result.user.uid), prof); } catch (e) {}
        if (role === "worker") {
          try {
            await setDoc(doc(db, "workers", result.user.uid), {
              uid: result.user.uid,
              skill: "",
              hourlyRate: 0,
              isVerified: false,
              rating: 0,
              reviewCount: 0,
              location: "",
              isOnline: false,
              bio: "",
              categories: [],
              portfolio: [],
              experience: 0,
              jobsCompleted: 0,
              totalEarnings: 0,
              createdAt: serverTimestamp(),
            });
          } catch (e) {}
        }
      }
    } catch {
      prof = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        role: signupRole || "customer",
        phone: result.user.phoneNumber || "",
        photoURL: result.user.photoURL || "",
      };
    }

    setProfile(prof);
    toast.success("Welcome!");
    return prof.role;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    toast.success("Logged out");
  };

  const updateUserProfile = useCallback(async (data) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { ...profile, ...data }, { merge: true });
      setProfile(prev => ({ ...prev, ...data }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    }
  }, [user, profile]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      authReady,
      login,
      signup,
      googleSignIn,
      logout,
      updateUserProfile,
      isAuthenticated: !!user,
      isCustomer: profile?.role === "customer",
      isWorker: profile?.role === "worker",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};