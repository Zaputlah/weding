import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./theme-catalog/theme-catalog').then((m) => m.ThemeCatalog),
  },
  {
    path: 'undangan',
    pathMatch: 'full',
    loadComponent: () =>
      import('./unavailable-page/unavailable-page').then((m) => m.UnavailablePage),
  },
  {
    path: 'undangan/:themeId/:customerSlug',
    loadComponent: () =>
      import('./customer-invitation-page/customer-invitation-page').then(
        (m) => m.CustomerInvitationPage,
      ),
  },
  {
    path: 'undangan/:themeId',
    loadComponent: () => import('./invitation/invitation').then((m) => m.Invitation),
  },
  {
    path: 'halaman-tidak-tersedia',
    loadComponent: () =>
      import('./unavailable-page/unavailable-page').then((m) => m.UnavailablePage),
  },
  { path: '**', redirectTo: 'halaman-tidak-tersedia' },
];
