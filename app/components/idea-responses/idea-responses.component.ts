import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { IdeaService } from "../../services/idea.service";

@Component({
    selector: "idea-responses",
    templateUrl: "./idea-responses.component.html",
    styles: [ require("./idea-responses.component.css").toString() ]
})
export class IdeaResponsesComponent implements OnInit {

    private title: string = "";

    private likes: User[] = [];
    private likesMessage: string = "Loading...";
    private comments: User[] = [];
    private commentsMessage: string = "Loading...";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideaService: IdeaService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let ideaId = params["id"];

            this.ideaService.getTitle(ideaId)
                .subscribe((json: any) => {
                    this.title = json.fail || json.title;
                });

            this.ideaService.getLikes(ideaId)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.likesMessage = json.fail;
                    } else {
                        this.pushLikes(json);
                        if (this.likes.length === 0) {
                            this.likesMessage = "There are no likes for this idea.";
                        } else {
                            this.likesMessage = "";
                        }
                    }
                });

            this.ideaService.getComments(ideaId)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.commentsMessage = json.fail;
                    } else {
                        this.pushComments(json);
                        if (this.comments.length === 0) {
                            this.commentsMessage = "There are no comments for this idea.";
                        } else {
                            this.commentsMessage = "";
                        }
                    }
                });
        });
    }

    private pushLikes(json: any): void {
        json.list.map((item: any) => {
            this.likes.push(new User(item.id, "", "user", 
                item.name, "", item.profilePic, 
                new Date(0), new Date(0), new Date(item.timestamp)));
        });
    }

    private pushComments(json: any): void {
        json.list.map((item: any) => {
            let user: User = new User(item.author.id, "", "user", 
                item.author.name, "", item.author.profilePic, 
                new Date(0), new Date(0), new Date(item.comment.timestamp));
            (user as any).comment = item.comment.text;
            this.comments.push(user);
        });
    }

}