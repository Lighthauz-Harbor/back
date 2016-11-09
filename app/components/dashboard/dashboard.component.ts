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
    constructor(
        private router: Router,
        private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        //
    }
}