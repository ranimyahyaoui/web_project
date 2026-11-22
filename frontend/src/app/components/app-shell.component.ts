import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { initials } from '../core/format';
import { IconComponent, IconName } from './icon.component';
import { LogoComponent } from './logo.component';

export interface ShellLink {
  fragment: string; // identifiant de la section de la page
  label: string;
  icon: IconName;
}

/**
 * Gabarit des espaces membre et administrateur : barre latérale sur
 * ordinateur, barre supérieure compacte sur tablette et téléphone.
 */
@Component({
  selector: 'app-shell',
  styleUrl: './app-shell.component.css',
  imports: [RouterLink, IconComponent, LogoComponent],
  templateUrl: './app-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly links = input.required<ShellLink[]>();
  readonly roleLabel = input.required<string>();

  protected readonly user = this.auth.user;
  protected readonly userInitials = computed(() => {
    const user = this.user();
    return user ? initials(user.firstName, user.lastName) : '';
  });

  protected signOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
