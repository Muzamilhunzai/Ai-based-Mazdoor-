'use client';

import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-slate-900 px-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="urdu-text text-lg text-gray-500 mb-6">کچھ غلط ہو گیا</p>
      <button onClick={reset} className="btn-primary flex items-center gap-2">
        <RefreshCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}