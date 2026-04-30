export default function WorkerPortfolio({ images = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, i) => (
        <div key={i} className="aspect-square rounded-xl bg-gray-200 dark:bg-slate-700 overflow-hidden">
          <img src={img} alt={`Work ${i+1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      {images.length === 0 && <p className="col-span-3 text-sm text-gray-500 text-center">No portfolio images</p>}
    </div>
  );
}