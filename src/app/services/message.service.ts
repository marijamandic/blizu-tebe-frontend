import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

    private apiUrl = `${environment.apiHost}Message`;

    constructor(private http: HttpClient) {}

    create(request: any): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, request);
    }

    getAllFromChat(id: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/chat/${id}`);
    }
}