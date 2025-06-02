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
      <li className="flex items-center gap-2 p-3 bg-card-foreground/10 rounded-lg border border-primary/50 shadow-md">
        <Input
          type="text"
          value={editingText}
          onChange={(e) => onUpdateEditingText(e.target.value)}
          className="flex-grow bg-background focus:ring-accent text-foreground placeholder:text-muted-foreground"
          autoFocus
          onKeyDown={(e) => { 
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent form submission if wrapped in one
              onSaveEdit();
            }
            if (e.key === 'Escape') onCancelEdit(); 
          }}
          aria-label="Edit task text"
        />
        <Button variant="ghost" size="icon" onClick={onSaveEdit} className="text-accent hover:bg-accent/10 hover:text-accent-foreground shrink-0" aria-label="Save changes">
          <CheckCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancelEdit} className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground shrink-0" aria-label="Cancel editing">
          <XCircle className="h-5 w-5" />
        </Button>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ease-in-out group",
        task.completed ? "bg-accent/10 opacity-70" : "bg-card-foreground/5 hover:bg-card-foreground/10",
        "border border-transparent hover:border-primary/20 focus-within:border-primary/30" 
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleTask(task.id)}
        className={cn(
          "transition-all duration-200 ease-in-out peer shrink-0",
          task.completed 
            ? "data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground border-accent" 
            : "border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[state=checked]:border-accent"
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
        tabIndex={0} // Make label focusable to trigger group hover/focus for buttons if checkbox is focused
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggleTask(task.id);}}
      >
        {task.text}
      </label>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => onStartEdit(task)} className="text-muted-foreground hover:text-primary" aria-label={`Edit task: ${task.text}`}>
          <FilePenLine className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Delete task: ${task.text}`}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </li>
  );
}
