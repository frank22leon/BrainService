import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7159/api'; // Cambia la URL según corresponda

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

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/ViewTickets`);
  }

  assignUserToTicket(ticketId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Tickets/AssignUserToTicket`, {
      ticketId,
      assignedUserId: userId
    });
  }

  updateTicketPriority(ticketId: number, priorityId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Tickets/UpdateTicketPriority`, {
      ticketId,
      priorityId
    });
  }

  getPriorities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/GetPriorities`);
  }
  
  getAssignableUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/GetAssignableUsers`);
  }

  resolveTicket(ticketId: number, resolutionMessage: string): Observable<any> {
    return this.http.put(`/api/Tickets/UpdateResolutionMessage`, {
      ticketId,
      resolutionMessage
    });
  }
  
  getAssignedTickets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Tickets/AssignedTickets/${userId}`);
  }
  
  
}
