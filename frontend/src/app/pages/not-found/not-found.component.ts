import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  styleUrl: './not-found.component.css',
  imports: [RouterLink],
  template: `
    <div class="wrap py-24 text-center">
      <p class="eyebrow">Erreur 404</p>
      <h1 class="mt-3 text-[39px] font-extrabold">Cette page n’existe pas</h1>
      <p class="mx-auto mt-3 max-w-[46ch] text-muted">
        Le lien est peut-être ancien. Les activités du club, elles, sont bien là.
      </p>
      <div class="mt-8 flex justify-center gap-3">
        <a routerLink="/activites" class="btn btn-primary">Voir les activités</a>
        <a routerLink="/" class="btn btn-ghost">Retour à l’accueil</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
