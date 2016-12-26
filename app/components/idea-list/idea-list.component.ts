import {Component, OnInit} from "@angular/core";
import {Idea} from "../../models/idea.model.app";
import {IdeaService} from "../../services/idea.service";

@Component({
    selector: "idea-list",
    templateUrl: "idea-list.component.html",
    styles: [ require("./idea-list.component.css").toString() ]
})
export class IdeaListComponent implements OnInit {

    private list: Idea[] = [];
    private toggleAll: boolean = false;
    private message: string = "Loading...";

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
                json.results.map((record: any) => {
                    let idea: Idea = new Idea();
                    idea.id = record.idea.id;
                    idea.title = record.idea.title;
                    idea.description = record.idea.description;
                    idea.lastChanged = new Date(record.lastChanged);
                    (idea as any).author = record.author;
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
            .subscribe((json: any) => {
                if (json.fail) {
                    this.message = json.fail;
                } else if (json.results.length === 0) {
                    this.message = "Idea not found. Please try again.";
                } else {
                    json.results.map((record: any) => {
                        let idea: Idea = new Idea();
                        idea.id = record.idea.id;
                        idea.title = record.idea.title;
                        idea.description = record.idea.description;
                        idea.lastChanged = new Date(record.lastChanged);
                        (idea as any).author = record.author;
                        this.list.push(idea);
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