import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { items, projects, users, tags, dumps } from '@/db/schema';

export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type User = InferSelectModel<typeof users>;
export type Tag = InferSelectModel<typeof tags>;
export type Dump = InferSelectModel<typeof dumps>;

export type ItemType = 'TASK' | 'NOTE' | 'EVENT' | 'REMINDER' | 'IDEA' | 'REFERENCE';
export type ItemStatus = 'INBOX' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
export type ItemPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';