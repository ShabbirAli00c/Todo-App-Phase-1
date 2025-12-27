import { Rocket } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Task Pilot Logo">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Rocket className="size-6 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-foreground tracking-tight">Task Pilot</h1>
    </div>
  );
}
