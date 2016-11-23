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

    getRecent(): Observable<any> {
        return this.http.get("/api/reports/recent")
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

    replyToReport(id: string, reply: string, solved: boolean): Observable<any> {
        return this.http.put(("/api/reports/reply/" + id), 
            { reply, solved })
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

}