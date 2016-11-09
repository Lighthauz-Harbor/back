import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: "lh-header",
    templateUrl: "./header.component.html",
    styles: [ 
        require("./header.component.css").toString()
    ]
})
export class HeaderComponent implements OnInit {

    private isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService) {

        this.authService.isLoggedInObservable().subscribe((val: boolean) => {
            this.isLoggedIn = val;
        });
    }

    ngOnInit(): void {
    }

    logout(): void {
        this.authService.logout();

        this.isLoggedIn = false;
        this.router.navigate(["/login"]);
    }
}