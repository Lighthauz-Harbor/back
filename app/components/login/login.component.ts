import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: "lh-login",
    templateUrl: "./login.component.html",
    styles: [
        require("./login.component.css").toString()
    ]
})
export class LoginComponent implements OnInit {
    private model: any = {};
    private loading: boolean = false;
    private message: string = "";

    constructor(
        private router: Router,
        private authService: AuthenticationService) {

    }

    ngOnInit(): void {
        this.authService.logout().subscribe(result => {
            //
        });
    }

    onSubmitLogin(): void {
        this.loading = true;

        this.authService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result.fail) {
                    this.message = result.fail; // set message
                    this.loading = false; // re-enable the login button
                    this.router.navigate(["/login"]);
                } else {
                    this.message = "";
                    // this.authService.isLoggedInObservable();
                    this.router.navigate(["/dashboard"]);
                }
            });
    }
}