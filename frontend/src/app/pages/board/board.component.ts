import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { createLoader } from '../../core/loader';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { IconComponent } from '../../components/icon.component';
import { ErrorStateComponent, LoadingComponent } from '../../components/states.component';

@Component({
  selector: 'app-board',
  styleUrl: './board.component.css',
  imports: [BreadcrumbComponent, IconComponent, LoadingComponent, ErrorStateComponent],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private readonly api = inject(ApiService);
  protected readonly board = createLoader(() => this.api.board());
  protected readonly gradients = ['gradient-d', 'gradient-b', 'gradient-c', 'gradient-a'];

  constructor() {
    this.board.load();
  }

  /** "Amine Gharbi" devient "AG". */
  protected initialsOf(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('');
  }
}
