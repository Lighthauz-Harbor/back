import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class IdeasService {

    constructor(private http: Http) {

    }

    getList(): Observable<any> {
        return this.http.get("/api/ideas/list")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }
}