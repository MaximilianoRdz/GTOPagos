import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
}

export interface IncomeFrequency {
  id: number;
  code: string;
  name: string;
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  salary: number | null;
  currency: Currency | null;
  income_frequency: IncomeFrequency | null;
  phone?: string;
  notification_method?: string;
  budget_alerts?: boolean;
  goal_reminders?: boolean;
  weekly_reports?: boolean;
  monthly_reports?: boolean;
  transaction_alerts?: boolean;
  payment_reminders?: boolean;
  [key: string]: any;
}

export interface UserProfilePayload {
  first_name?: string;
  last_name?: string;
  salary?: number | null;
  currency_id?: number | null;
  income_frequency_id?: number | null;
  phone?: string;
  notification_method?: string;
  budget_alerts?: boolean;
  goal_reminders?: boolean;
  weekly_reports?: boolean;
  monthly_reports?: boolean;
  transaction_alerts?: boolean;
  payment_reminders?: boolean;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})

export class ConfigurationService {
  private readonly baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private currencies$?: Observable<Currency[]>;
  private incomeFrequencies$?: Observable<IncomeFrequency[]>;

  /* ====== Catalogs ====== */
  getCurrencies(): Observable<Currency[]> {
    if (!this.currencies$) {
      this.currencies$ = this.http.get<Currency[]>(`${this.baseUrl}/currencies/`).pipe(shareReplay(1));
    }
    return this.currencies$;
  }

  getIncomeFrequencies(): Observable<IncomeFrequency[]> {
    if (!this.incomeFrequencies$) {
      this.incomeFrequencies$ = this.http.get<IncomeFrequency[]>(
        `${this.baseUrl}/income-frequencies/`
      ).pipe(shareReplay(1));
    }
    return this.incomeFrequencies$;
  }

  /* ====== Profile ====== */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.baseUrl}/profile/`
    );
  }

  updateProfile(data: UserProfilePayload): Observable<UserProfile> {
    return this.http.patch<UserProfile>(
      `${this.baseUrl}/profile/`,
      data
    );
  }

  changePassword(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
  }){
    return this.http.post(
      `${this.baseUrl}/change-password/`,
      payload
    );
  }


}