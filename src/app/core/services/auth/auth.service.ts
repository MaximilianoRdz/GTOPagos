import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // 🔹 Estado global del usuario
  user = signal<AuthUser | null>(null);
  loading = signal<boolean>(true);

  constructor(private http: HttpClient) {}

  /* ================= TOKEN ================= */

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get isDemo(): boolean {
    return localStorage.getItem('is_demo') === 'true' || this.user()?.email === 'demo@gtopagos.com';
  }

  setSession(token: string, user: AuthUser, refreshToken?: string, isDemo?: boolean) {
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    if (isDemo || user.email === 'demo@gtopagos.com') {
      localStorage.setItem('is_demo', 'true');
    } else {
      localStorage.removeItem('is_demo');
    }
    this.user.set(user);
  }

  clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_demo');
    this.user.set(null);
  }

  updateUser(partialUser: Partial<AuthUser>) {
    const current = this.user();
    if (current) {
      this.user.set({ ...current, ...partialUser });
    } else if (partialUser.name && partialUser.email && partialUser.id) {
      this.user.set(partialUser as AuthUser);
    }
  }

  /* ================= AUTH ================= */

  isAuthenticated(): boolean {
    return !!this.token;
  }

  /* ================= VALIDATE TOKEN ================= */

  validateToken(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http
      .post(`${this.apiUrl}/token/validate/`, {}, { headers })
      .pipe(
        tap((res: any) => {
          this.user.set({
            id: res.user_id,
            name: res.user.name,
            email: res.user.email,
          });
          this.loading.set(false);
        })
      );
  }

  /* ================= PASSWORD RESET ================= */

  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password/`, { email });
  }

  confirmPasswordReset(data: {
    uid: string;
    token: string;
    new_password: string;
    confirm_password: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password/`, data);
  }
}