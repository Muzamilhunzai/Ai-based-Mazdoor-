export default function LoadingSpinner({ size = 'medium' }) {
  const dimensions = { small: 'w-4 h-4', medium: 'w-8 h-8', large: 'w-12 h-12' };
  return (
    <div className="flex justify-center items-center">
      <div className={`${dimensions[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}