import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";
import { AuthenticationService } from "../../services/authentication.service";
import { GlobalEventsManager } from "../../services/events-manager.service";

@Component({
    selector: "lh-login",
    templateUrl: "./login.component.html",
    styles: [
        require("./login.component.css").toString()
    ]
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading: boolean = false;
    message: string = "";

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private eventsManager: GlobalEventsManager) {

    }

    ngOnInit(): void {
        this.authService.logout().subscribe(result => {
            this.eventsManager.showNavBar.emit(false);
        });
    }

    onSubmitLogin(): void {
        this.loading = true;

        this.authService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result.fail) {
                    // TODO redirect/navigate to login screen again
                    this.message = result.fail; // set message
                    this.loading = false; // re-enable the login button
                    this.router.navigate(["/login"]);
                } else {
                    // TODO navigate to dashboard
                    this.message = "";
                    this.eventsManager.showNavBar.emit(true);
                    this.router.navigate(["/dashboard"]);
                }
            });
    }

    get diagnostic(): string {
        return JSON.stringify(this.model);
    }
}