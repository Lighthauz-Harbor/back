import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Idea } from "../../models/idea.model.app";
import { User } from "../../models/user.model.app";

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
        });
    }

    private pushLikes(json: any): void {
        json.list.map((like: any) => {
            this.likes.push({
                user: {
                    id: like.id,
                    name: like.name,
                    profilePic: like.profilePic
                },
                timestamp: new Date(like.timestamp)
            });
        });
    }

}