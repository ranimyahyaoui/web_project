import { NgTemplateOutlet } from '@angular/common';
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
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { longDate, plural, shortDate } from '../../core/format';
import { createLoader } from '../../core/loader';
import { ActivityType, ApiError } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { ReservationBadgeComponent, TypeBadgeComponent } from '../../components/badges.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { IconComponent, IconName } from '../../components/icon.component';
import { SeatMapComponent } from '../../components/seat-map.component';
import { ErrorStateComponent, LoadingComponent } from '../../components/states.component';

const BANNER: Record<ActivityType, { icon: IconName; className: string }> = {
  workshop: { icon: 'code-xml', className: 'gradient-a' },
  formation: { icon: 'graduation-cap', className: 'gradient-b' },
  evenement: { icon: 'sparkles', className: 'gradient-c' },
};

@Component({
  selector: 'app-activity-detail',
  styleUrl: './activity-detail.component.css',
  imports: [
    RouterLink,
    NgTemplateOutlet,
    BreadcrumbComponent,
    IconComponent,
    TypeBadgeComponent,
    ReservationBadgeComponent,
    SeatMapComponent,
    LoadingComponent,
    ErrorStateComponent,
  ],
  templateUrl: './activity-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityDetailComponent {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  protected readonly auth = inject(AuthService);

  /** Paramètre de route :slug, fourni par le routeur. */
  readonly slug = input.required<string>();

  protected readonly detail = createLoader(() => this.api.activity(this.slug()));
  protected readonly busy = signal(false);
  protected readonly shortDate = shortDate;
  protected readonly longDate = longDate;
  protected readonly plural = plural;

  protected readonly banner = computed(() => BANNER[this.detail.data()?.type ?? 'workshop']);
  protected readonly facts = computed<{ icon: IconName; term: string; value: string }[]>(() => {
    const activity = this.detail.data();
    if (!activity) return [];
    return [
      { icon: 'calendar', term: 'Date', value: longDate(activity.date) },
      { icon: 'clock', term: 'Horaire', value: `${activity.startTime} – ${activity.endTime}` },
      { icon: 'map-pin', term: 'Lieu', value: activity.location },
      { icon: 'laptop', term: 'À apporter', value: activity.bring },
    ];
  });
  /** Les inscriptions sont closes quand l'activité a commencé ou est terminée. */
  protected readonly closed = computed(() => {
    const status = this.detail.data()?.status;
    return status === 'started' || status === 'past';
  });
  protected readonly returnUrl = computed(() => `/activites/${this.slug()}`);

  constructor() {
    // Rechargement quand l'activité change, et après connexion ou déconnexion
    // (la réponse contient alors la réservation du membre).
    effect(() => {
      this.slug();
      this.auth.user();
      untracked(() => this.detail.load());
    });
  }

  protected reserve(): void {
    this.run(this.api.reserve(this.slug()));
  }

  protected cancel(registrationId: number): void {
    this.run(this.api.cancelReservation(registrationId));
  }

  private run(action: Observable<{ message: string }>): void {
    this.busy.set(true);
    action.subscribe({
      next: ({ message }) => {
        this.toast.success(message);
        this.busy.set(false);
        this.detail.load();
      },
      error: (failure: ApiError) => {
        this.toast.error(failure.message);
        this.busy.set(false);
      },
    });
  }
}
