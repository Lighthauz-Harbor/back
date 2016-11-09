import { Component } from "@angular/core";

import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: "admin-app",
    templateUrl: "./app.component.html",
    styles: [ 
        require("./app.component.css").toString()
    ]
})
export class AppComponent {

    private isLoggedIn: boolean;

    constructor(private authService: AuthenticationService) {
        this.authService.isLoggedInObservable().subscribe((val) => {
            this.isLoggedIn = val;
        });
    }

}