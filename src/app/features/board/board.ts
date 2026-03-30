import { Component, inject } from '@angular/core';
import { TaskStore } from '@core/services/task.store';
import { TaskCard } from '@shared/components/task-card/task-card';
import { TASK_STATUS_LABELS, TaskStatus } from '@shared/models/task.model';

@Component({
  selector: 'app-board',
  imports: [TaskCard],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly store = inject(TaskStore);

  protected readonly columns = this.store.columns;
  protected readonly labels = TASK_STATUS_LABELS;
  protected readonly totalCount = this.store.totalCount;

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  protected onDropColumn(event: DragEvent, status: TaskStatus): void {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (!draggedId) return;
    const col = this.store.columns().find((c) => c.status === status)?.tasks ?? [];
    this.store.moveTask(draggedId, status, col.length);
  }

  protected onDroppedBefore(
    status: TaskStatus,
    event: { draggedId: string; beforeId: string },
  ): void {
    const { draggedId, beforeId } = event;
    const col = this.store.columns().find((c) => c.status === status)?.tasks ?? [];
    const index = col.findIndex((t) => t.id === beforeId);
    if (index === -1) return;
    this.store.moveTask(draggedId, status, index);
  }
}
