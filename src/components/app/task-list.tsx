import type { Task } from "@/lib/types";
import { TaskItem } from "./task-item";
import { ListTodo } from "lucide-react";
import { Button } from "../ui/button";

type TaskListProps = {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, ...props }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground p-8 gap-4">
        <ListTodo className="size-16" />
        <h2 className="text-2xl font-semibold">No Tasks Yet</h2>
        <p>Click "Add Task" to get started and organize your work.</p>
      </div>
    );
  }
  
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isComplete !== b.isComplete) {
      return a.isComplete ? 1 : -1;
    }
    if (a.priorityScore !== undefined && b.priorityScore !== undefined) {
      if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
    }
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 max-w-4xl mx-auto">
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} {...props} />
      ))}
    </div>
  );
}
