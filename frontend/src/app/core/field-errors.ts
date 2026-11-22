import { signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';

/**
 * Erreurs par champ renvoyées par l'API pour un formulaire réactif.
 * L'erreur d'un champ disparaît dès que l'utilisateur le corrige.
 * À créer dans un constructeur ou un initialiseur de propriété.
 */
export function createFieldErrors(form: FormGroup) {
  const errors = signal<Record<string, string | undefined>>({});

  for (const [name, control] of Object.entries(form.controls)) {
    control.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (errors()[name]) errors.update((current) => ({ ...current, [name]: undefined }));
    });
  }

  return {
    /** Message d'erreur du champ, ou undefined. */
    of: (name: string) => errors()[name],
    set: (fields: Record<string, string>) => errors.set(fields),
    clear: () => errors.set({}),
  };
}
