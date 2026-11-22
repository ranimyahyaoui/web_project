import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from './icon.component';

/** Recherche de l'en-tête : envoie vers la liste des activités, filtrée par le texte saisi. */
@Component({
  selector: 'app-search-box',
  styleUrl: './search-box.component.css',
  imports: [IconComponent],
  template: `
    <form
      role="search"
      (submit)="submit($event, field)"
      class="flex h-[42px] items-center gap-2 rounded-m border border-line bg-surface px-3.5 text-faint"
    >
      <app-icon name="search" />
      <input
        #field
        type="search"
        placeholder="Rechercher une activité…"
        aria-label="Rechercher une activité"
        class="w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
      />
    </form>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  private readonly router = inject(Router);
  readonly searched = output<void>();

  protected submit(event: Event, field: HTMLInputElement): void {
    event.preventDefault();
    const text = field.value.trim();
    this.router.navigate(['/activites'], { queryParams: text ? { q: text } : {} });
    field.value = '';
    this.searched.emit();
  }
}
