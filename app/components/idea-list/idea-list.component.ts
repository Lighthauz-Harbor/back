import { Component, OnInit } from "@angular/core";

import { Idea } from "../../models/idea.model.app";

import { IdeaService } from "../../services/idea.service";

@Component({
    selector: "idea-list",
    templateUrl: "idea-list.component.html",
    styles: [ require("./idea-list.component.css").toString() ]
})
export class IdeaListComponent implements OnInit {

    private list: Idea[] = [];
    private toggleAll: boolean = false;
    private message: string = "";

    constructor(private ideaService: IdeaService) {

    }

    ngOnInit(): void {
        this.loadIdeasList();
    }

    private loadIdeasList(): void {
        // renew list every load
        this.list = [];

        this.ideaService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "No ideas have been created, yet.";
            } else {
                // load the ideas into the list
                json.results.map((result: any) => {
                    let idea: Idea = new Idea(result.id, {
                            title: result.title,
                            description: result.description
                        },
                        {},
                        {},
                        "",
                        result.lastChanged);
                    (idea as any).author = result.author;
                    this.list.push(idea);
                });
            }
        });
    }

    search(term: string): void {
        if (term === "") this.loadIdeasList();
        else this.loadIdeasListByTerm(term);
    }

    private loadIdeasListByTerm(term: string): void {
        // renew list every load
        this.list = [];

        this.ideaService.searchIdea(term)
            .subscribe((result: any) => {
                if (result.fail) {
                    this.message = result.fail;
                } else if (result.results.length === 0) {
                    this.message = "Idea not found. Please try again.";
                } else {
                    result.results.map((i: any) => {
                        this.list.push(
                            new Idea(i.id, {
                                title: i.title,
                                description: i.description
                            }, 
                            {}, 
                            {},
                            "", 
                            i.lastChanged));
                    });
                }
            });
    }

    toggleAllIdeas(): void {
        this.toggleAll = !this.toggleAll;
        this.list.map((row) => {
            row.selected = this.toggleAll;
        });
    }

    cancelToggleAll(): void {
        this.toggleAll = false;
    }

    deleteSelectedIdeas(): void {
        let selectedIds = this.list.filter((row) => {
            return row.selected;
        }).map((idea) => {
            return idea.id;
        });

        if (selectedIds.length === 0) {
            alert("Please select the ideas to delete first!");
        } else {
            this.ideaService.deleteIdeas(selectedIds)
                .subscribe((json: any) => {
                    alert(json.message);
                    this.loadIdeasList();
                });
        }
    }
}