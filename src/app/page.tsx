import TaskManager from '@/components/task-manager';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 lg:p-24 pt-8 sm:pt-12 md:pt-16 lg:pt-20">
      <TaskManager />
    </div>
  );
}
