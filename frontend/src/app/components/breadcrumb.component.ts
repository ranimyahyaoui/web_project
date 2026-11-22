import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

export interface Crumb {
  label: string;
  to?: string;
}

/** Fil d'Ariane : le dernier élément est la page courante. */
@Component({
  selector: 'app-breadcrumb',
  styleUrl: './breadcrumb.component.css',
  imports: [RouterLink, IconComponent],
  template: `
    <nav aria-label="Fil d’Ariane" class="mb-5 text-sm text-muted">
      <ol class="flex flex-wrap items-center gap-1.5">
        <li><a routerLink="/" class="hover:text-ink">Accueil</a></li>
        @for (item of items(); track item.label) {
          <li class="flex items-center gap-1.5">
            <app-icon name="chevron-right" [size]="14" class="text-faint" />
            @if (item.to) {
              <a [routerLink]="item.to" class="hover:text-ink">{{ item.label }}</a>
            } @else {
              <span aria-current="page" class="text-faint">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly items = input.required<Crumb[]>();
}
