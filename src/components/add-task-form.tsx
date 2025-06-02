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
    onAddTask(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow bg-input/80 focus:bg-input placeholder:text-muted-foreground/80"
        aria-label="New task description"
      />
      <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
        <PlusCircle className="mr-0 sm:mr-2 h-5 w-5" /> <span className="hidden sm:inline">Add Task</span>
      </Button>
    </form>
  );
}
