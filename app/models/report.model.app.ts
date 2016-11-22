export class Report {

    private _id: string;
    private _title: string;
    private _author: string; // in the form of email
    private _message: string;
    private _reply: string;
    private _solved: boolean;
    private _type: string;
    private _createdAt: Date;

    constructor(
        id: string,
        title: string,
        author: string,
        message: string = "",
        reply: string = "",
        solved: boolean = false,
        type: string = "",
        createdAt: Date = new Date(0)) {

        this._id = id;
        this._title = title;
        this._author = author;
        this._message = message;
        this._reply = reply;
        this._solved = solved;
        this._type = type;
        this._createdAt = createdAt;
    }

    get id() {
        return this._id;
    }
    get title() {
        return this._title;
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
    get type() {
        return this._type;
    }
    get solved() {
        return this._solved;
    }

    set id(i: string) {
        this._id = i;
    }
    set title(t: string) {
        this._title = t;
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
    set type(t: string) {
        this._type = t;
    }
    set solved(s: boolean) {
        this._solved = s;
    }

}