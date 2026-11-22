import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Ces gardes améliorent la navigation ; la vraie protection est faite par le
// serveur, qui vérifie le rôle à chaque requête.

/** Réservé aux utilisateurs connectés ; sinon, renvoi vers la connexion puis retour ici. */
export const memberGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.user()
    ? true
    : router.createUrlTree(['/connexion'], { queryParams: { retour: state.url } });
};

/** Réservé aux membres du bureau. */
export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  if (!auth.user())
    return router.createUrlTree(['/connexion'], { queryParams: { retour: state.url } });
  return auth.isAdmin() ? true : router.createUrlTree(['/membre']);
};

/** La page de connexion est inutile pour un utilisateur déjà connecté. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  const user = auth.user();
  return user ? router.createUrlTree([auth.homeFor(user)]) : true;
};
