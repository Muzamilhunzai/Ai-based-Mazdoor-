import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-slate-900 px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="urdu-text text-lg text-gray-500 mb-6">صفحہ نہیں ملا</p>
      <Link href="/" className="btn-primary flex items-center gap-2">
        <Home className="w-4 h-4" />
        Go Home
      </Link>
    </div>
  );
}