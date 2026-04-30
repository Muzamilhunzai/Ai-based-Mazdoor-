import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { jobId, reviewerId, revieweeId, rating, comment, role } = await request.json();
    await addDoc(collection(db, 'reviews'), {
      jobId,
      reviewerId,
      revieweeId,
      role, // 'customer' or 'worker'
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
    // Update worker or user rating
    if (role === 'customer') {
      const workerRef = doc(db, 'workers', revieweeId);
      // In a real app, recalculate average
      await updateDoc(workerRef, { rating: rating, reviewCount: admin.firestore.FieldValue.increment(1) });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}