import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { IdeaService } from "../../services/idea.service";

@Component({
    selector: "idea-partners",
    templateUrl: "./idea-partners.component.html",
    styles: [ require("./idea-partners.component.css").toString() ]
})
export class IdeaPartnersComponent implements OnInit {

    private title: string = "";
    private partners: User[] = [];
    private message: string = "Loading...";

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

            this.ideaService.getPartners(ideaId)
                .subscribe((json: any) => {

                    if (json.fail) {
                        this.message = json.fail;
                    } else {
                        this.pushPartners(json);
                        if (this.partners.length === 0) {
                            this.message = "There are no partners collaborating on this idea.";
                        } else {
                            this.message = "";
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