// app/api/seed/route.js
export const dynamic = "force-dynamic";
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { headers } from "next/headers";

const SKILLS = ["plumber", "electrician", "carpenter", "painter", "driver", "gardener", "cleaner", "cook", "barber", "tech_repair", "mechanic"];
const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Sialkot", "Gujranwala", "Quetta", "Murree", "Swat"];
const NAMES = [
  "Ahmad", "Ali", "Bilal", "Hamza", "Usman", "Umar", "Zaid", "Hassan", "Hussein", "Mustafa", 
  "Ibrahim", "Sajid", "Rashid", "Kamran", "Faisal", "Arsalan", "Waseem", "Naveed", "Asif", "Zubair", 
  "Imran", "Adnan", "Salman", "Rizwan", "Farhan", "Shahid", "Nasir", "Irfan", "Junaid", "Tariq",
  "Muzamil", "Hussain", "Kashif", "Sohail", "Riaz", "Saad", "Talha", "Haris", "Umair", "Babar"
];

export async function GET() {
  // 1. Force Next.js to treat this as dynamic so it doesn't run during build
  const headersList = headers();
  
  // 2. Extra safety: Return early if we detect a build environment
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !headersList.get('host')) {
    return Response.json({ message: "Seeding skipped during build" });
  }

  try {
    const batch = writeBatch(db);

    // 1. Create Demo Customer
    const customerId = "demo-customer-id"; // This should match MOCK_DATA and Auth
    const customerData = {
      uid: customerId,
      name: "Demo Customer",
      email: "customer@demo.com",
      role: "customer",
      phone: "03001234567",
      createdAt: new Date().toISOString(),
      location: "Lahore"
    };
    batch.set(doc(db, "users", customerId), customerData);

    // 2. Create Demo Worker
    const workerId = "demo-worker-id"; // This should match MOCK_DATA and Auth
    const workerUserData = {
      uid: workerId,
      name: "Demo Worker",
      email: "worker@demo.com",
      role: "worker",
      phone: "03007654321",
      createdAt: new Date().toISOString(),
      location: "Lahore"
    };
    const workerProfileData = {
      ...workerUserData,
      skill: "electrician",
      hourlyRate: 850,
      isVerified: true,
      rating: 4.9,
      reviewCount: 42,
      location: "Lahore",
      isOnline: true,
      bio: "Professional electrician with 12 years of experience. Expert in smart home wiring, UPS installation, and industrial electrical work. I guarantee high-quality service and safety.",
      experience: 12,
      jobsCompleted: 184,
      totalEarnings: 245000,
      categories: ["electrician", "tech_repair"]
    };
    batch.set(doc(db, "users", workerId), workerUserData);
    batch.set(doc(db, "workers", workerId), workerProfileData);

    // 3. Create 50 Random Workers
    for (let i = 0; i < 50; i++) {
      const id = `worker-seed-${i}`;
      const name = NAMES[i % NAMES.length] + " " + (i % 3 === 0 ? "Khan" : i % 3 === 1 ? "Sheikh" : "Ahmed");
      const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      
      const userData = {
        uid: id,
        name: name,
        email: `worker${i}@test.com`,
        role: "worker",
        phone: `0321${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: new Date().toISOString(),
        location: city,
      };

      const workerData = {
        ...userData,
        skill: skill,
        hourlyRate: Math.floor(Math.random() * 1200) + 300,
        isVerified: Math.random() > 0.2,
        rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 100),
        location: city,
        isOnline: Math.random() > 0.3,
        bio: `Expert ${skill} with ${Math.floor(Math.random() * 10) + 2} years of experience in ${city}. Available for immediate work.`,
        experience: Math.floor(Math.random() * 15) + 1,
        jobsCompleted: Math.floor(Math.random() * 150),
        totalEarnings: Math.floor(Math.random() * 100000),
        categories: [skill]
      };

      batch.set(doc(db, "users", id), userData);
      batch.set(doc(db, "workers", id), workerData);
    }

    await batch.commit();

    return Response.json({ 
      success: true, 
      message: "Database seeded with 50+ workers and 2 real demo accounts!",
      credentials: {
        customer: "customer@demo.com / password123",
        worker: "worker@demo.com / password123"
      },
      note: "Please ensure these accounts are created in Firebase Auth with 'password123' to use them as real accounts."
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

