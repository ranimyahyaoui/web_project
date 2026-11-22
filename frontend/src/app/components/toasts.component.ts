import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';
import { IconComponent } from './icon.component';

/** Affiche les notifications du ToastService ; placé une seule fois, dans AppComponent. */
@Component({
  selector: 'app-toasts',
  styleUrl: './toasts.component.css',
  imports: [IconComponent],
  template: `
    <!-- aria-live : le message est aussi annoncé par les lecteurs d'écran. -->
    <div
      aria-live="polite"
      class="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
    >
      @for (toast of service.toasts(); track toast.id) {
        <div
          role="status"
          class="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-m bg-night px-4 py-3 text-[15px] text-[#F5F7F2] shadow-lift"
        >
          @if (toast.type === 'success') {
            <app-icon name="circle-check" [size]="20" class="mt-0.5 text-green" />
          } @else {
            <app-icon name="circle-alert" [size]="20" class="mt-0.5 text-[#FF8A80]" />
          }
          <p class="flex-1">{{ toast.message }}</p>
          <button
            type="button"
            (click)="service.dismiss(toast.id)"
            aria-label="Fermer la notification"
            class="rounded p-0.5 opacity-70 hover:opacity-100"
          >
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastsComponent {
  protected readonly service = inject(ToastService);
}
