import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class UserService {

    constructor(private http: Http) {

    }

    createUser(details: any): Observable<any> {
        return this.http.post("/api/users/create", details)
            .map(this.parseJSON);
    }

    getList(): Observable<any> {
        return this.http.get("/api/users/list")
            .map(this.parseJSON);
    }

    getSingleUser(id: string): Observable<any> {
        return this.http.get(`/api/users/get/${id}`)
            .map(this.parseJSON);
    }

    getName(id: string): Observable<any> {
        return this.http.get(`/api/users/name/${id}`)
            .map(this.parseJSON);
    }

    searchUser(term: string): Observable<any> {
        return this.http.get(`/api/users/search/${term}`)
            .map(this.parseJSON);
    }

    updateUser(details: any): Observable<any> {
        return this.http.put(
            `/api/users/update/${details.oldUsername}`, 
            details)
                .map(this.parseJSON);
    }

    deleteUsers(ids: string[]): Observable<any> {
        return this.http.post("/api/users/delete",
            { ids })
            .map(this.parseJSON);
    } 

    getTotalUsersCount(): Observable<any> {
        return this.http.get("/api/users/total-users")
            .map(this.parseJSON);
    }

    getUserActivityCount(): Observable<any> {
        return this.http.get("/api/users/activity-count")
            .map(this.parseJSON);
    }

    listPreferredCategories(userId: string): Observable<any> {
        return this.http.post("/api/category/prefer/list",
            { userId })
            .map(this.parseJSON);
    }

    getConnections(userId: string): Observable<any> {
        return this.http.get(`/api/connections/${userId}`)
            .map(this.parseJSON);
    }

    getSentConnectionRequests(userId: string): Observable<any> {
        return this.http.get(`/api/connections/requests/sent/${userId}`)
            .map(this.parseJSON);
    }

    getReceivedConnectionRequests(userId: string): Observable<any> {
        return this.http.get(`/api/connections/requests/received/${userId}`)
            .map(this.parseJSON);
    }

    deactivateUser(id: string, reason: string): Observable<any> {
        return this.http.post("/user/auth/deactivate",
            { id, reason })
            .map(this.parseJSON);
    }

    reactivateUser(id: string, reason: string): Observable<any> {
        return this.http.post("/user/auth/reactivate",
            { id, reason })
            .map(this.parseJSON);
    }

    isDeactivatedUser(id: string): Observable<any> {
        return this.http.get(`/user/auth/is-blocked/${id}`)
            .map(this.parseJSON);
    }

    private parseJSON(res: Response): Object {
        return JSON.parse(res.text());
    }

}