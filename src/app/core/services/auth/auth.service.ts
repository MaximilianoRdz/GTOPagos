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

  setSession(token: string, user: AuthUser, refreshToken?: string) {
    localStorage.setItem('access_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    this.user.set(user);
  }

  clearSession() {
    localStorage.removeItem('access_token');
    this.user.set(null);
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
}