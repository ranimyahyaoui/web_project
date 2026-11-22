// Mise en forme des dates et des libellés, en français.

/** Convertit "AAAA-MM-JJ" en date locale (sans décalage de fuseau). */
export function parseDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Sam. 21 novembre" */
export function shortDate(iso: string): string {
  return capitalize(
    parseDate(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }),
  );
}

/** "Samedi 21 novembre 2026" */
export function longDate(iso: string): string {
  return capitalize(
    parseDate(iso).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  );
}

/** "Novembre 2026" */
export function monthLabel(date: Date): string {
  return capitalize(date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
}

/** Nombre de jours entre aujourd'hui et la date donnée. */
export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(iso).getTime() - today.getTime()) / 86_400_000);
}

export const initials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

export const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

/** "React de A à Z (6 séances)" devient "React de A à Z". */
export const shortTitle = (title: string) => title.split(' (')[0];

export const POLES = ['Développement web', 'Cybersécurité', 'IA & data', 'Électronique & IoT'];
export const LEVELS = [
  '1re année Tronc commun',
  '2e année Télécom',
  '2e année Informatique',
  '3e année Télécom',
  '3e année Réseaux',
];
