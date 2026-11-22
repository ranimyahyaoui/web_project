import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { monthLabel, toIso } from '../core/format';
import { ActivityType } from '../core/models';
import { IconComponent } from './icon.component';

export interface CalendarEvent {
  slug: string;
  title: string;
  type: ActivityType;
}

interface Day {
  iso: string;
  number: number;
  outside: boolean; // jour du mois précédent ou suivant
  today: boolean;
  events: CalendarEvent[];
  label: string;
}

const EVENT_CLASS: Record<ActivityType, string> = {
  workshop: 'bg-green-tint text-green-ink border-green-ink',
  formation: 'bg-blue-tint text-blue border-blue',
  evenement: 'bg-violet-tint text-violet border-violet',
};

/** Calendrier mensuel. Le mois affiché et le jour sélectionné sont gérés par la page parente. */
@Component({
  selector: 'app-month-calendar',
  styleUrl: './month-calendar.component.css',
  imports: [IconComponent],
  templateUrl: './month-calendar.component.html',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthCalendarComponent {
  readonly month = input.required<Date>();
  /** Événements par jour : { 'AAAA-MM-JJ': [...] } */
  readonly events = input.required<Record<string, CalendarEvent[]>>();
  readonly selected = input.required<string>();
  readonly monthChange = output<Date>();
  readonly daySelect = output<string>();

  protected readonly weekdays = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'];
  protected readonly eventClass = EVENT_CLASS;
  protected readonly title = computed(() => monthLabel(this.month()));

  /** Les 42 cases (6 semaines) du mois affiché, en commençant un lundi. */
  protected readonly days = computed<Day[]>(() => {
    const month = this.month();
    const events = this.events();
    const todayIso = toIso(new Date());
    const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(month.getFullYear(), month.getMonth(), 1 - offset + i);
      const iso = toIso(date);
      const dayEvents = events[iso] ?? [];
      const titles = dayEvents.map((event) => event.title).join(', ');
      return {
        iso,
        number: date.getDate(),
        outside: date.getMonth() !== month.getMonth(),
        today: iso === todayIso,
        events: dayEvents,
        label: `${date.getDate()} ${monthLabel(date)}${titles ? `, ${titles}` : ''}`,
      };
    });
  });

  protected shift(delta: number): void {
    const month = this.month();
    this.monthChange.emit(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  }
}
