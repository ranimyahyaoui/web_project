import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { daysUntil, initials, plural, shortTitle } from '../../core/format';
import { createLoader } from '../../core/loader';
import { ActivityType, AdhesionRequest, ApiError, PaymentStatus, Student } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { AppShellComponent, ShellLink } from '../../components/app-shell.component';
import { PaymentBadgeComponent } from '../../components/badges.component';
import { IconComponent, IconName } from '../../components/icon.component';
import { ErrorStateComponent, LoadingComponent } from '../../components/states.component';

const BAR: Record<ActivityType, string> = {
  workshop: 'bg-green',
  formation: 'bg-blue',
  evenement: 'bg-violet',
};

@Component({
  selector: 'app-admin-dashboard',
  styleUrl: './admin-dashboard.component.css',
  imports: [
    AppShellComponent,
    IconComponent,
    PaymentBadgeComponent,
    LoadingComponent,
    ErrorStateComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly links: ShellLink[] = [
    { fragment: 'indicateurs', label: 'Tableau de bord', icon: 'layout-dashboard' },
    { fragment: 'etudiants', label: 'Étudiants et paiements', icon: 'users' },
    { fragment: 'adhesions', label: 'Adhésions', icon: 'user-plus' },
    { fragment: 'reservations', label: 'Réservations', icon: 'ticket' },
  ];
  protected readonly paymentFilters: { value: PaymentStatus | ''; label: string }[] = [
    { value: '', label: 'Tous' },
    { value: 'PAID', label: 'Payé' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'UNPAID', label: 'Non payé' },
  ];
  protected readonly paymentOptions = this.paymentFilters.slice(1);
  protected readonly bar = BAR;
  protected readonly initials = initials;
  protected readonly shortTitle = shortTitle;

  protected readonly overview = createLoader(() => this.api.adminOverview());
  protected readonly paymentFilter = signal<PaymentStatus | ''>('');
  protected readonly search = signal('');

  protected readonly cards = computed<
    { icon: IconName; label: string; value: string | number; detail: string }[]
  >(() => {
    const data = this.overview.data();
    if (!data) return [];
    const { stats } = data;
    return [
      {
        icon: 'users',
        label: 'Membres actifs',
        value: stats.members,
        detail: 'adhésions validées',
      },
      {
        icon: 'user-plus',
        label: 'Demandes à traiter',
        value: stats.pendingRequests,
        detail: 'en attente de décision',
      },
      {
        icon: 'wallet',
        label: 'Cotisations payées',
        value: `${stats.paidRate} %`,
        detail: `${stats.paid} payées, ${stats.pending} en attente, ${stats.unpaid} non payées`,
      },
      {
        icon: 'ticket',
        label: 'Remplissage moyen',
        value: `${stats.fillRate} %`,
        detail: `sur ${plural(data.activities.length, 'activité', 'activités')} à venir`,
      },
    ];
  });

  // Filtrage côté navigateur : la liste est déjà chargée, la réponse est immédiate.
  protected readonly students = computed(() => {
    const needle = this.search().trim().toLowerCase();
    const status = this.paymentFilter();
    return (this.overview.data()?.students ?? []).filter(
      (s) =>
        (!status || s.paymentStatus === status) &&
        (!needle || `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(needle)),
    );
  });
  protected readonly studentCount = computed(() =>
    plural(this.students().length, 'étudiant', 'étudiants'),
  );

  constructor() {
    this.overview.load();
  }

  /** "il y a 3 jours" */
  protected age(request: AdhesionRequest): string {
    const days = -daysUntil(request.createdAt);
    return days <= 0 ? 'aujourd’hui' : `il y a ${plural(days, 'jour', 'jours')}`;
  }

  protected decide(request: AdhesionRequest, decision: 'ACTIVE' | 'REFUSED'): void {
    this.run(this.api.decideAdhesion(request.id, decision));
  }

  protected setPayment(student: Student, status: string): void {
    this.run(this.api.setPayment(student.id, status as PaymentStatus));
  }

  private run(action: Observable<{ message: string }>): void {
    action.subscribe({
      next: ({ message }) => {
        this.toast.success(message);
        this.overview.load();
      },
      error: (failure: ApiError) => this.toast.error(failure.message),
    });
  }
}
