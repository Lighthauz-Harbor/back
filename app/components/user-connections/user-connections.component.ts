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

    private connections: User[] = [];
    private message: string = "Loading...";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.usersService.getConnections(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.message = json.fail;
                    } else {
                        this.pushConnections(json);
                        if (this.connections.length === 0) {
                            this.message = "This user has no connections, yet.";
                        } else {
                            this.message = "This user has some connections, though. :D";
                        }
                    }
                });
        });
    }

    private pushConnections(json: any): void {
        json.connections.map((item: any) => {
            this.connections.push(
                new User(
                    item.id, item.email, "user", 
                    item.name, item.bio, item.profilePic,
                    new Date(0), new Date(0), new Date(item.timestamp)));
        });
    }

}