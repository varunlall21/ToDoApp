"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (text: string) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow bg-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
        aria-label="New task description"
      />
      <Button type="submit" variant="default" className="shrink-0">
        <PlusCircle className="mr-0 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> <span className="hidden sm:inline">Add Task</span>
      </Button>
    </form>
  );
}
