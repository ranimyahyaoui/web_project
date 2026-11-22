import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { IconComponent } from '../icon.component';
import { LogoComponent } from '../logo.component';

interface FooterLink {
  label: string;
  to: string;
  query?: Params;
}

@Component({
  selector: 'app-footer',
  styleUrl: './footer.component.css',
  imports: [RouterLink, IconComponent, LogoComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly email = 'sc2.contact@supcom.tn';

  protected readonly columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Le club',
      links: [
        { label: 'À propos', to: '/a-propos' },
        { label: 'Le bureau', to: '/bureau' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Activités',
      links: [
        { label: 'Workshops', to: '/activites', query: { type: 'workshop' } },
        { label: 'Formations', to: '/activites', query: { type: 'formation' } },
        { label: 'Événements', to: '/activites', query: { type: 'evenement' } },
        { label: 'Calendrier', to: '/calendrier' },
      ],
    },
    {
      title: 'Espace membre',
      links: [
        { label: 'Se connecter', to: '/connexion' },
        { label: 'Demander l’adhésion', to: '/connexion', query: { onglet: 'adhesion' } },
        { label: 'Mes réservations', to: '/membre' },
      ],
    },
  ];
}
