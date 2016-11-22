export class Report {

    private _reportId: string;
    private _author: string; // in the form of email
    private _message: string;
    private _reply: string;
    private _solved: boolean;
    private _createdAt: Date;

    constructor(
        reportId: string,
        message: string,
        author: string,
        createdAt: Date,
        reply: string = "",
        solved: boolean = false) {

        this._reportId = reportId;
        this._message = message;
        this._author = author;
        this._createdAt = createdAt;
        this._reply = reply;
        this._solved = solved;
    }

    get reportId() {
        return this._reportId;
    }
    get author() {
        return this._author;
    }
    get createdAt() {
        return this._createdAt;
    }
    get message() {
        return this._message;
    }
    get reply() {
        return this._reply;
    }
    get solved() {
        return this._solved;
    }

    set reportId(i: string) {
        this._reportId = i;
    }
    set author(a: string) {
        this._author = a;
    }
    set createdAt(c: Date) {
        this._createdAt = c;
    }
    set message(m: string) {
        this._message = m;
    }
    set reply(r: string) {
        this._reply = r;
    }
    set solved(s: boolean) {
        this._solved = s;
    }

}