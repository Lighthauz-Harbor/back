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

    getSingleIdea(id: string): Observable<any> {
        return this.http.get("/api/ideas/get/" + id)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getTitle(id: string): Observable<any> {
        return this.http.get("/api/ideas/title/" + id)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    searchIdea(term: string): Observable<any> {
        return this.http.get("/api/ideas/search/" + term)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    updateIdea(details: any): Observable<any> {
        return this.http.put(
            "/api/ideas/update/" + details.id,
            details)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    deleteIdeas(ids: string[]): Observable<any> {
        return this.http.post("/api/ideas/delete", 
            { ids })
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getTotalIdeasCount(): Observable<any> {
        return this.http.get("/api/ideas/total-ideas")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getTodayCount(): Observable<any> {
        return this.http.get("/api/ideas/today/count")
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getLikes(ideaId: string): Observable<any> {
        return this.http.get("/api/like/list/" + ideaId)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getComments(ideaId: string): Observable<any> {
        return this.http.get("/api/comment/list/" + ideaId)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getPartners(ideaId: string): Observable<any> {
        return this.http.get("/api/ideas/partners/" + ideaId)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }

    getIdeaListFromUser(userId: string): Observable<any> {
        return this.http.get("/api/ideas/list/" + userId)
            .map((res: Response) => {
                return JSON.parse(res.text());
            });
    }
}