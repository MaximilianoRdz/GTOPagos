import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments';

export interface AgentActionResponse {
  success: boolean;
  thought: string;
  action_type: 'READ_ONLY' | 'MUTATION' | 'CALCULATION' | 'ALERT' | 'ADVICE';
  data: any;
  user_message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  thought?: string;
  data?: any;
  actionType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  sendMessage(query: string, context: Record<string, any> = {}): Observable<AgentActionResponse> {
    return this.http.post<AgentActionResponse>(`${this.apiUrl}/chat/`, {
      query,
      context
    });
  }

  getCapabilities(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capabilities/`);
  }

  sendMcpRpc(request: Record<string, any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mcp/`, request);
  }
}
