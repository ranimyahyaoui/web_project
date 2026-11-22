import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { daysUntil, longDate, plural, shortDate, toIso } from '../../core/format';
import { createLoader } from '../../core/loader';
import { ApiError, Reservation } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { AppShellComponent, ShellLink } from '../../components/app-shell.component';
import {
  PaymentBadgeComponent,
  ReservationBadgeComponent,
  TypeBadgeComponent,
} from '../../components/badges.component';
import { IconComponent } from '../../components/icon.component';
import { LogoComponent } from '../../components/logo.component';
import {
  EmptyComponent,
  ErrorStateComponent,
  LoadingComponent,
} from '../../components/states.component';

@Component({
  selector: 'app-member-dashboard',
  styleUrl: './member-dashboard.component.css',
  imports: [
    RouterLink,
    AppShellComponent,
    IconComponent,
    LogoComponent,
    TypeBadgeComponent,
    PaymentBadgeComponent,
    ReservationBadgeComponent,
    LoadingComponent,
    ErrorStateComponent,
    EmptyComponent,
  ],
  templateUrl: './member-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDashboardComponent {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly links: ShellLink[] = [
    { fragment: 'tableau', label: 'Tableau de bord', icon: 'layout-dashboard' },
    { fragment: 'reservations', label: 'Mes réservations', icon: 'ticket' },
    { fragment: 'adhesion', label: 'Mon adhésion', icon: 'id-card' },
  ];

  protected readonly dashboard = createLoader(() => this.api.dashboard());
  /** Identifiant de la réservation en cours d'annulation. */
  protected readonly busyId = signal<number | null>(null);
  protected readonly today = longDate(toIso(new Date()));
  protected readonly shortDate = shortDate;
  protected readonly longDate = longDate;

  protected readonly upcoming = computed(() =>
    (this.dashboard.data()?.reservations ?? []).filter((r) => r.activity.status !== 'past'),
  );
  /** Prochaine activité réservée, à partir d'aujourd'hui. */
  protected readonly next = computed(() =>
    this.upcoming().find((r) => daysUntil(r.activity.date) >= 0),
  );
  protected readonly nextSentence = computed(() => {
    const next = this.next();
    if (!next) return 'Aucune activité réservée pour le moment.';
    const days = daysUntil(next.activity.date);
    return days === 0
      ? 'Votre prochaine activité a lieu aujourd’hui.'
      : `Votre prochaine activité a lieu dans ${plural(days, 'jour', 'jours')}.`;
  });

  constructor() {
    this.dashboard.load();
  }

  protected cancel(reservation: Reservation): void {
    this.busyId.set(reservation.id);
    this.api.cancelReservation(reservation.id).subscribe({
      next: ({ message }) => {
        this.toast.success(message);
        this.busyId.set(null);
        this.dashboard.load();
      },
      error: (failure: ApiError) => {
        this.toast.error(failure.message);
        this.busyId.set(null);
      },
    });
  }
}
