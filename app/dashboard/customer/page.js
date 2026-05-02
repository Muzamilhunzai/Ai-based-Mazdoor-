"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import WorkerGrid from "@/components/WorkerGrid";
import HireModal from "@/components/HireModal";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  MapPin,
  Bell,
  Languages,
  User,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

import SOSButton from "@/components/SOSButton";
import VoiceAssistant from "@/components/VoiceAssistant";

import WorkerCard from "@/components/WorkerCard";
import ChatModal from "@/components/ChatModal";
import { db } from "@/lib/firebase";
import { collection, query, where, limit, getDocs, orderBy, getDoc, doc } from "firebase/firestore";
import { MOCK_WORKERS } from "@/lib/mockData";

export default function CustomerDashboard() {
  const { user, profile } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatJob, setActiveChatJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [source, setSource] = useState(null);
  const [city, setCity] = useState(profile?.location || "Lahore");

  // Fetch featured workers
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // 1. Try to fetch verified workers from Firestore
        const qVerified = query(
          collection(db, "workers"),
          where("isVerified", "==", true),
          limit(6)
        );
        const snapshot = await getDocs(qVerified);
        let fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 2. If no verified workers, try any workers from Firestore
        if (fetched.length === 0) {
          const qAny = query(collection(db, "workers"), limit(6));
          const anySnapshot = await getDocs(qAny);
          fetched = anySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // 3. MANDATORY: Ensure Demo Worker is included
        const demoWorkerId = "demo-worker-id";
        const hasDemo = fetched.find(w => w.id === demoWorkerId || w.uid === demoWorkerId);
        
        if (!hasDemo) {
          // Try fetching specifically from Firestore
          try {
            const demoDoc = await getDoc(doc(db, "workers", demoWorkerId));
            if (demoDoc.exists()) {
              fetched = [{ id: demoDoc.id, ...demoDoc.data() }, ...fetched];
            } else {
              // Fallback to Mock Data if Firestore is empty or missing the demo worker
              const mockDemo = { ...MOCK_WORKERS[0], id: MOCK_WORKERS[0].uid };
              fetched = [mockDemo, ...fetched];
              console.log("Using Mock Demo Worker as fallback");
            }
          } catch (e) {
            const mockDemo = { ...MOCK_WORKERS[0], id: MOCK_WORKERS[0].uid };
            fetched = [mockDemo, ...fetched];
          }
        }

        setFeaturedWorkers(fetched);
      } catch (err) {
        console.error("Error fetching featured workers:", err);
        // Absolute fallback to mock data if everything fails
        setFeaturedWorkers([{ ...MOCK_WORKERS[0], id: MOCK_WORKERS[0].uid }]);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = useCallback(
    async (queryInput) => {
      if (!queryInput?.trim()) return;
      setLoading(true);
      setSearchQuery(queryInput);
      setWorkers([]);
      setSource(null);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: queryInput }),
        });
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error || "AI Search failed");

        setWorkers(data.workers || []);
        setSource(data.source || "ai");
        
        if (data.workers?.length === 0) {
           toast.error("No workers found for your request.");
        } else {
           toast.success(`Found ${data.workers.length} matches!`);
        }
      } catch (apiErr) {
        console.warn("AI search failed:", apiErr.message);
        setWorkers([]);
        toast.error("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCategorySelect = (category) => {
    handleSearch(category.name);
  };

  const handleHire = (worker) => {
    setSelectedWorker(worker);
    setShowHireModal(true);
  };

  const handleMessage = (worker) => {
    if (!user) {
      toast.error("Please login to message a worker");
      return;
    }
    // Create a virtual job object for chat
    const virtualJob = {
      id: `chat_${user.uid}_${worker.id || worker.uid}`,
      workerId: worker.id || worker.uid,
      workerName: worker.name,
      customerId: user.uid,
      customerName: profile?.name || "Customer",
    };
    setActiveChatJob(virtualJob);
    setShowChatModal(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 min-h-screen pb-20 md:pb-0">
      {/* Voice and SOS */}
      <VoiceAssistant onResult={(text) => handleSearch(text)} />
      <SOSButton />

      {/* Top Navigation */}
      <nav className="flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black text-primary tracking-tight">
            Mazdoor<span className="text-secondary">Market</span>
          </span>
          <button
            onClick={() => setCity("Lahore")}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-sm font-medium"
          >
            <MapPin className="w-4 h-4 text-primary" />
            {city}
            <ChevronRight className="w-4 h-4 text-outline" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition">
            <Languages className="w-5 h-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
            {profile?.name?.[0] || <User className="w-4 h-4" />}
          </div>
        </div>
      </nav>

      {/* Hero Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          Assalam-o-Alaikum
          {profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}{" "}
          <span className="inline-block animate-waving-hand">👋</span>
        </h1>
        <p className="font-urdu text-xl text-primary mt-1">
          آج ہم آپ کی کیا خدمت کر سکتے ہیں؟
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="glass-card mx-6 p-4">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Dynamic content: search results or browsing */}
      <AnimatePresence mode="wait">
        {searchQuery ? (
          <motion.section
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Top matches for &quot;{searchQuery}&quot;
              </h2>
              {source && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {source === "ai" ? "AI matched" : "Smart match"}
                </span>
              )}
            </div>

            {loading ? (
              <LoadingSpinner label="Finding the best Mazdoors for you…" />
            ) : workers.length > 0 ? (
              <WorkerGrid 
                workers={workers} 
                onHire={handleHire} 
                onMessage={handleMessage} 
              />
            ) : (
              <EmptyState
                icon="search-off"
                title="No matches found"
                description="Try a different search — e.g. 'plumber Gulberg' or 'electrician near me'."
              />
            )}
          </motion.section>
        ) : (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 px-6"
          >
            {/* Categories */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Browse categories</h2>
                <span className="font-urdu text-primary text-lg">زمرے</span>
              </div>
              <CategoryGrid onSelect={handleCategorySelect} />
            </section>

            {/* Featured Workers */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Featured workers
                </h2>
                <span className="font-urdu text-primary text-lg">نمایاں مزدور</span>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                {loadingFeatured ? (
                  [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-[280px] shrink-0 h-64 bg-surface-container-low rounded-xl animate-pulse"
                    />
                  ))
                ) : featuredWorkers.length > 0 ? (
                  featuredWorkers.map((worker) => (
                    <div key={worker.id || worker.uid} className="w-[300px] shrink-0">
                      <WorkerCard 
                        worker={worker} 
                        onHire={() => handleHire(worker)} 
                        onMessage={() => handleMessage(worker)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-outline text-sm py-4">No featured workers found.</p>
                )}
              </div>
            </section>

            {/* Trust Banner */}
            <div className="glass-card p-5 md:p-6 flex flex-col md:flex-row items-center gap-4 bg-primary/5">
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">100% CNIC Verified Workers</h3>
                <p className="text-sm text-on-surface-variant">
                  Every professional on Mazdoor Market is verified for your safety
                  and peace of mind.
                </p>
              </div>
              <button className="ml-auto px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-container transition hidden md:block">
                Learn more
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hire Modal */}
      <HireModal
        worker={selectedWorker}
        isOpen={showHireModal}
        onClose={() => setShowHireModal(false)}
      />

      {/* Chat Modal */}
      {showChatModal && (
        <ChatModal
          job={activeChatJob}
          senderId={user?.uid}
          senderName={profile?.name || "Customer"}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}