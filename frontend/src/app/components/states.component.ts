import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ApiError } from '../core/models';
import { IconComponent } from './icon.component';

// États communs à tous les écrans qui chargent des données.

@Component({
  selector: 'app-loading',
  styleUrl: './states.component.css',
  imports: [IconComponent],
  template: `
    <p role="status" class="flex items-center justify-center gap-2 py-16 text-muted">
      <app-icon name="loader-circle" [size]="20" class="animate-spin" />
      {{ label() }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  readonly label = input('Chargement…');
}

@Component({
  selector: 'app-error-state',
  styleUrl: './states.component.css',
  imports: [IconComponent],
  template: `
    <div role="alert" class="card mx-auto my-10 max-w-lg p-6 text-center">
      <app-icon name="circle-alert" [size]="28" class="text-red" />
      <p class="mt-3 font-semibold">{{ error()?.message ?? 'Une erreur est survenue.' }}</p>
      @if (retryable()) {
        <button type="button" class="btn btn-ghost btn-sm mt-4" (click)="retry.emit()">
          Réessayer
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  readonly error = input<ApiError | null>(null);
  readonly retryable = input(true);
  readonly retry = output<void>();
}

@Component({
  selector: 'app-empty',
  styleUrl: './states.component.css',
  imports: [IconComponent],
  template: `
    <div class="rounded-l border border-dashed border-line-2 px-6 py-12 text-center">
      <app-icon name="search-x" [size]="28" class="text-faint" />
      <p class="mt-3 font-display text-xl font-bold">{{ title() }}</p>
      <div class="mt-2 text-muted"><ng-content /></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent {
  readonly title = input.required<string>();
}

/** Message d'erreur sous un champ de formulaire ; rien n'est affiché sans message. */
@Component({
  selector: 'app-field-error',
  styleUrl: './states.component.css',
  imports: [IconComponent],
  template: `
    @if (message()) {
      <p class="field-error"><app-icon name="circle-alert" [size]="16" />{{ message() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorComponent {
  readonly message = input<string | undefined>();
}
