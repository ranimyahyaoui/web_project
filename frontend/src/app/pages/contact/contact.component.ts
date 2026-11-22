import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { createFieldErrors } from '../../core/field-errors';
import { ApiError } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { IconComponent } from '../../components/icon.component';
import { FieldErrorComponent } from '../../components/states.component';

@Component({
  selector: 'app-contact',
  styleUrl: './contact.component.css',
  imports: [ReactiveFormsModule, BreadcrumbComponent, IconComponent, FieldErrorComponent],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly email = 'sc2.contact@supcom.tn';
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  // La validation est faite par l'API, qui renvoie un message en français par champ.
  protected readonly errors = createFieldErrors(this.form);
  protected readonly sending = signal(false);

  protected submit(): void {
    this.sending.set(true);
    this.api.contact(this.form.getRawValue()).subscribe({
      next: ({ message }) => {
        this.toast.success(message);
        this.form.reset();
        this.errors.clear();
        this.sending.set(false);
      },
      error: (failure: ApiError) => {
        this.errors.set(failure.fields);
        this.toast.error(failure.message);
        this.sending.set(false);
      },
    });
  }
}
