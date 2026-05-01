"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { MOCK_WORKERS, DEMO_CUSTOMER } from "@/lib/mockData";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize persistence and Demo Mode check
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    
    // Check for Demo Session
    const savedDemoUser = localStorage.getItem("demo_user");
    if (savedDemoUser) {
      const parsed = JSON.parse(savedDemoUser);
      setUser({ uid: parsed.uid, email: parsed.email, isDemo: true });
      setProfile(parsed);
      setLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser?.uid) return null;
    if (firebaseUser.isDemo) return profile;

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }, [profile]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const userProfile = await fetchProfile(firebaseUser);
          if (userProfile) setProfile(userProfile);
        } else {
          // Only clear if NOT in demo mode
          if (!localStorage.getItem("demo_user")) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (err) {
        console.error("Auth listener error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  // Login
  const login = async (email, password) => {
    try {
      // 1. Check for Demo Credentials Locally
      if (email === "customer@demo.com") {
        const demoUser = DEMO_CUSTOMER;
        localStorage.setItem("demo_user", JSON.stringify(demoUser));
        setUser({ uid: demoUser.uid, email: demoUser.email, isDemo: true });
        setProfile(demoUser);
        
        // Sync with Firestore (Background/Graceful)
        setDoc(doc(db, "users", demoUser.uid), demoUser, { merge: true }).catch(err => {
          console.warn("Demo Customer sync failed (likely Firestore rules):", err);
        });

        toast.success("Welcome back, Demo Customer!");
        return "customer";
      }

      if (email === "worker@demo.com") {
        const demoWorker = MOCK_WORKERS[0];
        localStorage.setItem("demo_user", JSON.stringify(demoWorker));
        setUser({ uid: demoWorker.uid, email: demoWorker.email, isDemo: true });
        setProfile(demoWorker);

        // Sync with Firestore (Background/Graceful)
        const syncWorker = async () => {
          try {
            await setDoc(doc(db, "users", demoWorker.uid), demoWorker, { merge: true });
            await setDoc(doc(db, "workers", demoWorker.uid), demoWorker, { merge: true });
          } catch (err) {
            console.warn("Demo Worker sync failed (likely Firestore rules):", err);
          }
        };
        syncWorker();

        toast.success("Welcome back, Demo Worker!");
        return "worker";
      }

      // 2. Normal Firebase Login
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await fetchProfile(firebaseUser);
      
      if (!userProfile) {
        throw new Error("Profile not found.");
      }

      setUser(firebaseUser);
      setProfile(userProfile);
      toast.success(`Welcome back, ${userProfile.name || 'User'}!`);
      return userProfile.role;
    } catch (error) {
      const message = error.code === "auth/invalid-credential" 
        ? "Invalid email or password" 
        : error.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  // Signup
  const signup = async (email, password, name, role, phone = "") => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName: name });

      const userData = {
        uid: firebaseUser.uid,
        name,
        email,
        phone,
        role,
        photoURL: firebaseUser.photoURL || "",
        createdAt: new Date().toISOString(),
      };

      const writes = [setDoc(doc(db, "users", firebaseUser.uid), userData)];

      if (role === "worker") {
        const workerData = {
          ...userData,
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
        };
        writes.push(setDoc(doc(db, "workers", firebaseUser.uid), workerData));
      }

      await Promise.all(writes);

      await signOut(auth);
      setUser(null);
      setProfile(null);
      
      toast.success("Account Created! Now Login", {
        duration: 5000,
        icon: '✅',
      });
      return "login_required";
    } catch (error) {
      const msg = error.code === "auth/email-already-in-use" ? "Email already exists" : error.message;
      toast.error(msg);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async (preferredRole = null) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      let userProfile;
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        userProfile = userDoc.data();
      } else {
        const role = preferredRole || "customer";
        userProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          phone: firebaseUser.phoneNumber || "",
          role,
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", firebaseUser.uid), userProfile);

        if (role === "worker") {
          const workerData = { ...userProfile, skill: "", hourlyRate: 0, isVerified: false, rating: 0, reviewCount: 0, location: "", isOnline: false, bio: "", categories: [], portfolio: [], experience: 0, jobsCompleted: 0, totalEarnings: 0 };
          await setDoc(doc(db, "workers", firebaseUser.uid), workerData);
        }
      }

      setProfile(userProfile);
      setUser(firebaseUser);
      toast.success("Successfully signed in with Google!");
      return userProfile.role;
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Google sign-in failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("demo_user");
      await signOut(auth);
      setUser(null);
      setProfile(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const updateUserProfile = useCallback(async (data) => {
    if (!user?.uid) return;
    try {
      await setDoc(doc(db, "users", user.uid), data, { merge: true });
      setProfile((prev) => ({ ...prev, ...data }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isCustomer: profile?.role === "customer",
    isWorker: profile?.role === "worker",
    isAdmin: profile?.role === "admin",
    login,
    signup,
    googleSignIn,
    logout,
    updateUserProfile,
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
