'use server';

/**
 * @fileOverview This file contains the Genkit flow for intelligent task prioritization.
 * It analyzes tasks and suggests a prioritization based on deadlines and task complexity.
 *
 * - intelligentTaskPrioritization - A function that handles the task prioritization process.
 * - IntelligentTaskPrioritizationInput - The input type for the intelligentTaskPrioritization function.
 * - IntelligentTaskPrioritizationOutput - The return type for the intelligentTaskPrioritization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTaskPrioritizationInputSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      description: z.string().describe('A detailed description of the task.'),
      dueDate: z.string().describe('The due date of the task in ISO format (YYYY-MM-DD).'),
      complexity: z
        .enum(['low', 'medium', 'high'])
        .describe('The complexity level of the task.'),
      isComplete: z.boolean().describe('Whether the task is complete or not.'),
    })
  ).describe('An array of tasks to be prioritized.'),
});
export type IntelligentTaskPrioritizationInput = z.infer<
  typeof IntelligentTaskPrioritizationInputSchema
>;

const IntelligentTaskPrioritizationOutputSchema = z.object({
  prioritizedTasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      description: z.string().describe('A detailed description of the task.'),
      dueDate: z.string().describe('The due date of the task in ISO format.'),
      complexity: z
        .enum(['low', 'medium', 'high'])
        .describe('The complexity level of the task.'),
      isComplete: z.boolean().describe('Whether the task is complete or not.'),
      priorityScore: z
        .number()
        .describe(
          'A numerical score indicating the priority of the task (higher is more important).'
        ),
      reasoning: z
        .string()
        .describe(
          'Explanation of why the task was prioritized as such, regarding the overall reasoning of the task scores.'
        ),
    })
  ).describe('An array of tasks, sorted by priority (highest priority first).'),
});
export type IntelligentTaskPrioritizationOutput = z.infer<
  typeof IntelligentTaskPrioritizationOutputSchema
>;

export async function intelligentTaskPrioritization(
  input: IntelligentTaskPrioritizationInput
): Promise<IntelligentTaskPrioritizationOutput> {
  return intelligentTaskPrioritizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentTaskPrioritizationPrompt',
  input: {schema: IntelligentTaskPrioritizationInputSchema},
  output: {schema: IntelligentTaskPrioritizationOutputSchema},
  prompt: `You are an AI task prioritization expert. Analyze the following tasks and provide a prioritized list based on their deadlines and complexity.  Tasks with earlier deadlines and higher complexity should be prioritized higher. Provide a priority score for each task, which is a numerical value indicating the importance of the task, relative to the other scores. List each score.

Tasks:
{{#each tasks}}
- Title: {{title}}
  Description: {{description}}
  Due Date: {{dueDate}}
  Complexity: {{complexity}}
  Complete: {{isComplete}}
{{/each}}

Prioritized Tasks (highest priority first):
`,
});

const intelligentTaskPrioritizationFlow = ai.defineFlow(
  {
    name: 'intelligentTaskPrioritizationFlow',
    inputSchema: IntelligentTaskPrioritizationInputSchema,
    outputSchema: IntelligentTaskPrioritizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
