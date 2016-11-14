import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable } from "rxjs";

import { User } from "../models/user.model.app";

@Injectable()
export class UsersService {

    constructor(private http: Http) {

    }

    createUser(details: any): Observable<any> {
        return this.http.post("/api/users/create", details)
            .map((res: Response) => {
                return res.text();
            });
    }

    getList(): Observable<any> {
        return this.http.get("/api/users/list")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getSingleUser(username: string): Observable<any> {
        return this.http.get("/api/users/get/" + username)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    searchUser(term: string): Observable<any> {
        if (!term || term === "") {
            return Observable.of<User[]>([]);
        }

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

}