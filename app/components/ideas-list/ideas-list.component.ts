import { Component, OnInit } from "@angular/core";

import { Idea } from "../../models/idea.model.app";

import { IdeasService } from "../../services/ideas.service";

@Component({
    selector: "ideas-list",
    templateUrl: "./ideas-list.component.html",
    styles: [ require("./ideas-list.component.css").toString() ]
})
export class IdeasListComponent implements OnInit {

    private list: Idea[] = [];
    private message: string = "";

    constructor(private ideasService: IdeasService) {

    }

    ngOnInit(): void {
        this.loadIdeasList();
    }

    private loadIdeasList(): void {
        // renew list every load
        this.list = [];

        this.ideasService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "No ideas have been created, yet.";
            } else {
                // load the ideas into the list
                json.results.map((result: any) => {
                    this.list.push(
                        new Idea(result.id, {
                            title: result.title,
                            description: result.description
                        }, 
                        {}, 
                        {}, 
                        result.author, 
                        "", 
                        result.modifiedAt));
                });
            }
        });
    }
}