import { Component } from "@angular/core";

import { AuthenticationService } from "../../services/authentication.service";

@Component({
    selector: "not-found",
    templateUrl: "./not-found.component.html",
    styles: [ require("./not-found.component.css").toString() ]
})
export class PageNotFoundComponent {

    private isLoggedIn: boolean;

    constructor(private authService: AuthenticationService) {
        this.authService.isLoggedInObservable().subscribe((val) => {
            this.isLoggedIn = val;
        });
    }

}