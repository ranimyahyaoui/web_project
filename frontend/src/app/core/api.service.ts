import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Activity,
  ActivityDetail,
  ActivityFilters,
  AdhesionForm,
  AdminOverview,
  BoardMember,
  ContactForm,
  Dashboard,
  News,
  PaymentStatus,
  Registration,
  Stats,
  User,
} from './models';

interface Message {
  message: string;
}

/** Client de l'API REST. Toutes les requêtes HTTP du site passent par ce service. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  // Public
  stats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/stats`);
  }

  activities(filters: ActivityFilters = {}): Observable<Activity[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params = params.set(key, value);
    }
    return this.http.get<Activity[]>(`${this.base}/activities`, { params });
  }

  activity(slug: string): Observable<ActivityDetail> {
    return this.http.get<ActivityDetail>(`${this.base}/activities/${slug}`);
  }

  board(): Observable<BoardMember[]> {
    return this.http.get<BoardMember[]>(`${this.base}/board`);
  }

  news(): Observable<News[]> {
    return this.http.get<News[]>(`${this.base}/news`);
  }

  contact(form: ContactForm): Observable<Message> {
    return this.http.post<Message>(`${this.base}/contact`, form);
  }

  // Comptes
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${this.base}/auth/login`, credentials);
  }

  adhesion(form: AdhesionForm): Observable<Message> {
    return this.http.post<Message>(`${this.base}/auth/adhesion`, form);
  }

  me(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.base}/auth/me`);
  }

  // Membre
  reserve(slug: string): Observable<Message & { registration: Registration }> {
    return this.http.post<Message & { registration: Registration }>(
      `${this.base}/activities/${slug}/reservations`,
      {},
    );
  }

  cancelReservation(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.base}/me/reservations/${id}`);
  }

  dashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.base}/me/dashboard`);
  }

  // Bureau
  adminOverview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(`${this.base}/admin/overview`);
  }

  decideAdhesion(id: number, decision: 'ACTIVE' | 'REFUSED'): Observable<Message> {
    return this.http.patch<Message>(`${this.base}/admin/adhesions/${id}`, { decision });
  }

  setPayment(userId: number, status: PaymentStatus): Observable<Message> {
    return this.http.patch<Message>(`${this.base}/admin/payments/${userId}`, { status });
  }
}
