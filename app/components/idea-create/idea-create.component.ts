import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { IdeasService } from "../../services/ideas.service";

@Component({
    selector: "idea-create",
    templateUrl: "./idea-create.component.html",
    styles: [ require("./idea-create.component.css").toString() ]
})
export class CreateIdeaComponent {
    private title: string;
    private category: string;
    private author: string; // username or email
    private description: string;
    private visibility: string;
    private visibilityChoices: string[] = ["Not published", "Exclusive", "Public"];
    private background: string;
    private problem: string;
    private solution: string;
    private extraLink: string;
    private strengths: string;
    private weaknesses: string;
    private opportunities: string;
    private threats: string;
    private valueProposition: string;
    private customerSegments: string;
    private customerRelationships: string;
    private channels: string;
    private keyActivities: string;
    private keyResources: string;
    private keyPartners: string;
    private costStructure: string;
    private revenueStreams: string;

    constructor(
        private router: Router,
        private ideasService: IdeasService) {

    }

    onSubmitIdea(): void {
        if (this.isValidInput()) {
            // assign visibility to a number flag
            let visibilityFlag = this.visibilityChoices
                .indexOf(this.visibility);

            // create the idea, checking whether the author exists already occurs
            // in the server schema
            this.ideasService.createIdea({
                title: this.title,
                category: this.category,
                author: this.author,
                description: this.description,
                visibility: visibilityFlag,
                background: this.background,
                problem: this.problem,
                solution: this.solution,
                extraLink: this.extraLink || "",
                strengths: this.strengths,
                weaknesses: this.weaknesses,
                opportunities: this.opportunities,
                threats: this.threats,
                valueProposition: this.valueProposition,
                customerSegments: this.customerSegments,
                customerRelationships: this.customerRelationships,
                channels: this.channels,
                keyActivities: this.keyActivities,
                keyResources: this.keyResources,
                keyPartners: this.keyPartners,
                costStructure: this.costStructure,
                revenueStreams: this.revenueStreams,
            }).subscribe((res: any) => {
                alert(res.message);
                this.router.navigate(["/ideas"]);
            });
        }
    }

    isValidInput(): boolean {
        // credits to Diego Perini for the URL regex 
        // reference: https://gist.github.com/dperini/729294
        let urlRegex = new RegExp(
            "^" +
                "(?:(?:https?|ftp)://)?" +
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                    "\\.?" +
                ")" +
                "(?::\\d{2,5})?" +
                "(?:[/?#]\\S*)?" +
            "$", "i"
        );

        if (this.extraLink && !this.extraLink.match(urlRegex)) {
            alert("Extra link is not a valid URL. Please try again.");
            return false;
        }

        return true;
    }

}