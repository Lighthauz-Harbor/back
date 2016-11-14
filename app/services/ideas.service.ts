import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class IdeasService {

    constructor(private http: Http) {

    }

    createIdea(details: any): Observable<any> {
        return this.http.post("/api/ideas/create", details)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getList(): Observable<any> {
        return this.http.get("/api/ideas/list")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }
}