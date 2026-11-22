import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Jauge de places : dessinée en sièges jusqu'à 40 places, en barre au-delà.
 * Le texte donne toujours le chiffre exact.
 */
@Component({
  selector: 'app-seat-gauge',
  styleUrl: './seat-gauge.component.css',
  template: `
    @if (capacity() <= 40) {
      <div class="flex max-w-[150px] flex-wrap gap-[3px]" aria-hidden="true">
        @for (taken of seats(); track $index) {
          <span class="seat" [class.seat-taken]="taken"></span>
        }
      </div>
    } @else {
      <div class="h-[7px] w-[150px] overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          class="h-full rounded-full bg-ink"
          [style.width.%]="(taken() / capacity()) * 100"
        ></div>
      </div>
    }
    <p class="mt-2 text-[13px] text-muted">
      @if (remaining() === 0) {
        <strong class="font-semibold text-ink">Complet</strong>, {{ capacity() }} places
      } @else {
        <strong class="font-semibold text-ink">{{ remaining() }}</strong>
        {{ remaining() > 1 ? 'places restantes' : 'place restante' }} sur {{ capacity() }}
      }
    </p>
  `,
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatGaugeComponent {
  readonly taken = input.required<number>();
  readonly capacity = input.required<number>();

  protected readonly remaining = computed(() => Math.max(this.capacity() - this.taken(), 0));
  protected readonly seats = computed(() =>
    Array.from({ length: this.capacity() }, (_, i) => i < this.taken()),
  );
}
