import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface Goal {
  id?: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private apiUrl = `${environment.apiUrl}/goals/`;

  constructor(private http: HttpClient) {}

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  getGoal(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}${id}/`);
  }

  createGoal(goal: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, goal);
  }

  updateGoal(id: number, goal: Partial<Goal>): Observable<Goal> {
    return this.http.patch<Goal>(`${this.apiUrl}${id}/`, goal);
  }

  deleteGoal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
