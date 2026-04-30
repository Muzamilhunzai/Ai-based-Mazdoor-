export default function EmptyState({ icon, title, titleUrdu, description, descriptionUrdu, action }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-4">{icon || '📭'}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      {titleUrdu && <p className="font-urdu text-primary mb-3">{titleUrdu}</p>}
      {description && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{description}</p>}
      {descriptionUrdu && <p className="font-urdu text-sm text-gray-500">{descriptionUrdu}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}