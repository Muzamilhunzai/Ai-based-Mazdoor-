import WorkerCard from './WorkerCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function WorkerGrid({ workers = [], loading, error, onHire }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="glass-card h-64 animate-pulse" />)}
      </div>
    );
  }

  if (error) {
    return <EmptyState icon="⚠️" title="Error loading workers" titleUrdu="کارکنوں کی لوڈنگ میں خرابی" />;
  }

  if (workers.length === 0) {
    return <EmptyState icon="👷" title="No workers found" titleUrdu="کوئی مزدور نہیں ملا" description="Try adjusting your search" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workers.map(worker => (
        <WorkerCard key={worker.id || worker.uid} worker={worker} onHire={onHire} />
      ))}
    </div>
  );
}