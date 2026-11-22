import { DestroyRef, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiError } from './models';

/**
 * Charge des données depuis l'API et expose les trois états d'un écran sous
 * forme de signaux : chargement, erreur, données. `load()` lance ou relance la requête.
 * À créer dans un constructeur ou un initialiseur de propriété.
 *
 *   readonly board = createLoader(() => this.api.board());
 */
export function createLoader<T>(source: () => Observable<T>) {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal<ApiError | null>(null);
  let subscription: Subscription | undefined;

  // La requête en cours est abandonnée quand le composant disparaît.
  inject(DestroyRef).onDestroy(() => subscription?.unsubscribe());

  function load(): void {
    subscription?.unsubscribe(); // une nouvelle requête remplace la précédente
    loading.set(true);
    error.set(null);
    subscription = source().subscribe({
      next: (value) => {
        data.set(value);
        loading.set(false);
      },
      error: (failure: ApiError) => {
        data.set(null);
        error.set(failure);
        loading.set(false);
      },
    });
  }

  return {
    data: data.asReadonly(),
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    load,
  };
}
