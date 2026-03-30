export type TaskStatus = 'todo' | 'inDevelopment' | 'review' | 'testing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export const TASK_STATUSES: readonly TaskStatus[] = [
  'todo',
  'inDevelopment',
  'review',
  'testing',
  'done',
] as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  inDevelopment: 'In development',
  review: 'Review',
  testing: 'Testing',
  done: 'Done',
};
