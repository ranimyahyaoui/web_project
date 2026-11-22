import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  CodeXml,
  Cpu,
  GraduationCap,
  Handshake,
  Hourglass,
  IdCard,
  Laptop,
  LayoutDashboard,
  LoaderCircle,
  LogIn,
  LogOut,
  LucideAngularModule,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  Plus,
  Rocket,
  Search,
  SearchX,
  Send,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  X,
} from 'lucide-angular';

// Seules les icônes listées ici sont incluses dans le site.
const ICONS = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'book-open': BookOpen,
  'brain-circuit': BrainCircuit,
  calendar: Calendar,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-x': CircleX,
  clock: Clock,
  'code-xml': CodeXml,
  cpu: Cpu,
  'graduation-cap': GraduationCap,
  handshake: Handshake,
  hourglass: Hourglass,
  'id-card': IdCard,
  laptop: Laptop,
  'layout-dashboard': LayoutDashboard,
  'loader-circle': LoaderCircle,
  'log-in': LogIn,
  'log-out': LogOut,
  mail: Mail,
  'map-pin': MapPin,
  megaphone: Megaphone,
  menu: Menu,
  'message-square': MessageSquare,
  plus: Plus,
  rocket: Rocket,
  search: Search,
  'search-x': SearchX,
  send: Send,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  ticket: Ticket,
  'user-plus': UserPlus,
  users: Users,
  wallet: Wallet,
  wrench: Wrench,
  x: X,
};

export type IconName = keyof typeof ICONS;

/**
 * Icône Lucide (trait de 2 px, comme dans la charte). Toujours décorative :
 * le sens est porté par le texte voisin ou par l'aria-label du bouton.
 *
 *   <app-icon name="ticket" [size]="17" />
 */
@Component({
  selector: 'app-icon',
  styleUrl: './icon.component.css',
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icons[name()]" [size]="size()" />`,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  protected readonly icons = ICONS;
}
