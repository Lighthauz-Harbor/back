import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { UsersService } from "../../services/users.service";

@Component({
    selector: "user-requests",
    templateUrl: "./user-requests.component.html",
    styles: [ require("./user-requests.component.css").toString() ]
})
export class UserRequestsComponent implements OnInit {

    private requestsSent: User[] = [];
    private requestsSentMessage: string = "Loading...";
    private requestsReceived: User[] = [];
    private requestsReceivedMessage: string = "Loading...";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.usersService.getSentConnectionRequests(id)
                .subscribe((json: any) => {
                    this.pushRequestsSent(json);
                    if (this.requestsSent.length === 0) {
                        this.requestsSentMessage = 
                            "No requests were sent by this user, yet.";
                    } else {
                        this.requestsSentMessage = "";
                    }
                });
            this.usersService.getReceivedConnectionRequests(id)
                .subscribe((json: any) => {
                    this.pushRequestsReceived(json);
                    if (this.requestsReceived.length === 0) {
                        this.requestsReceivedMessage = 
                            "No requests were received by this user, yet.";
                    } else {
                        this.requestsReceivedMessage = "";
                    }
                });
        });
    }

    private pushRequestsSent(json: any): void {
        json.sentByUser.map((item: any) => {
            this.requestsSent.push(new User(item.id, item.username, "user",
                item.name, item.bio, item.profilePic,
                new Date(0), new Date(0), new Date(item.timestamp)));
        });
    }

    private pushRequestsReceived(json: any): void {
        json.receivedByUser.map((item: any) => {
            this.requestsReceived.push(new User(item.id, item.username, "user",
                item.name, item.bio, item.profilePic,
                new Date(0), new Date(0), new Date(item.timestamp)));
        });
    }

}