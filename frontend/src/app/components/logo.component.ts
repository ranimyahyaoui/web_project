import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Logo SC2 Connect : un S dessiné par quatre nœuds reliés. `wordmark` affiche le nom à côté. */
@Component({
  selector: 'app-logo',
  styleUrl: './logo.component.css',
  template: `
    <span class="flex items-center gap-2.5 font-display text-[21px] font-extrabold tracking-tight">
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 40 40"
        aria-hidden="true"
        class="flex-none"
      >
        <rect width="40" height="40" rx="11" [attr.fill]="colors().tile" />
        <path
          d="M27 13 13 17.5 27 25 13 29"
          fill="none"
          [attr.stroke]="colors().stroke"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="13" cy="17.5" r="2.6" [attr.fill]="colors().stroke" />
        <circle cx="27" cy="25" r="2.6" [attr.fill]="colors().stroke" />
        <circle cx="13" cy="29" r="2.6" [attr.fill]="colors().stroke" />
        <circle cx="27.5" cy="12.5" r="3.4" [attr.fill]="colors().accent" />
      </svg>
      @if (wordmark()) {
        <span
          >SC2<span class="font-medium" [class]="onNight() ? 'text-green' : 'text-green-ink'"
            >connect</span
          ></span
        >
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  readonly onNight = input(false);
  readonly size = input(38);
  readonly wordmark = input(true);

  protected readonly colors = computed(() =>
    this.onNight()
      ? { tile: '#1DB980', stroke: '#0C1A36', accent: '#F5F7F2' }
      : { tile: '#0C1A36', stroke: '#F5F7F2', accent: '#1DB980' },
  );
}
