import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Task, TASK_STATUSES, TaskStatus } from '@shared/models/task.model';

const STORAGE_KEY = 'angular-todo-board-tasks';

function sortWithinStatus(a: Task, b: Task): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

/** Rebuild flat list: columns in TASK_STATUSES order, tasks sorted by createdAt within each. */
function flattenColumns(tasks: Task[]): Task[] {
  return TASK_STATUSES.flatMap((status) =>
    tasks.filter((t) => t.status === status).sort(sortWithinStatus),
  );
}

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly document = inject(DOCUMENT);
  private readonly _tasks = signal<Task[]>(this.loadInitial());

  readonly tasks = this._tasks.asReadonly();

  readonly columns = computed(() => {
    const all = this._tasks();
    return TASK_STATUSES.map((status) => ({
      status,
      tasks: all.filter((t) => t.status === status).sort(sortWithinStatus),
    }));
  });

  readonly totalCount = computed(() => this._tasks().length);

  constructor() {
    effect(() => {
      const tasks = this._tasks();
      try {
        this.document.defaultView?.localStorage?.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        /* private mode / quota */
      }
    });
  }

  addTask(input: { title: string; description: string; status: TaskStatus }): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      createdAt: new Date().toISOString(),
    };
    this._tasks.update((list) => flattenColumns([...list, task]));
    return task;
  }

  /**
   * Move a task to a column at the given index (0-based within that column).
   * Works for same-column reorder and cross-column moves.
   */
  moveTask(taskId: string, newStatus: TaskStatus, targetIndex: number): void {
    this._tasks.update((list) => {
      const task = list.find((t) => t.id === taskId);
      if (!task) return list;

      const without = list.filter((t) => t.id !== taskId);
      const columnsSorted = TASK_STATUSES.map((status) =>
        without.filter((t) => t.status === status).sort(sortWithinStatus),
      );

      const si = TASK_STATUSES.indexOf(newStatus);
      const col = [...columnsSorted[si]];
      const moved: Task = { ...task, status: newStatus };
      const idx = Math.max(0, Math.min(targetIndex, col.length));
      col.splice(idx, 0, moved);
      columnsSorted[si] = col;

      return TASK_STATUSES.flatMap((_, i) => columnsSorted[i]);
    });
  }

  private loadInitial(): Task[] {
    try {
      const raw = this.document.defaultView?.localStorage?.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed as Task[];
    } catch {
      return [];
    }
  }
}
