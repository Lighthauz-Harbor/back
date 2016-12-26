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
                        this.idea = new Idea(id, 
                            {
                                visibility: json.visibility,
                                title: json.idea.title,
                                pic: json.idea.pic,
                                description: json.idea.description,
                                background: json.idea.background,
                                problem: json.idea.problem,
                                solution: json.idea.solution,
                                extraLink: json.idea.extraLink,
                            },
                            {
                                valueProposition: json.idea.valueProposition,
                                customerSegments: json.idea.customerSegments,
                                customerRelationships: 
                                    json.idea.customerRelationships,
                                channels: json.idea.channels,
                                keyActivities: json.idea.keyActivities,
                                keyResources: json.idea.keyResources,
                                keyPartners: json.idea.keyPartners,
                                costStructure: json.idea.costStructure,
                                revenueStreams: json.idea.revenueStreams,
                            },
                            {
                                strengths: json.idea.strengths,
                                weaknesses: json.idea.weaknesses,
                                opportunities: json.idea.opportunities,
                                threats: json.idea.threats,
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