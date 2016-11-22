import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class ReportsService {

    constructor(private http: Http) {

    }

    getList(): Observable<any> {
        return this.http.get("/api/reports/list")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getSingle(id: string): Observable<any> {
        return this.http.get("/api/reports/get/" + id)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

}