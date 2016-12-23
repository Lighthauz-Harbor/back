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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideasService: IdeasService) {

    }

    ngOnInit(): void {
        
    }

}