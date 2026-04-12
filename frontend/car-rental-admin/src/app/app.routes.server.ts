import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'cars',
    renderMode: RenderMode.Client,
  },
  {
    path: 'create-car',
    renderMode: RenderMode.Client,
  },
  {
    path: 'edit-car/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'contact',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users',
    renderMode: RenderMode.Client,
  },
  {
    path: 'create-user',
    renderMode: RenderMode.Client,
  },
  {
    path: 'update-user/:userID',
    renderMode: RenderMode.Client,
  },
  {
    path: 'users/:userID',
    renderMode: RenderMode.Client,
  },
  {
    path: 'bookings',
    renderMode: RenderMode.Client,
  },
];
