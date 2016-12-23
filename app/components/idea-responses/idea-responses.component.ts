import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { IdeasService } from "../../services/ideas.service";

@Component({
    selector: "idea-responses",
    templateUrl: "./idea-responses.component.html",
    styles: [ require("./idea-responses.component.css").toString() ]
})
export class IdeaResponsesComponent implements OnInit {

    private likes: any[] = [];
    private likesMessage: string = "Loading...";
    private comments: any[] = [];
    private commentsMessage: string = "Loading...";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideasService: IdeasService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let ideaId = params["id"];

            this.ideasService.getLikes(ideaId)
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

            this.ideasService.getComments(ideaId)
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
            this.likes.push({
                user: {
                    id: item.id,
                    name: item.name,
                    profilePic: item.profilePic
                },
                timestamp: new Date(item.timestamp)
            });
        });
    }

    private pushComments(json: any): void {
        json.list.map((item: any) => {
            this.comments.push({
                user: {
                    id: item.author.id,
                    name: item.author.name,
                    profilePic: item.author.profilePic
                },
                comment: {
                    text: item.comment.text,
                    timestamp: new Date(item.comment.timestamp)
                }
            });
        });
    }

}