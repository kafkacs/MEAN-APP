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
  // {
  //   path: 'bookings',
  //   renderMode: RenderMode.Client,
  // },
  // {
  //   path: 'contact',
  //   renderMode: RenderMode.Client,
  // },
];
