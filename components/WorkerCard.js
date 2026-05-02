import { Star, MapPin, Clock, Shield, MessageSquare } from 'lucide-react';

export default function WorkerCard({ worker, onHire, onMessage }) {
  return (
    <div className="glass-card p-6 hover:shadow-lg transition-all group h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
            {worker.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h3 className="font-bold">{worker.name}</h3>
            <p className="text-sm text-gray-500">{worker.skill}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{worker.rating || 0}</span>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> {worker.location || 'Unknown'}</div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" /> Rs. {worker.hourlyRate}/hr</div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${worker.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          {worker.isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onHire(worker)} 
          className="btn-primary flex-1 text-sm py-2"
        >
          Hire
        </button>
        <button 
          onClick={() => onMessage?.(worker)}
          className="glass-card px-3 py-2 text-sm flex items-center gap-1 hover:bg-primary/5 transition"
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </button>
      </div>
    </div>
  );
}