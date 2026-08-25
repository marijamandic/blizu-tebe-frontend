import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Chat } from '../model/chat.mode';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private apiUrl = `${environment.apiHost}Chat`;

    constructor(private http: HttpClient) {}

    create(request: any): Observable<Chat> {
        return this.http.post<Chat>(this.apiUrl, request);
    }

    update(formData: FormData): Observable<Chat> {
        return this.http.put<Chat>(this.apiUrl, formData);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getById(id: number): Observable<Chat> {
        return this.http.get<Chat>(`${this.apiUrl}/${id}`);
    }

    getAllForUser(userId: number): Observable<Chat[]> {
        return this.http.get<Chat[]>(`${this.apiUrl}/user/${userId}`);
    }

    getByUsers(user1Id: number, user2Id: number, postId: number): Observable<Chat> {
        return this.http.get<Chat>(
            `${this.apiUrl}/users?user1Id=${user1Id}&user2Id=${user2Id}&postId=${postId}`
        );
    }

    getOrCreate(user1Id: number, user2Id: number, postId: number): Observable<Chat> {
        return this.http.post<Chat>(
            `${this.apiUrl}/get-or-create?user1Id=${user1Id}&user2Id=${user2Id}&postId=${postId}`,
            {}
        );
    }
}