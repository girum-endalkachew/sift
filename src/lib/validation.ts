import { z } from 'zod';

export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  content: z.string().optional().nullable(),
  type: z.enum(['TASK', 'NOTE', 'EVENT', 'REMINDER', 'IDEA', 'REFERENCE']).default('TASK'),
  status: z.enum(['INBOX', 'TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).default('INBOX'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export const updateItemSchema = createItemSchema.partial();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
