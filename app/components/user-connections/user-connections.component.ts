import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {User} from "../../models/user.model.app";
import {UserService} from "../../services/user.service";

@Component({
    selector: "user-connections",
    templateUrl: "./user-connections.component.html",
    styles: [ require("./user-connections.component.css").toString() ]
})
export class UserConnectionsComponent implements OnInit {

    private name: string = "";
    private connections: User[] = [];
    private message: string = "Loading...";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UserService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.usersService.getName(id)
                .subscribe((json: any) => {
                    this.name = json.fail || json.name;
                });
            this.usersService.getConnections(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.message = json.fail;
                    } else {
                        this.pushConnections(json);
                        if (this.connections.length === 0) {
                            this.message = "This user has no connections, yet.";
                        } else {
                            this.message = "";
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