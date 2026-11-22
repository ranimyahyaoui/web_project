import { Routes } from '@angular/router';
import { adminGuard, guestGuard, memberGuard } from './core/auth.guard';
import { PublicLayoutComponent } from './components/public-layout.component';

// Chaque page de l'arborescence (objectif 2) correspond à une route.
// Les pages sont chargées à la demande (loadComponent) pour alléger le premier affichage.
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'SC2 Connect',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'a-propos',
        title: 'À propos · SC2 Connect',
        loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'bureau',
        title: 'Bureau · SC2 Connect',
        loadComponent: () => import('./pages/board/board.component').then((m) => m.BoardComponent),
      },
      {
        path: 'activites',
        title: 'Activités · SC2 Connect',
        loadComponent: () =>
          import('./pages/activities/activities.component').then((m) => m.ActivitiesComponent),
      },
      {
        path: 'activites/:slug',
        title: 'Activité · SC2 Connect',
        loadComponent: () =>
          import('./pages/activity-detail/activity-detail.component').then(
            (m) => m.ActivityDetailComponent,
          ),
      },
      {
        path: 'calendrier',
        title: 'Calendrier · SC2 Connect',
        loadComponent: () =>
          import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'contact',
        title: 'Contact · SC2 Connect',
        loadComponent: () =>
          import('./pages/contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },
  {
    path: 'connexion',
    title: 'Connexion · SC2 Connect',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'membre',
    title: 'Espace membre · SC2 Connect',
    canActivate: [memberGuard],
    loadComponent: () =>
      import('./pages/member/member-dashboard.component').then((m) => m.MemberDashboardComponent),
  },
  {
    path: 'admin',
    title: 'Administration · SC2 Connect',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: '**',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'Page introuvable · SC2 Connect',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
