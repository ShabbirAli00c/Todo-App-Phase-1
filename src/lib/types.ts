export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  complexity: 'low' | 'medium' | 'high';
  isComplete: boolean;
  priorityScore?: number;
  reasoning?: string;
};
