import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Idea } from "../../models/idea.model.app";

import { IdeasService } from "../../services/ideas.service";

@Component({
    selector: "user-ideas",
    templateUrl: "./user-ideas.component.html",
    styles: [ require("./user-ideas.component.css").toString() ]
})
export class UserIdeasComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private ideasService: IdeasService) {

    }

    ngOnInit(): void {

    }

}