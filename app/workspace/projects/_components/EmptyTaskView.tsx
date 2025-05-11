'use client';

export default function EmptyTasksView() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img src="/empty-tasks.svg" alt="No tasks found" className="w-64 h-64 mb-4" />
      <h2 className="text-center text-2xl font-semibold text-gray-700">
        No tasks found
      </h2>
      <p className="text-center text-gray-500 mt-2">
        Start by adding your first task to this project
      </p>
    </div>
  );
}