import { MapPin } from 'lucide-react';

export default function LocationPicker({ onSelect }) {
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelect && onSelect(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => alert('Unable to retrieve location')
      );
    }
  };

  return (
    <button onClick={handleGetLocation} className="flex items-center gap-2 text-sm text-primary hover:underline">
      <MapPin className="w-4 h-4" />
      Use my current location
    </button>
  );
}