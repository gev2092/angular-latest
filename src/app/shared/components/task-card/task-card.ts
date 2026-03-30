import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Task } from '@shared/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  /** Signal-based inputs (Angular 17.1+). */
  task = input.required<Task>();

  droppedBefore = output<{ draggedId: string; beforeId: string }>();

  protected onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.task().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (!draggedId) return;
    const beforeId = this.task().id;
    if (draggedId === beforeId) return;
    this.droppedBefore.emit({ draggedId, beforeId });
  }
}
