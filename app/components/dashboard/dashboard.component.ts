import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styles: [ require("./dashboard.component.css").toString() ]
})
export class DashboardComponent implements OnInit {
    user: User;
    isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();

        this.user = this.isLoggedIn ? 
            this.authService.getCurrentUser() : null;

        if (this.user == null) {
            this.router.navigate(["/login"]);
        }
    }
}