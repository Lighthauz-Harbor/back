import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "users-list",
    templateUrl: "./users-list.component.html",
    styles: [ require("./users-list.component.css").toString() ]
})
export class UsersListComponent implements OnInit {

    constructor(
        private router: Router) {

    }

    ngOnInit(): void {

    }
}