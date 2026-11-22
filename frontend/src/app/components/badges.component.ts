import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivityType, PaymentStatus, RegistrationStatus } from '../core/models';
import { IconComponent, IconName } from './icon.component';

// Chaque badge associe une icône et un mot : le sens ne repose jamais sur la couleur seule.
interface BadgeStyle {
  label: string;
  icon: IconName;
  className: string;
}

const TYPES: Record<ActivityType, BadgeStyle> = {
  workshop: { label: 'Workshop', icon: 'wrench', className: 'b-workshop' },
  formation: { label: 'Formation', icon: 'graduation-cap', className: 'b-formation' },
  evenement: { label: 'Événement', icon: 'sparkles', className: 'b-evenement' },
};

const PAYMENTS: Record<PaymentStatus, BadgeStyle> = {
  PAID: { label: 'Payé', icon: 'circle-check', className: 'b-paid' },
  PENDING: { label: 'En attente', icon: 'hourglass', className: 'b-wait' },
  UNPAID: { label: 'Non payé', icon: 'circle-x', className: 'b-unpaid' },
};

const RESERVATIONS: Record<RegistrationStatus, BadgeStyle> = {
  CONFIRMED: { label: 'Réservation confirmée', icon: 'circle-check', className: 'b-paid' },
  WAITLIST: { label: 'Liste d’attente', icon: 'hourglass', className: 'b-wait' },
};

const TEMPLATE = `<span class="badge" [class]="style().className"><app-icon [name]="style().icon" [size]="14" />{{ prefix() }}{{ style().label }}</span>`;

/** Type d'activité : workshop, formation ou événement. */
@Component({
  selector: 'app-type-badge',
  styleUrl: './badges.component.css',
  imports: [IconComponent],
  template: TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeBadgeComponent {
  readonly type = input.required<ActivityType>();
  readonly prefix = input('');
  protected readonly style = computed(() => TYPES[this.type()]);
}

/** Statut de cotisation : payé, en attente ou non payé. */
@Component({
  selector: 'app-payment-badge',
  styleUrl: './badges.component.css',
  imports: [IconComponent],
  template: TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentBadgeComponent {
  readonly status = input.required<PaymentStatus>();
  readonly prefix = input('');
  protected readonly style = computed(() => PAYMENTS[this.status()]);
}

/** Statut d'une réservation : confirmée ou en liste d'attente. */
@Component({
  selector: 'app-reservation-badge',
  styleUrl: './badges.component.css',
  imports: [IconComponent],
  template: TEMPLATE,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationBadgeComponent {
  readonly status = input.required<RegistrationStatus>();
  readonly prefix = input('');
  protected readonly style = computed(() => RESERVATIONS[this.status()]);
}
