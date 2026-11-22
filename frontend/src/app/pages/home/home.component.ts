import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { shortDate } from '../../core/format';
import { createLoader } from '../../core/loader';
import { IconComponent, IconName } from '../../components/icon.component';
import { ErrorStateComponent, LoadingComponent } from '../../components/states.component';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';

@Component({
  selector: 'app-home',
  styleUrl: './home.component.css',
  imports: [
    RouterLink,
    IconComponent,
    ActivityCardComponent,
    LoadingComponent,
    ErrorStateComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  protected readonly shortDate = shortDate;

  // Trois requêtes lancées en parallèle, un seul état de chargement.
  protected readonly page = createLoader(() =>
    forkJoin({ activities: this.api.activities(), stats: this.api.stats(), news: this.api.news() }),
  );

  protected readonly upcoming = computed(() =>
    (this.page.data()?.activities ?? []).filter((a) => a.status !== 'started'),
  );
  protected readonly featured = computed(() => this.upcoming().find((a) => a.status === 'open'));
  protected readonly stats = computed(() => {
    const stats = this.page.data()?.stats;
    return stats
      ? [
          { value: stats.members, label: 'membres actifs' },
          { value: stats.activities, label: 'activités cette année' },
          { value: stats.poles, label: 'pôles techniques' },
        ]
      : [];
  });

  protected readonly poles: { icon: IconName; name: string; text: string }[] = [
    {
      icon: 'code-xml',
      name: 'Développement web',
      text: 'Du HTML aux frameworks modernes, en passant par Git et le déploiement.',
    },
    {
      icon: 'shield-check',
      name: 'Cybersécurité',
      text: 'CTF, bonnes pratiques et sécurité des applications et des réseaux.',
    },
    {
      icon: 'brain-circuit',
      name: 'IA & data',
      text: 'Python, analyse de données et premiers modèles d’apprentissage.',
    },
    {
      icon: 'cpu',
      name: 'Électronique & IoT',
      text: 'Microcontrôleurs, capteurs et objets connectés, du prototype à la démo.',
    },
  ];

  protected readonly steps = [
    {
      title: 'Créez votre compte',
      text: 'Avec votre adresse universitaire, en moins d’une minute.',
    },
    {
      title: 'Envoyez votre demande',
      text: 'Indiquez vos pôles préférés : le bureau vous répond par e-mail.',
    },
    {
      title: 'Réglez la cotisation et réservez',
      text: 'Une fois membre, réservez vos places et accédez aux cours.',
    },
  ];

  protected readonly newsGradients = ['gradient-a', 'gradient-b', 'gradient-c'];

  // Réseau de nœuds reliés, motif de fond de la charte.
  protected readonly nodes = [
    [60, 80],
    [210, 190],
    [130, 380],
    [430, 60],
    [560, 250],
    [380, 430],
    [760, 120],
    [900, 330],
    [1080, 90],
    [1180, 400],
  ];
  protected readonly edges = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [4, 5],
    [4, 6],
    [6, 7],
    [6, 8],
    [7, 9],
    [2, 5],
  ];

  constructor() {
    this.page.load();
  }
}
