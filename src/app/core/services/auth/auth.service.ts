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

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        this.user.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
  }

  /* ================= TOKEN ================= */

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get isDemo(): boolean {
    return localStorage.getItem('is_demo') === 'true' || this.user()?.email === 'demo@gtopagos.com';
  }

  setSession(token: string, user: AuthUser, refreshToken?: string, isDemo?: boolean) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
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
    localStorage.removeItem('auth_user');
    localStorage.removeItem('is_demo');
    this.user.set(null);
  }

  updateUser(partialUser: Partial<AuthUser>) {
    const current = this.user();
    if (current) {
      const updated = { ...current, ...partialUser };
      this.user.set(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
    } else if (partialUser.name && partialUser.email && partialUser.id) {
      const updated = partialUser as AuthUser;
      this.user.set(updated);
      localStorage.setItem('auth_user', JSON.stringify(updated));
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
          const userObj: AuthUser = {
            id: res.user_id,
            name: res.user.name,
            email: res.user.email,
          };
          this.user.set(userObj);
          localStorage.setItem('auth_user', JSON.stringify(userObj));
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
