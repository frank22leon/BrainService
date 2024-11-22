import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7159/api';// Cambia la URL según corresponda

  constructor(private http: HttpClient) {}

  createTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Tickets/CreateTicket`, ticketData);
  }
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Tickets/GetCategories`);
  }

  getTicketsByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/ViewTicketsByUser/${userId}`);
  }
}
