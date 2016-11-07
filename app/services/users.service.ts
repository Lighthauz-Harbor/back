import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs";

import { User } from "../models/user.model.app";

@Injectable()
export class UsersService {

    constructor(private http: Http) {

    }

    getList(): Observable<any> {
        return this.http.get("/api/users/list")
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