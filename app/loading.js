import LoadingSpinner from '@/components/LoadingSpinner';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-900">
      <LoadingSpinner size="large" />
    </div>
  );
}