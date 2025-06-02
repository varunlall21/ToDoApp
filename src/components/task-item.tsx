"use client";

import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePenLine, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editingText: string;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onUpdateEditingText: (newText: string) => void;
}

export default function TaskItem({
  task,
  isEditing,
  editingText,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onUpdateEditingText,
}: TaskItemProps) {
  
  if (isEditing) {
    return (
      <li className="flex items-center gap-2 p-3 bg-card/80 rounded-lg border border-primary/50 shadow-sm">
        <Input
          type="text"
          value={editingText}
          onChange={(e) => onUpdateEditingText(e.target.value)}
          className="flex-grow bg-background focus:ring-primary text-foreground placeholder:text-muted-foreground"
          autoFocus
          onKeyDown={(e) => { 
            if (e.key === 'Enter') {
              e.preventDefault();
              onSaveEdit();
            }
            if (e.key === 'Escape') onCancelEdit(); 
          }}
          aria-label="Edit task text"
        />
        <Button variant="ghost" size="icon" onClick={onSaveEdit} className="text-primary hover:bg-primary/10 hover:text-primary shrink-0" aria-label="Save changes">
          <CheckCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancelEdit} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0" aria-label="Cancel editing">
          <XCircle className="h-5 w-5" />
        </Button>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out group",
        task.completed ? "bg-secondary/50 opacity-60" : "bg-card hover:bg-secondary/30",
        "border border-border hover:border-primary/30 focus-within:border-primary/40" 
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleTask(task.id)}
        className={cn(
          "transition-all duration-200 ease-in-out peer shrink-0 rounded-[4px]", // Slightly rounded checkbox
          task.completed 
            ? "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary/50" 
            : "border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
        )}
        aria-labelledby={`task-label-${task.id}`}
      />
      <label
        htmlFor={`task-${task.id}`}
        id={`task-label-${task.id}`}
        className={cn(
          "flex-grow cursor-pointer text-sm sm:text-base break-all peer-focus-visible:ring-1 peer-focus-visible:ring-ring rounded-sm outline-none",
          task.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggleTask(task.id);}}
      >
        {task.text}
      </label>
      <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => onStartEdit(task)} className="text-muted-foreground hover:text-primary h-8 w-8 sm:h-9 sm:w-9" aria-label={`Edit task: ${task.text}`}>
          <FilePenLine className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-muted-foreground hover:text-destructive h-8 w-8 sm:h-9 sm:w-9" aria-label={`Delete task: ${task.text}`}>
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </li>
  );
}
