import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type Seat = 'free' | 'taken' | 'mine';

// Répartition stable des places occupées : le même plan à chaque affichage.
function scatter(capacity: number, seed: number): number[] {
  const order = Array.from({ length: capacity }, (_, i) => i);
  let state = seed * 9301 + 49297;
  for (let i = order.length - 1; i > 0; i -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Plan de salle : places réservées, places libres, et la place du membre en vert. */
@Component({
  selector: 'app-seat-map',
  styleUrl: './seat-map.component.css',
  template: `
    @if (capacity() > 60) {
      <div
        class="h-2.5 overflow-hidden rounded-full bg-surface-2"
        role="img"
        [attr.aria-label]="label()"
      >
        <div
          class="h-full rounded-full bg-ink"
          [style.width.%]="(taken() / capacity()) * 100"
        ></div>
      </div>
    } @else {
      <p class="mb-2 border-b border-line pb-1 text-center text-xs text-faint" aria-hidden="true">
        Tableau
      </p>
      <div
        class="grid grid-cols-10 justify-items-center gap-1.5"
        role="img"
        [attr.aria-label]="label()"
      >
        @for (seat of seats(); track $index) {
          <span
            class="seat-lg"
            [class.seat-taken]="seat === 'taken'"
            [class.seat-mine]="seat === 'mine'"
          ></span>
        }
      </div>
      <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden="true">
        <li class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-[3px] bg-ink"></span>Réservée
        </li>
        <li class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-[3px] bg-surface-2 ring-1 ring-line"></span>Disponible
        </li>
        @if (mine()) {
          <li class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-[3px] bg-green"></span>Votre place
          </li>
        }
      </ul>
    }
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent {
  readonly activityId = input.required<number>();
  readonly taken = input.required<number>();
  readonly capacity = input.required<number>();
  readonly mine = input(false);

  protected readonly label = computed(
    () => `Plan de salle : ${this.taken()} places réservées sur ${this.capacity()}`,
  );

  protected readonly seats = computed<Seat[]>(() => {
    const order = scatter(this.capacity(), this.activityId());
    const seats: Seat[] = Array(this.capacity()).fill('free');
    order.slice(0, this.taken()).forEach((index) => (seats[index] = 'taken'));
    if (this.mine() && this.taken() > 0) seats[order[this.taken() - 1]] = 'mine';
    return seats;
  });
}
