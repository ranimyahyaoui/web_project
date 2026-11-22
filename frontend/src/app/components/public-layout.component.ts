import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';

/** Gabarit des pages publiques : en-tête et pied de page communs. */
@Component({
  selector: 'app-public-layout',
  styleUrl: './public-layout.component.css',
  imports: [RouterOutlet, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <a
      [routerLink]="[]"
      fragment="contenu"
      queryParamsHandling="preserve"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-m focus:bg-night focus:px-4 focus:py-2 focus:text-[#F5F7F2]"
      >Aller au contenu</a
    >
    <app-navbar />
    <main id="contenu" tabindex="-1" class="outline-none">
      <router-outlet />
    </main>
    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}
