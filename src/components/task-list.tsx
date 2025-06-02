"use client";

import type { Task } from '@/types';
import TaskItem from './task-item';

interface TaskListProps {
  tasks: Task[];
  editingTask: { id: string; text: string } | null;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdateEditingText: (newText: string) => void;
}


export default function TaskList({
  tasks,
  editingTask,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUpdateEditingText,
}: TaskListProps) {
  if (tasks.length === 0) {
    return null; // Message handled by TaskManager
  }
  return (
    <ul className="space-y-3 list-none p-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingTask?.id === task.id}
          editingText={editingTask?.id === task.id ? editingTask.text : ''}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onStartEdit={onStartEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onUpdateEditingText={onUpdateEditingText}
        />
      ))}
    </ul>
  );
}
