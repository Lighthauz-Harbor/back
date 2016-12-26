import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class ReportService {

    constructor(private http: Http) {

    }

    getList(): Observable<any> {
        return this.http.get("/api/reports/list")
            .map(this.parseJSON);
    }

    getRecent(): Observable<any> {
        return this.http.get("/api/reports/recent")
            .map(this.parseJSON);
    }

    getSingle(id: string): Observable<any> {
        return this.http.get(`/api/reports/get/${id}`)
            .map(this.parseJSON);
    }

    replyToReport(id: string, reply: string, solved: boolean): Observable<any> {
        return this.http.put(`/api/reports/reply/${id}`, 
            { reply, solved })
            .map(this.parseJSON);
    }

    private parseJSON(res: Response): Object {
        return JSON.parse(res.text());
    }

}