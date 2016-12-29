import {Component} from "@angular/core";
import {Router} from "@angular/router";

import {Idea} from "../../models/idea.model.app";

import {IdeaService} from "../../services/idea.service";
import {ImageService} from "../../services/image.service";

@Component({
    selector: "idea-create",
    templateUrl: "./idea-create.component.html",
    styles: [ require("./idea-create.component.css").toString() ]
})
export class CreateIdeaComponent {
    
    private idea: Idea = new Idea();
    private author: string; // username or email
    private visibility: string;
    private visibilityChoices: string[] = ["Not published", "Exclusive", "Public"];
    
    private picImg: any;
    private picFile: Array<File> = [];

    constructor(
        private router: Router,
        private ideaService: IdeaService,
        private imageService: ImageService) {

    }

    onSubmitIdea(): void {
        if (this.isValidInput()) {
            // assign visibility to a number flag
            let visibilityFlag = this.visibilityChoices
                .indexOf(this.visibility);

            let {title, category, description, background,
                problem, solution, extraLink, strengths,
                weaknesses, opportunities, threats, valueProposition,
                customerSegments, customerRelationships, channels, 
                keyActivities, keyResources, keyPartners, costStructure, 
                revenueStreams} = this.idea;

            // the request body or data to save
            let reqBody: any = {title, category, author: this.author, 
                description, visibility: visibilityFlag, background,
                problem, solution, extraLink, strengths,
                weaknesses, opportunities, threats, valueProposition,
                customerSegments, customerRelationships, channels,
                keyActivities, keyResources, keyPartners, costStructure,
                revenueStreams};
            
            // upload idea picture first
            if (this.picFile.length === 1) {
                let file: File = this.picFile[0];
                let reader: FileReader = new FileReader();

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
        this.ideaService.createIdea(reqBody).subscribe((res: any) => {
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

        if (this.idea.extraLink && !this.idea.extraLink.match(urlRegex)) {
            alert("Extra link is not a valid URL. Please try again.");
            return false;
        }

        return true;
    }

}