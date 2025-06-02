"use client";

import type { Task } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import AddTaskForm from './add-task-form';
import TaskList from './task-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<{ id: string; text: string } | null>(null);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      localStorage.removeItem('tasks');
    }
  }, []);

  useEffect(() => {
    if (isMounted) { 
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const handleAddTask = (text: string) => {
    if (text.trim() === '') {
      toast({
        title: "Empty Task",
        description: "Task text cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(), 
      text,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    toast({
      title: "Task Added",
      description: `"${text}" has been added.`,
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    if (taskToDelete) {
      toast({
        title: "Task Deleted",
        description: `"${taskToDelete.text}" removed.`,
        variant: "destructive"
      });
    }
  };

  const handleStartEdit = (taskToEdit: Task) => {
    setEditingTask({ id: taskToEdit.id, text: taskToEdit.text });
  };
  
  const handleUpdateEditingText = (newText: string) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, text: newText });
    }
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    if (editingTask.text.trim() === '') {
      toast({ title: "Empty Task", description: "Task text cannot be empty.", variant: "destructive" });
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id ? { ...task, text: editingTask.text.trim() } : task
      )
    );
    setEditingTask(null);
    toast({ title: "Task Updated", description: "Task successfully updated." });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const totalTasksCount = tasks.length;
  const progressPercentage = useMemo(() => totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0, [completedTasksCount, totalTasksCount]);

  if (!isMounted) {
    return (
        <Card className="w-full max-w-2xl shadow-lg bg-card animate-pulse">
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-headline tracking-tight h-10 bg-muted-foreground/20 rounded"></CardTitle>
                <CardDescription className="text-muted-foreground mt-2 h-6 bg-muted-foreground/20 rounded"></CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex gap-2 mb-6">
                    <div className="h-10 flex-grow bg-muted-foreground/20 rounded"></div>
                    <div className="h-10 w-28 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="my-6">
                    <div className="flex justify-between items-center mb-2 h-4 bg-muted-foreground/20 rounded w-1/3"></div>
                    <div className="h-2 bg-muted-foreground/20 rounded w-full"></div>
                 </div>
                 <div className="space-y-3">
                    <div className="h-12 bg-muted-foreground/10 rounded-lg"></div>
                    <div className="h-12 bg-muted-foreground/10 rounded-lg"></div>
                    <div className="h-12 bg-muted-foreground/10 rounded-lg"></div>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg bg-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl sm:text-4xl font-semibold tracking-tight">TaskFlow</CardTitle>
        <CardDescription className="text-muted-foreground mt-2 text-sm sm:text-base">
          Your personal task management hub. Stay organized, stay focused.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <AddTaskForm onAddTask={handleAddTask} />
        
        {totalTasksCount > 0 && (
          <div className="my-4 sm:my-6">
            <div className="flex justify-between items-center mb-2 text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium">Progress</span>
              <span>{completedTasksCount} / {totalTasksCount} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2 [&>div]:bg-primary" aria-label={`Task progress: ${completedTasksCount} of ${totalTasksCount} completed`} />
          </div>
        )}

        <TaskList
          tasks={tasks}
          editingTask={editingTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onUpdateEditingText={handleUpdateEditingText}
        />
        {tasks.length === 0 && (
           <p className="text-center text-muted-foreground mt-8 py-4 border-2 border-dashed border-border/50 rounded-lg text-sm sm:text-base">
             No tasks yet. Add one above to get started!
           </p>
        )}
      </CardContent>
    </Card>
  );
}
