import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class UsersService {

    constructor(private http: Http) {

    }

    createUser(details: any): Observable<any> {
        return this.http.post("/api/users/create", details)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getList(): Observable<any> {
        return this.http.get("/api/users/list")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getSingleUser(id: string): Observable<any> {
        return this.http.get("/api/users/get/id/" + id)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    searchUser(term: string): Observable<any> {
        return this.http.get("/api/users/search/" + term)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    updateUser(details: any): Observable<any> {
        return this.http.put(
            "/api/users/update/" + details.oldUsername, 
            details)
                .map((res: Response) => {
                    return JSON.parse(res.text());
                });
    }

    deleteUsers(usernames: string[]): Observable<any> {
        return this.http.post("/api/users/delete",
            { usernames })
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    } 

    getTotalUsersCount(): Observable<any> {
        return this.http.get("/api/users/total-users")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getUserActivityCount(): Observable<any> {
        return this.http.get("/api/users/activity-count")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

}