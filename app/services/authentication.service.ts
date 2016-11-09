import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

import { Observable, BehaviorSubject } from "rxjs";

import { User } from "../models/user.model.app";

import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {

    private _token: string;

    private _isLoggedInEvent: BehaviorSubject<boolean>;
    private _isLoggedInObservable: Observable<boolean>;

    constructor(private http: Http) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.token = currentUser && currentUser.token;

        this._isLoggedInEvent = new BehaviorSubject<boolean>(!!currentUser);
        this._isLoggedInObservable = this._isLoggedInEvent.asObservable();
    }

    get token(): string {
        return this._token;
    }

    set token(t: string) {
        this._token = t;
    }

    isLoggedInObservable(): Observable<boolean> {
        return this._isLoggedInObservable;
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post("/admin/auth/login", 
            { username, password })
            .map((res: Response) => {
                var json = JSON.parse(res.text());
                if (!json.fail) {
                    localStorage.setItem("currentUser", JSON.stringify(json));
                    this._isLoggedInEvent.next(true);
                    this._isLoggedInObservable = this._isLoggedInEvent.asObservable();
                }
                return json;
            });
    }

    logout(): Observable<any> {
        localStorage.removeItem("currentUser");
        return this.http.post("/admin/auth/logout", {}).map((res: Response) => {
            this._isLoggedInEvent.next(false);
            this._isLoggedInObservable = this._isLoggedInEvent.asObservable();
            return res;
        });
    }
}