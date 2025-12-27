"use client";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

type HeaderProps = {
  onAddTask: () => void;
  onPrioritize: () => void;
  isPrioritizing: boolean;
  taskCount: number;
};

export function Header({ onAddTask, onPrioritize, isPrioritizing, taskCount }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <Logo />
      <div className="flex items-center gap-2">
        <Button onClick={onPrioritize} disabled={isPrioritizing || taskCount < 2} variant="outline">
          <Sparkles className={`mr-2 h-4 w-4 ${isPrioritizing ? "animate-spin" : ""}`} />
          {isPrioritizing ? "Thinking..." : "Prioritize with AI"}
        </Button>
        <Button onClick={onAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </header>
  );
}
