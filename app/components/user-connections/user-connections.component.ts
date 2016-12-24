import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";
import { UsersService } from "../../services/users.service";

@Component({
    selector: "user-connections",
    templateUrl: "./user-connections.component.html",
    styles: [ require("./user-connections.component.css").toString() ]
})
export class UserConnectionsComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UsersService) {

    }

    ngOnInit(): void {

    }

}