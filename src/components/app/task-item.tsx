"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Trash2,
  Edit,
  Info,
  CalendarIcon,
  BarChart,
  BrainCircuit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const isOverdue = !task.isComplete && task.dueDate < new Date();

  const complexityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      task.isComplete && "bg-card/60"
    )}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isComplete}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1 size-5 border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          aria-label={`Mark ${task.title} as ${task.isComplete ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1 grid gap-1.5">
          <CardTitle className={cn("text-lg", task.isComplete && "line-through text-muted-foreground")}>
            {task.title}
          </CardTitle>
          {task.description && (
            <CardDescription className={cn(task.isComplete && "line-through text-muted-foreground/80")}>
              {task.description}
            </CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0 -mt-1 -mr-1">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {(task.reasoning || task.priorityScore !== undefined) && (
        <CardContent className="pl-[52px] pb-4 pt-0">
          {task.reasoning && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-2 text-xs p-3 rounded-md bg-accent/30 border border-dashed border-accent-foreground/20 cursor-help">
                    <Info className="size-4 flex-shrink-0 mt-0.5 text-accent-foreground/80" />
                    <p className="text-accent-foreground/80 italic line-clamp-2">{task.reasoning}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-accent text-accent-foreground border-accent-foreground/20" side="top">
                  <p>{task.reasoning}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardContent>
      )}
      <div className="pl-[52px] pb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="size-4" />
          <span className={cn(isOverdue && "text-destructive font-semibold")}>
            {format(task.dueDate, "MMM d, yyyy")}
            {isOverdue && " (Overdue)"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <BarChart className="size-4" />
          <Badge variant="outline" className={cn("capitalize border", complexityColors[task.complexity])}>{task.complexity}</Badge>
        </div>
        {task.priorityScore !== undefined && (
          <div className="flex items-center gap-1.5">
            <BrainCircuit className="size-4 text-primary" />
            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">Priority: {task.priorityScore}</Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
