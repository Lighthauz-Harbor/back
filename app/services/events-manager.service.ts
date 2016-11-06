import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class GlobalEventsManager {
    public loggedInEmitter: EventEmitter<any> = new EventEmitter();

    constructor() {

    }
}