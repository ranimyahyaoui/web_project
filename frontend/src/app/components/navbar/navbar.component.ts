import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { initials } from '../../core/format';
import { IconComponent } from '../icon.component';
import { LogoComponent } from '../logo.component';
import { SearchBoxComponent } from '../search-box.component';

/** En-tête public : menu, recherche, connexion. Le menu se replie sous 1101 px. */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, IconComponent, LogoComponent, SearchBoxComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly auth = inject(AuthService);

  protected readonly links = [
    { to: '/', label: 'Accueil', exact: true },
    { to: '/a-propos', label: 'À propos', exact: false },
    { to: '/bureau', label: 'Bureau', exact: false },
    { to: '/activites', label: 'Activités', exact: false },
    { to: '/calendrier', label: 'Calendrier', exact: false },
  ];

  protected readonly open = signal(false);
  protected readonly space = computed(() => (this.auth.isAdmin() ? '/admin' : '/membre'));
  protected readonly userInitials = computed(() => {
    const user = this.auth.user();
    return user ? initials(user.firstName, user.lastName) : '';
  });

  constructor() {
    // Le tiroir se referme à chaque changement de page.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }
}
