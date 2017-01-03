import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Idea} from "../../models/idea.model.app";
import {User} from "../../models/user.model.app";
import {IdeaService} from "../../services/idea.service";

@Component({
    selector: "idea-details",
    templateUrl: "./idea-details.component.html",
    styles: [ require("./idea-details.component.css").toString() ]
})
export class IdeaDetailsComponent implements OnInit {

    private idea: Idea = new Idea();
    private author: User = new User();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideaService: IdeaService) {

        // loading animation before image is loaded
        this.idea.pic = 
            "https://res.cloudinary.com/lighthauz-harbor/image/upload/v1482734274/hourglass.gif";

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.ideaService.getSingleIdea(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/ideas"]);
                    } else {
                        let extraLink = json.idea.extraLink;
                        if (extraLink != "" && 
                            !extraLink.includes("http://") && !extraLink.includes("https://")) {
                            extraLink = "http://" + extraLink;
                        }

                        let {title, pic, description, background, problem, solution} = json.idea;
                        let {valueProposition, customerSegments, customerRelationships, 
                            channels, keyActivities, keyResources, keyPartners, 
                            costStructure, revenueStreams} = json.idea;
                        let {strengths, weaknesses, opportunities, threats} = json.idea;

                        this.idea = new Idea(id, 
                            {
                                visibility: json.visibility,
                                title, pic, description, background,
                                problem, solution, extraLink
                            },
                            {
                                valueProposition, customerSegments, customerRelationships,
                                channels, keyActivities, keyResources, keyPartners,
                                costStructure, revenueStreams
                            },
                            {
                                strengths, weaknesses, opportunities, threats
                            },
                            json.category,
                            new Date(json.timestamp));
                        
                        this.author = new User(
                            json.author.id, 
                            json.author.email,
                            "user",
                            json.author.name,
                            json.author.bio);
                    }
                });
        });
    }

}