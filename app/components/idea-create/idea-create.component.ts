import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { IdeasService } from "../../services/ideas.service";
import { ImageService } from "../../services/image.service";

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

    private picImg: any;
    private picFile: Array<File> = [];

    constructor(
        private router: Router,
        private ideasService: IdeasService,
        private imageService: ImageService) {

    }

    onSubmitIdea(): void {
        if (this.isValidInput()) {
            // assign visibility to a number flag
            let visibilityFlag = this.visibilityChoices
                .indexOf(this.visibility);

            // the request body or data to save
            let reqBody: any = {
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
            };

            // upload idea picture first
            if (this.picFile.length === 1) {
                var file: File = this.picFile[0];
                var reader: FileReader = new FileReader();

                reader.onloadend = (e) => {
                    this.picImg = reader.result;
                    this.imageService
                        .upload(this.picImg)
                        .subscribe(result => {
                            if (result.error) {
                                alert("Upload idea picture error. Default idea picture will be used.");
                            } else {
                                // assign idea picture URL to request body
                                // to be saved in the database
                                reqBody.pic = result.secure_url;
                            }

                            // request to create idea after picture upload
                            this.requestToCreate(reqBody);
                        });
                };
                reader.readAsDataURL(file);
            } else {
                // simply request to create idea without uploading picture
                this.requestToCreate(reqBody);
            }
        }    
    }

    private requestToCreate(reqBody: any) {
        this.ideasService.createIdea(reqBody).subscribe((res: any) => {
            alert(res.message);
            this.router.navigate(["/ideas"]);
        });
    }

    fileChangeEvent(fileInput: any): void {
        this.picFile = <Array<File>> fileInput.target.files;
    }

    private isValidInput(): boolean {
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