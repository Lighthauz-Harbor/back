import { Component } from "@angular/core";
import { GlobalEventsManager } from "../services/events-manager.service";

@Component({
    selector: "admin-app",
    templateUrl: "./app.component.html",
    styles: [ 
        require("./app.component.css").toString()
    ]
})
export class AppComponent {

    private isLoggedIn: boolean;

    constructor(private eventsManager: GlobalEventsManager) {
        this.eventsManager.loggedInEmitter.subscribe((mode: any) => {
            this.isLoggedIn = !!mode;
        });
    }

}