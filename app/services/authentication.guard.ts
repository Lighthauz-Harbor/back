import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { Observable } from "rxjs";

import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {

    private isLoggedIn: boolean;

    constructor(
        private router: Router,
        private authService: AuthenticationService) {

        this.authService.isLoggedInObservable().subscribe((val) => {
            this.isLoggedIn = val;
            if (!val) this.router.navigate(["/login"]);
        });
    }

    canActivate() {
        return this.isLoggedIn;
    }
}