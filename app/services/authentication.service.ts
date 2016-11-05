import { Injectable } from "@angular/core";

import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";

import { User } from "../models/user.model.app";

import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {

    currentUser: User;

    constructor(private http: Http) {

    }

    isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    getCurrentUser(): any {
        return this.currentUser;
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post("/admin/auth/login", 
            { username, password })
            .map((res: Response) => {
                var json = JSON.parse(res.text());
                if (!json.fail) {
                    this.currentUser = new User(json.username, json.role);
                }
                return json;
            }
        );
    }

    logout(): Observable<any> {
        this.currentUser = null;
        return this.http.post("/admin/auth/logout", {}).map((res: Response) => {
            return res;
        });
    }
}