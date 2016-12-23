import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { IdeasService } from "../../services/ideas.service";

@Component({
    selector: "idea-partners",
    templateUrl: "./idea-partners.component.html",
    styles: [ require("./idea-partners.component.css").toString() ]
})
export class IdeaPartnersComponent implements OnInit {

    private partners: User[] = [];
    private partnersMessage: string = "Loading...";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideasService: IdeasService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let ideaId = params["id"];
            this.ideasService.getPartners(ideaId)
                .subscribe((json: any) => {

                    if (json.fail) {
                        this.partnersMessage = json.fail;
                    } else {
                        this.pushPartners(json);
                        if (this.partners.length === 0) {
                            this.partnersMessage = "There are no partners collaborating on this idea.";
                        } else {
                            this.partnersMessage = "";
                        }
                    }
            });
        });
    }

    private pushPartners(json: any): void {
        json.partners.map((item: any) => {
            this.partners.push(
                new User(item.id, item.username, "user", 
                    item.name, item.bio, item.profilePic));
        });
    }

}