import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { createFieldErrors } from '../../core/field-errors';
import { LEVELS, POLES } from '../../core/format';
import { ApiError } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { IconComponent, IconName } from '../../components/icon.component';
import { LogoComponent } from '../../components/logo.component';
import { FieldErrorComponent } from '../../components/states.component';

/** Connexion et demande d'adhésion : deux onglets sur la même page. */
@Component({
  selector: 'app-login',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, LogoComponent, FieldErrorComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  // Paramètres de l'adresse : ?onglet=adhesion et ?retour=/page-d-origine
  readonly onglet = input<string>();
  readonly retour = input<string>();

  protected readonly tab = computed(() =>
    this.onglet() === 'adhesion' ? 'adhesion' : 'connexion',
  );
  protected readonly tabs = [
    { name: 'connexion', label: 'Se connecter' },
    { name: 'adhesion', label: 'Demander l’adhésion' },
  ];

  protected readonly benefits: { icon: IconName; text: string }[] = [
    { icon: 'ticket', text: 'Réservez vos places aux activités' },
    { icon: 'book-open', text: 'Retrouvez vos cours et supports' },
    { icon: 'megaphone', text: 'Recevez les annonces du club' },
    { icon: 'wallet', text: 'Suivez votre adhésion et votre cotisation' },
  ];
  protected readonly levels = LEVELS;
  protected readonly poles = POLES;

  // ---- Connexion ----
  protected readonly loginForm = this.fb.group({ email: '', password: '' });
  protected readonly loginErrors = createFieldErrors(this.loginForm);
  /** Erreur sans champ précis : mauvais mot de passe, adhésion en attente. */
  protected readonly loginFailure = signal('');
  protected readonly loggingIn = signal(false);

  // ---- Demande d'adhésion ----
  protected readonly adhesionForm = this.fb.group({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    level: '',
    poles: this.fb.control<string[]>([]),
    motivation: '',
  });
  protected readonly adhesionErrors = createFieldErrors(this.adhesionForm);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);

  protected selectTab(name: string): void {
    this.router.navigate([], {
      queryParams: { onglet: name === 'adhesion' ? 'adhesion' : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected login(): void {
    this.loggingIn.set(true);
    this.loginFailure.set('');
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: ({ user }) => {
        this.toast.success(`Bon retour, ${user.firstName}.`);
        // Retour à la page d'origine si elle est interne au site, sinon vers l'espace du rôle.
        const returnPath = this.retour();
        const target = returnPath?.startsWith('/') ? returnPath : this.auth.homeFor(user);
        this.router.navigateByUrl(target, { replaceUrl: true });
      },
      error: (failure: ApiError) => {
        this.loginErrors.set(failure.fields);
        if (Object.keys(failure.fields).length === 0) this.loginFailure.set(failure.message);
        this.loggingIn.set(false);
      },
    });
  }

  protected hasPole(pole: string): boolean {
    return this.adhesionForm.controls.poles.value.includes(pole);
  }

  protected togglePole(pole: string): void {
    const control = this.adhesionForm.controls.poles;
    control.setValue(
      this.hasPole(pole) ? control.value.filter((p) => p !== pole) : [...control.value, pole],
    );
  }

  protected requestAdhesion(): void {
    this.sending.set(true);
    this.api.adhesion(this.adhesionForm.getRawValue()).subscribe({
      next: () => {
        this.sent.set(true);
        this.sending.set(false);
      },
      error: (failure: ApiError) => {
        this.adhesionErrors.set(failure.fields);
        this.toast.error(failure.message);
        this.sending.set(false);
      },
    });
  }
}
