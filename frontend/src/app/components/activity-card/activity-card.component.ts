import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { shortDate } from '../../core/format';
import { Activity, ActivityStatus } from '../../core/models';
import { TypeBadgeComponent } from '../badges.component';
import { IconComponent } from '../icon.component';
import { SeatGaugeComponent } from '../seat-gauge.component';

// Les états du billet sont pilotés par une seule propriété : activity.status.
const ACTIONS: Record<ActivityStatus, { label: string; className: string }> = {
  open: { label: 'Réserver', className: 'btn-primary' },
  full: { label: 'Liste d’attente', className: 'btn-ghost' },
  started: { label: 'Programme', className: 'btn-ghost' },
  past: { label: 'Voir', className: 'btn-ghost' },
};

/**
 * Carte d'activité : composant réutilisé sur l'accueil,
 * la liste des activités et le calendrier.
 */
@Component({
  selector: 'app-activity-card',
  styleUrl: './activity-card.component.css',
  imports: [RouterLink, IconComponent, TypeBadgeComponent, SeatGaugeComponent],
  templateUrl: './activity-card.component.html',
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCardComponent {
  readonly activity = input.required<Activity>();
  /** Niveau du titre (h2 ou h3), selon la place du billet dans la page. */
  readonly headingLevel = input<2 | 3>(3);

  protected readonly action = computed(() => ACTIONS[this.activity().status]);
  protected readonly link = computed(() => ['/activites', this.activity().slug]);
  protected readonly dateLabel = computed(() => {
    const { status, date } = this.activity();
    return status === 'started'
      ? `En cours depuis le ${shortDate(date).toLowerCase()}`
      : shortDate(date);
  });
}
