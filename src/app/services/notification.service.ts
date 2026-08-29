import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/env/environment";
import { Notification } from "../model/notification.model";

@Injectable({
    providedIn: 'root'
})
export class NotificationService{
    
    private apiUrl = `${environment.apiHost}Notification`;

    constructor(private http: HttpClient){}

    create(notification: any): Observable<Notification> {
        return this.http.post<Notification>(this.apiUrl, notification);
    }
    
    markAsRead(id: number): Observable<Notification> {
        return this.http.put<Notification>(`${this.apiUrl}/${id}`, {id: id, isRead: true});
    }

    getByUser(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
    }

    getById(id: number): Observable<Notification> {
        return this.http.get<Notification>(`${this.apiUrl}/${id}`);
    }
}