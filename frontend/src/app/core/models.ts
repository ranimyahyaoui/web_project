// Types des données échangées avec l'API.

export type ActivityType = 'workshop' | 'formation' | 'evenement';
/** open : places libres · full : complet · started : formation en cours · past : terminée */
export type ActivityStatus = 'open' | 'full' | 'started' | 'past';
export type PaymentStatus = 'PAID' | 'PENDING' | 'UNPAID';
export type RegistrationStatus = 'CONFIRMED' | 'WAITLIST';

export interface Activity {
  id: number;
  slug: string;
  type: ActivityType;
  title: string;
  summary: string;
  description: string;
  date: string; // AAAA-MM-JJ
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  pole: string;
  level: string;
  duration: string;
  bring: string;
  outcomes: string[];
  sessions: string[];
  taken: number;
  remaining: number;
  status: ActivityStatus;
}

export interface Registration {
  id: number;
  code: string;
  status: RegistrationStatus;
}

export interface ActivityDetail extends Activity {
  myRegistration: Registration | null;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'MEMBER' | 'ADMIN';
  membershipStatus: 'PENDING' | 'ACTIVE' | 'REFUSED';
  level: string;
  poles: string;
  memberNumber: string | null;
  createdAt: string;
}

export interface Payment {
  academicYear: string;
  amount: number;
  status: PaymentStatus;
}

export interface Reservation extends Registration {
  activity: Activity;
}

export interface Dashboard {
  user: User;
  payment: Payment | null;
  reservations: Reservation[];
}

export interface Stats {
  members: number;
  activities: number;
  poles: number;
}

export interface BoardMember {
  id: number;
  name: string;
  position: string;
  description: string;
  email: string;
}

export interface News {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  memberNumber: string | null;
  paymentStatus: PaymentStatus;
}

export interface AdhesionRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  poles: string;
  motivation: string;
  createdAt: string;
}

export interface AdminOverview {
  stats: {
    members: number;
    pendingRequests: number;
    paid: number;
    pending: number;
    unpaid: number;
    paidRate: number;
    fillRate: number;
  };
  students: Student[];
  requests: AdhesionRequest[];
  activities: Pick<Activity, 'id' | 'slug' | 'title' | 'type' | 'taken' | 'capacity'>[];
}

export interface ActivityFilters {
  type?: string;
  pole?: string;
  q?: string;
  available?: string;
}

export interface AdhesionForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: string;
  poles: string[];
  motivation: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Erreur renvoyée par l'API : message lisible et erreurs par champ. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
  }
}
