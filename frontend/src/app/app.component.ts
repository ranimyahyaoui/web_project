import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsComponent } from './components/toasts.component';

/** Composant racine : la page courante et les notifications. */
@Component({
  selector: 'app-root',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, ToastsComponent],
  template: `
    <router-outlet />
    <app-toasts />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
