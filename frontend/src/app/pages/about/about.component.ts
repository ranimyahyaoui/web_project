import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { createLoader } from '../../core/loader';
import { BreadcrumbComponent } from '../../components/breadcrumb.component';
import { IconComponent, IconName } from '../../components/icon.component';

@Component({
  selector: 'app-about',
  styleUrl: './about.component.css',
  imports: [RouterLink, BreadcrumbComponent, IconComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  private readonly api = inject(ApiService);
  private readonly stats = createLoader(() => this.api.stats());

  // « … » tant que les chiffres ne sont pas arrivés.
  protected readonly figures = computed(() => {
    const stats = this.stats.data();
    return [
      { value: stats?.members ?? '…', label: 'membres actifs' },
      { value: stats?.activities ?? '…', label: 'activités cette année' },
      { value: stats?.poles ?? '…', label: 'pôles techniques' },
    ];
  });

  protected readonly values: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'rocket',
      title: 'Apprendre en faisant',
      text: 'Chaque activité se termine par quelque chose qui fonctionne : un dépôt, un capteur, une application.',
    },
    {
      icon: 'handshake',
      title: 'Entre étudiants',
      text: 'Les ateliers sont préparés et animés par des membres, pour des membres, sans prérequis cachés.',
    },
    {
      icon: 'book-open',
      title: 'Tout reste accessible',
      text: 'Supports, exercices et ressources restent disponibles dans l’espace membre après chaque séance.',
    },
  ];

  constructor() {
    this.stats.load();
  }
}
