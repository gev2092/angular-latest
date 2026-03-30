import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskStore } from '@core/services/task.store';
import { TASK_STATUSES, TASK_STATUS_LABELS, TaskStatus } from '@shared/models/task.model';

@Component({
  selector: 'app-task-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-create.html',
  styleUrl: './task-create.scss',
})
export class TaskCreate {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: [''],
    status: ['todo' as TaskStatus, Validators.required],
  });

  protected readonly statuses = TASK_STATUSES;
  protected readonly labels = TASK_STATUS_LABELS;

  protected submitted = false;

  protected onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.store.addTask(v);
    this.form.reset({
      title: '',
      description: '',
      status: 'todo',
    });
    this.submitted = false;
    void this.router.navigate(['/board']);
  }
}
