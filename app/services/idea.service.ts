import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class IdeaService {

    constructor(private http: Http) {

    }

    createIdea(details: any): Observable<any> {
        return this.http.post("/api/ideas/create", details)
            .map(this.parseJSON);
    }

    getList(): Observable<any> {
        return this.http.get("/api/ideas/list")
            .map(this.parseJSON);
    }

    getSingleIdea(id: string): Observable<any> {
        return this.http.get(`/api/ideas/get/${id}`)
            .map(this.parseJSON);
    }

    getTitle(id: string): Observable<any> {
        return this.http.get(`/api/ideas/title/${id}`)
            .map(this.parseJSON);
    }

    searchIdea(term: string): Observable<any> {
        return this.http.get(`/api/ideas/search/${term}`)
            .map(this.parseJSON);
    }

    updateIdea(details: any): Observable<any> {
        return this.http.put(
            `/api/ideas/update/${details.id}`,
            details)
            .map(this.parseJSON);
    }

    deleteIdeas(ids: string[]): Observable<any> {
        return this.http.post("/api/ideas/delete", 
            { ids })
            .map(this.parseJSON);
    }

    getTotalIdeasCount(): Observable<any> {
        return this.http.get("/api/ideas/total-ideas")
            .map(this.parseJSON);
    }

    getTodayCount(): Observable<any> {
        return this.http.get("/api/ideas/today/count")
            .map(this.parseJSON);
    }

    getLikes(ideaId: string): Observable<any> {
        return this.http.get(`/api/like/list/${ideaId}`)
            .map(this.parseJSON);
    }

    getComments(ideaId: string): Observable<any> {
        return this.http.get(`/api/comment/list/${ideaId}`)
            .map(this.parseJSON);
    }

    getPartners(ideaId: string): Observable<any> {
        return this.http.get(`/api/ideas/partners/${ideaId}`)
            .map(this.parseJSON);
    }

    getIdeaListFromUser(userId: string): Observable<any> {
        return this.http.get(`/api/ideas/list/${userId}`)
            .map(this.parseJSON);
    }

    private parseJSON(res: Response): Object {
        return JSON.parse(res.text());
    }
}