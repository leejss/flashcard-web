import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-20">
      <div className="flex justify-center mb-4">
        <div className="rounded-full border-2 border-gray-300 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
