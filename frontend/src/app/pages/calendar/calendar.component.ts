import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { longDate, parseDate, shortTitle, toIso } from '../../core/format';
import { createLoader } from '../../core/loader';
import { Activity, ActivityType } from '../../core/models';
import { TypeBadgeComponent } from '../../components/badges.component';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { CalendarEvent, MonthCalendarComponent } from '../../components/month-calendar.component';
import { ErrorStateComponent, LoadingComponent } from '../../components/states.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';

/** Une date du club : une activité, ou une séance de formation. */
interface Occurrence {
  date: string;
  activity: Activity;
  title: string;
  day: number;
  month: string;
}

@Component({
  selector: 'app-calendar',
  styleUrl: './calendar.component.css',
  imports: [
    RouterLink,
    BreadcrumbComponent,
    MonthCalendarComponent,
    ActivityCardComponent,
    TypeBadgeComponent,
    LoadingComponent,
    ErrorStateComponent,
  ],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private readonly api = inject(ApiService);
  private readonly today = toIso(new Date());

  protected readonly activities = createLoader(() => this.api.activities());
  protected readonly month = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  private readonly picked = signal<string | null>(null);

  protected readonly types: ActivityType[] = ['workshop', 'formation', 'evenement'];
  protected readonly longDate = longDate;

  /** Toutes les dates du club : une entrée par séance pour les formations. */
  private readonly occurrences = computed<Occurrence[]>(() => {
    const list: Occurrence[] = [];
    for (const activity of this.activities.data() ?? []) {
      const dates = activity.sessions.length ? activity.sessions : [activity.date];
      dates.forEach((date, i) => {
        const parsed = parseDate(date);
        list.push({
          date,
          activity,
          title: activity.sessions.length
            ? `${shortTitle(activity.title)}, séance ${i + 1}`
            : activity.title,
          day: parsed.getDate(),
          month: parsed.toLocaleDateString('fr-FR', { month: 'short' }),
        });
      });
    }
    return list.sort((a, b) => a.date.localeCompare(b.date));
  });

  protected readonly events = computed(() => {
    const byDay: Record<string, CalendarEvent[]> = {};
    for (const { date, activity, title } of this.occurrences()) {
      (byDay[date] ??= []).push({ slug: activity.slug, type: activity.type, title });
    }
    return byDay;
  });

  /** Jour sélectionné ; par défaut, celui de la prochaine date du club. */
  protected readonly day = computed(
    () =>
      this.picked() ??
      this.occurrences().find(({ date }) => date >= this.today)?.date ??
      this.today,
  );
  protected readonly ofDay = computed(() =>
    this.occurrences().filter(({ date }) => date === this.day()),
  );
  protected readonly next = computed(() =>
    this.occurrences()
      .filter(({ date }) => date >= this.today && date > this.day())
      .slice(0, 4),
  );

  constructor() {
    this.activities.load();
  }

  protected select(iso: string): void {
    this.picked.set(iso);
    // Un clic sur un jour grisé du mois voisin affiche ce mois.
    const date = parseDate(iso);
    if (date.getMonth() !== this.month().getMonth()) {
      this.month.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }
}
