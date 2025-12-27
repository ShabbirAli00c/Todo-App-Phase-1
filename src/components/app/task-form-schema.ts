import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }).max(100, { message: "Title must be 100 characters or less." }),
  description: z.string().max(500, { message: "Description must be 500 characters or less." }).optional(),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  complexity: z.enum(['low', 'medium', 'high'], {
    required_error: "Complexity level is required."
  }),
});
