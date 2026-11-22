import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TOKEN_KEY } from './auth.interceptor';
import { User } from './models';

/** Session de l'utilisateur, partagée par toute l'application. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  /** Résolue une fois la session vérifiée auprès du serveur ; attendue par les gardes de route. */
  readonly ready: Promise<void> = this.restore();

  /** Au chargement, vérifie que le jeton enregistré est encore valable. */
  private async restore(): Promise<void> {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    try {
      const { user } = await firstValueFrom(this.api.me());
      this.currentUser.set(user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.api.login(credentials).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this.currentUser.set(user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  /** Page d'arrivée après connexion, selon le rôle. */
  homeFor(user: User): string {
    return user.role === 'ADMIN' ? '/admin' : '/membre';
  }
}
