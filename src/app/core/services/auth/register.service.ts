import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  salary: number;
  currency_id: number;
  income_frequency: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    name: string;
    email: string;
    salary: number;
    currency: string;
    income_frequency: string;
  };
  access_token: string;
}

export interface Currency {
  id: number;
  name: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  postRegister(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register/`, data);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrl}/currencies/`);
  }

}
