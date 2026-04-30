const categories = [
  { id: 'plumber', name: 'Plumber', nameUrdu: 'پلمبر', icon: '🔧' },
  { id: 'electrician', name: 'Electrician', nameUrdu: 'الیکٹریشن', icon: '⚡' },
  { id: 'carpenter', name: 'Carpenter', nameUrdu: 'بڑھئی', icon: '🪚' },
  { id: 'painter', name: 'Painter', nameUrdu: 'پینٹر', icon: '🎨' },
  { id: 'driver', name: 'Driver', nameUrdu: 'ڈرائیور', icon: '🚗' },
  { id: 'cleaner', name: 'Cleaner', nameUrdu: 'صفائی', icon: '🧹' },
  { id: 'cook', name: 'Cook', nameUrdu: 'باورچی', icon: '🍳' },
  { id: 'other', name: 'Other', nameUrdu: 'دیگر', icon: '🔧' },
];

export default function CategoryGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect && onSelect(cat)}
          className="glass-card p-4 text-center hover:shadow-lg transition-all hover:scale-105"
        >
          <div className="text-3xl mb-2">{cat.icon}</div>
          <h3 className="font-semibold text-sm">{cat.name}</h3>
          <p className="font-urdu text-xs text-primary">{cat.nameUrdu}</p>
        </button>
      ))}
    </div>
  );
}