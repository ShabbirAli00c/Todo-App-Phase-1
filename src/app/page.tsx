"use client";

import { useState, useTransition, useEffect } from "react";
import { Header } from "@/components/app/header";
import { TaskList } from "@/components/app/task-list";
import { TaskForm } from "@/components/app/task-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Task } from "@/lib/types";
import type { z } from 'zod';
import type { taskSchema } from '@/components/app/task-form-schema';
import { useToast } from "@/hooks/use-toast";
import { prioritizeTasks } from "@/app/actions";

type TaskFormValues = z.infer<typeof taskSchema>;

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Set up project structure",
    description: "Initialize Next.js app, install dependencies, and set up folders.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    complexity: 'medium',
    isComplete: true,
  },
  {
    id: "2",
    title: "Design UI components",
    description: "Create reusable components for tasks, forms, and layout.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    complexity: 'high',
    isComplete: false,
  },
  {
    id: "3",
    title: "Implement state management",
    description: "Decide on and implement state management for the task list.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    complexity: 'medium',
    isComplete: false,
  },
];


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isPrioritizing, startPrioritizing] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load initial tasks on client to avoid hydration issues with dates
    setTasks(initialTasks);
  }, []);

  const handleOpenForm = (task: Task | null = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Delay resetting editingTask to allow dialog to animate out
    setTimeout(() => {
      setEditingTask(null);
    }, 200);
  };

  const handleSubmitForm = (values: TaskFormValues) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...values, priorityScore: undefined, reasoning: undefined } : task
      ));
      toast({ title: "Task Updated", description: `"${values.title}" has been updated.` });
    } else {
      // Add new task
      const newTask: Task = {
        id: new Date().getTime().toString(),
        ...values,
        isComplete: false,
      };
      setTasks([newTask, ...tasks]);
      toast({ title: "Task Created", description: `"${values.title}" has been added.` });
    }
    handleCloseForm();
  };
  
  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isComplete: !task.isComplete } : task
    ));
  };
  
  const handleOpenDeleteAlert = (id: string) => {
    setTaskToDelete(id);
    setIsAlertOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const task = tasks.find(t => t.id === taskToDelete);
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      toast({ title: "Task Deleted", description: `"${task?.title}" has been removed.`});
      setTaskToDelete(null);
      setIsAlertOpen(false);
    }
  };
  
  const handlePrioritize = () => {
    startPrioritizing(async () => {
      const incompleteTasks = tasks.filter(t => !t.isComplete);
      if (incompleteTasks.length < 2) {
          toast({
              title: "Not enough tasks",
              description: "You need at least two incomplete tasks to use Intelligent Prioritization.",
              variant: "destructive"
          });
          return;
      }

      const result = await prioritizeTasks(tasks);

      if ("error" in result) {
        toast({ title: "AI Error", description: result.error, variant: 'destructive' });
      } else {
        const updatedTasks = tasks.map(originalTask => {
          const prioritizedVersion = result.prioritizedTasks.find(p => p.id === originalTask.id);
          return prioritizedVersion || originalTask;
        });
        setTasks(updatedTasks);
        toast({
          title: "Tasks Prioritized!",
          description: result.reasoning
        });
      }
    });
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        onAddTask={() => handleOpenForm()} 
        onPrioritize={handlePrioritize}
        isPrioritizing={isPrioritizing}
        taskCount={tasks.length}
      />
      <main className="flex-1 overflow-y-auto">
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={(task) => handleOpenForm(task)}
          onDelete={handleOpenDeleteAlert}
        />
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add a new task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Make changes to your task here." : "Fill out the details for your new task."}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={handleSubmitForm}
            defaultValues={editingTask ? {
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
              complexity: editingTask.complexity,
            } : {
              dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
            }}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleConfirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
