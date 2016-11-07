import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";
import { UsersService } from "../../services/users.service";

@Component({
    selector: "users-list",
    templateUrl: "./users-list.component.html",
    styles: [ require("./users-list.component.css").toString() ]
})
export class UsersListComponent implements OnInit {

    private list: User[];

    constructor(
        private router: Router,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.list = this.usersService.getList();
    }
}