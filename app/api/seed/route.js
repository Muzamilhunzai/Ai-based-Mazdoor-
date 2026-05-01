// app/api/seed/route.js
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";

const SKILLS = ["plumber", "electrician", "carpenter", "painter", "driver", "gardener", "cleaner", "cook", "barber", "tech_repair", "mechanic"];
const CITIES = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Sialkot", "Gujranwala", "Quetta"];
const NAMES = ["Ahmad", "Ali", "Bilal", "Hamza", "Usman", "Umar", "Zaid", "Hassan", "Hussein", "Mustafa", "Ibrahim", "Sajid", "Rashid", "Kamran", "Faisal", "Arsalan", "Waseem", "Naveed", "Asif", "Zubair", "Imran", "Adnan", "Salman", "Rizwan", "Farhan", "Shahid", "Nasir", "Irfan", "Junaid", "Tariq"];

export async function GET() {
  try {
    const batch = writeBatch(db);

    // 1. Create Demo Customer
    const customerId = "demo-customer-id";
    const customerData = {
      uid: customerId,
      name: "Demo Customer",
      email: "customer@demo.com",
      role: "customer",
      phone: "03001234567",
      createdAt: new Date().toISOString(),
    };
    batch.set(doc(db, "users", customerId), customerData);

    // 2. Create Demo Worker
    const workerId = "demo-worker-id";
    const workerUserData = {
      uid: workerId,
      name: "Demo Worker",
      email: "worker@demo.com",
      role: "worker",
      phone: "03007654321",
      createdAt: new Date().toISOString(),
    };
    const workerProfileData = {
      ...workerUserData,
      skill: "electrician",
      hourlyRate: 800,
      isVerified: true,
      rating: 4.8,
      reviewCount: 25,
      location: "Lahore",
      isOnline: true,
      bio: "Professional electrician with 10 years of experience in house wiring and appliance repair.",
      experience: 10,
      jobsCompleted: 150,
      totalEarnings: 120000,
    };
    batch.set(doc(db, "users", workerId), workerUserData);
    batch.set(doc(db, "workers", workerId), workerProfileData);

    // 3. Create 30 Random Workers
    for (let i = 0; i < 35; i++) {
      const id = `worker-seed-${i}`;
      const name = NAMES[i % NAMES.length] + " " + (i > 25 ? "Khan" : "Sheikh");
      const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      
      const userData = {
        uid: id,
        name: name,
        email: `worker${i}@test.com`,
        role: "worker",
        phone: `0321${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: new Date().toISOString(),
      };

      const workerData = {
        ...userData,
        skill: skill,
        hourlyRate: Math.floor(Math.random() * 1000) + 300,
        isVerified: Math.random() > 0.3,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 50),
        location: city,
        isOnline: Math.random() > 0.4,
        bio: `Expert ${skill} available in ${city}. High quality work guaranteed.`,
        experience: Math.floor(Math.random() * 15) + 1,
        jobsCompleted: Math.floor(Math.random() * 100),
        totalEarnings: Math.floor(Math.random() * 50000),
      };

      batch.set(doc(db, "users", id), userData);
      batch.set(doc(db, "workers", id), workerData);
    }

    await batch.commit();

    return Response.json({ 
      success: true, 
      message: "Database seeded with 35 workers and 2 demo accounts!",
      credentials: {
        customer: "customer@demo.com / password123",
        worker: "worker@demo.com / password123"
      }
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
