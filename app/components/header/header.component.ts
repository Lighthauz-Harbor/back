import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import { GlobalEventsManager } from "../../services/events-manager.service";

@Component({
    selector: "lh-header",
    templateUrl: "./header.component.html",
    styles: [ 
        require("./header.component.css").toString()
    ]
})
export class HeaderComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private eventsManager: GlobalEventsManager) {

        this.eventsManager.showNavBar.subscribe((mode: any) => {
            this.isLoggedIn = !!mode;
        });
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authService.logout().subscribe(result => {
            this.eventsManager.showNavBar.emit(false);
        });

        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
    }
}