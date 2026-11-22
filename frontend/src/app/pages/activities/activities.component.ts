import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { POLES, plural } from '../../core/format';
import { createLoader } from '../../core/loader';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { IconComponent } from '../../components/icon.component';
import {
  EmptyComponent,
  ErrorStateComponent,
  LoadingComponent,
} from '../../components/states.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';

@Component({
  selector: 'app-activities',
  styleUrl: './activities.component.css',
  imports: [
    BreadcrumbComponent,
    IconComponent,
    ActivityCardComponent,
    LoadingComponent,
    ErrorStateComponent,
    EmptyComponent,
  ],
  templateUrl: './activities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // Les filtres vivent dans l'adresse (?type=...&pole=...) : un lien filtré peut être
  // partagé et le bouton « retour » du navigateur fonctionne. Le routeur les fournit
  // ici comme entrées du composant.
  readonly type = input<string>();
  readonly pole = input<string>();
  readonly q = input<string>();
  readonly available = input<string>();

  protected readonly filters = computed(() => ({
    type: this.type() ?? '',
    pole: this.pole() ?? '',
    q: this.q() ?? '',
    available: this.available() ?? '',
  }));
  protected readonly hasFilters = computed(() => Object.values(this.filters()).some(Boolean));

  protected readonly list = createLoader(() => this.api.activities(this.filters()));
  protected readonly countLabel = computed(() => {
    const activities = this.list.data();
    if (!activities) return '';
    return (
      plural(activities.length, 'activité', 'activités') +
      (this.hasFilters() ? ' pour ces filtres' : '')
    );
  });

  protected readonly types = [
    { value: '', label: 'Toutes' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'formation', label: 'Formations' },
    { value: 'evenement', label: 'Événements' },
  ];
  protected readonly poles = [...POLES, 'Communauté'];

  /** Texte du champ de recherche, avant d'être reporté dans l'adresse. */
  protected readonly searchText = signal('');
  private readonly searchInput = new Subject<string>();

  constructor() {
    // Chaque changement de filtre relance la requête.
    effect(() => {
      this.filters();
      untracked(() => this.list.load());
    });
    // Le champ suit l'adresse (lien partagé, recherche depuis l'en-tête).
    effect(() => this.searchText.set(this.filters().q));
    // La recherche attend 300 ms après la dernière frappe avant d'interroger l'API.
    this.searchInput
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((text) => this.setFilter('q', text.trim()));
  }

  protected onSearch(text: string): void {
    this.searchText.set(text);
    this.searchInput.next(text);
  }

  protected setFilter(name: string, value: string): void {
    this.router.navigate([], {
      queryParams: { [name]: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected clearFilters(): void {
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }
}
