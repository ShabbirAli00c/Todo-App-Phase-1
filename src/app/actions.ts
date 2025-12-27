'use server';

import { intelligentTaskPrioritization } from '@/ai/flows/intelligent-task-prioritization';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';

function formatTasksForAI(tasks: Task[]) {
  return tasks.map(task => ({
    title: task.title,
    description: task.description || '',
    dueDate: format(task.dueDate, 'yyyy-MM-dd'),
    complexity: task.complexity,
    isComplete: task.isComplete,
  }));
}

export async function prioritizeTasks(
  tasks: Task[]
): Promise<{ prioritizedTasks: Task[], reasoning: string } | { error: string }> {
  if (!tasks || tasks.length === 0) {
    return { error: 'No tasks to prioritize.' };
  }

  try {
    const aiInput = { tasks: formatTasksForAI(tasks) };
    const result = await intelligentTaskPrioritization(aiInput);

    const prioritizedTasks = result.prioritizedTasks.map(aiTask => {
      const originalTask = tasks.find(t => t.title === aiTask.title);
      if (!originalTask) {
        // This case should ideally not happen if the AI returns all tasks.
        // We will create a new task if it's not found, but this is a fallback.
        return {
          id: new Date().getTime().toString(), // fallback id
          title: aiTask.title,
          description: aiTask.description,
          dueDate: new Date(aiTask.dueDate),
          complexity: aiTask.complexity,
          isComplete: aiTask.isComplete,
          priorityScore: aiTask.priorityScore,
          reasoning: aiTask.reasoning,
        };
      }
      return {
        ...originalTask,
        dueDate: new Date(aiTask.dueDate),
        complexity: aiTask.complexity,
        isComplete: aiTask.isComplete,
        priorityScore: aiTask.priorityScore,
        reasoning: aiTask.reasoning,
      };
    });

    const generalReasoning = result.prioritizedTasks[0]?.reasoning || "Tasks have been prioritized by AI.";

    return { prioritizedTasks, reasoning: generalReasoning };
  } catch (error) {
    console.error('Error during AI task prioritization:', error);
    return { error: 'Failed to prioritize tasks using AI. Please try again later.' };
  }
}
