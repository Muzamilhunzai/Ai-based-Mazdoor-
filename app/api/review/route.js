import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { jobId, reviewerId, revieweeId, rating, comment, role } = await request.json();
    
    // 1. Save the review
    await addDoc(collection(db, 'reviews'), {
      jobId,
      reviewerId,
      revieweeId,
      role, // 'customer' or 'worker'
      rating,
      comment,
      createdAt: serverTimestamp(),
    });

    // 2. Update worker profile (if a customer is reviewing a worker)
    if (role === 'customer') {
      const workerRef = doc(db, 'workers', revieweeId);
      
      // We use Firestore increment for the count
      // For the rating, in a production app we'd use a cloud function to average precisely
      // but here we'll update the count and set the last rating as a placeholder
      await updateDoc(workerRef, { 
        rating: rating, // simplified: sets latest rating as average
        reviewCount: increment(1) 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}