import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'board' },
      {
        path: 'board',
        loadComponent: () => import('./features/board/board').then((m) => m.Board),
      },
      {
        path: 'tasks/new',
        loadComponent: () => import('./features/task-create/task-create').then((m) => m.TaskCreate),
      },
      {
        path: 'home',
        redirectTo: 'board',
        pathMatch: 'full',
      },
    ],
  },
];
