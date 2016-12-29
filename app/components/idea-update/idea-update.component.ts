import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {Idea} from "../../models/idea.model.app";

import {IdeaService} from "../../services/idea.service";
import {ImageService} from "../../services/image.service";

@Component({
    selector: "idea-update",
    templateUrl: "./idea-update.component.html",
    styles: [ require("./idea-update.component.css").toString() ]
})
export class UpdateIdeaComponent implements OnInit {

    private idea: Idea = new Idea();
    private oldCategory: string; // category before changed
    private oldAuthor: string; // author before changed
    private author: string; // username or email
    private visibility: string;
    private visibilityChoices: string[] = ["Not published", "Exclusive", "Public"];

    private picImg: any;
    private picFile: Array<File> = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ideaService: IdeaService,
        private imageService: ImageService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.idea.id = params["id"];
            this.ideaService.getSingleIdea(this.idea.id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/ideas"]);
                    } else {
                        this.oldAuthor = json.author.email;
                        this.author = json.author.email;
                        this.oldCategory = json.category;
                        this.idea.category = json.category;

                        this.visibility = this.visibilityChoices[json.visibility];

                        this.idea.title = json.idea.title;
                        this.idea.description = json.idea.description;
                        this.idea.background = json.idea.background;
                        this.idea.problem = json.idea.problem;
                        this.idea.solution = json.idea.solution;
                        this.idea.extraLink = json.idea.extraLink;

                        this.idea.strengths = json.idea.strengths;
                        this.idea.weaknesses = json.idea.weaknesses;
                        this.idea.opportunities = json.idea.opportunities;
                        this.idea.threats = json.idea.threats;

                        this.idea.valueProposition = json.idea.valueProposition;
                        this.idea.customerSegments = json.idea.customerSegments;
                        this.idea.customerRelationships = json.idea.customerRelationships;
                        this.idea.channels = json.idea.channels;
                        this.idea.keyActivities = json.idea.keyActivities;
                        this.idea.keyResources = json.idea.keyResources;
                        this.idea.keyPartners = json.idea.keyPartners;
                        this.idea.costStructure = json.idea.costStructure;
                        this.idea.revenueStreams = json.idea.revenueStreams;
                    }
                });
        });
    }

    onSubmitIdea(): void {
        if (this.isValidInput()) {
            // assign visibility to a number flag
            let visibilityFlag = this.visibilityChoices
                .indexOf(this.visibility);

            let {id, title, category, description,
                background, problem, solution, extraLink,
                strengths, weaknesses, opportunities, threats,
                valueProposition, customerSegments, customerRelationships,
                channels, keyActivities, keyResources, keyPartners,
                costStructure, revenueStreams} = this.idea;

            let reqBody: any = {
                id, title, oldCategory: this.oldCategory, category,
                oldAuthor: this.oldAuthor, author: this.author, description,
                visibility: visibilityFlag, background, problem, solution,
                extraLink, strengths, weaknesses, opportunities, threats,
                valueProposition, customerSegments, customerRelationships,
                channels, keyActivities, keyResources, keyPartners,
                costStructure, revenueStreams
            };

            if (this.picFile.length === 1) {
                let file: File = this.picFile[0];
                let reader: FileReader = new FileReader();

                reader.onloadend = (e) => {
                    this.picImg = reader.result;
                    this.imageService
                        .upload(this.picImg)
                        .subscribe(result => {
                            if (result.error) {
                                alert("Upload picture error. Default idea picture will be used.");
                            } else {
                                reqBody.pic = result.secure_url;
                            }

                            // request to create idea after picture upload
                            this.requestToUpdate(reqBody);
                        });
                };
                reader.readAsDataURL(file);
            } else {
                // simply update the idea without uploading new picture
                this.requestToUpdate(reqBody);
            }
        }
    }

    private requestToUpdate(reqBody: any) {
        this.ideaService.updateIdea(reqBody).subscribe((result: any) => {
            alert(result.message);
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