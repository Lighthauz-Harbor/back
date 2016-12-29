import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Idea} from "../../models/idea.model.app";
import {UserService} from "../../services/user.service";
import {IdeaService} from "../../services/idea.service";

@Component({
    selector: "user-ideas",
    templateUrl: "./user-ideas.component.html",
    styles: [ require("./user-ideas.component.css").toString() ]
})
export class UserIdeasComponent implements OnInit {

    private name: string = "";
    private ideas: Idea[] = [];
    private message: string = "Loading...";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private ideaService: IdeaService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let userId = params["id"];
            this.userService.getName(userId)
                .subscribe((json: any) => {
                    this.name = json.fail || json.name;
                });
            this.ideaService.getIdeaListFromUser(userId)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.message = json.fail;
                    } else {
                        this.pushIdeas(json);
                        if (this.ideas.length === 0) {
                            this.message = "The user has not created any ideas.";
                        } else {
                            this.message = "";
                        }
                    }
                });
        });
    }

    private pushIdeas(json: any): void {
        json.ideas.map((item: any) => {
            this.ideas.push(
                new Idea(
                    item.id, 
                    {
                        title: item.title,
                        description: item.description,
                        pic: item.pic
                    }, {}, {},
                    item.category, new Date(item.timestamp)));
            });
    }

}