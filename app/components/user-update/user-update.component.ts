import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { UserService } from "../../services/user.service";
import { ImageService } from "../../services/image.service";

@Component({
    selector: "user-update",
    templateUrl: "./user-update.component.html",
    styles: [ require("./user-update.component.css").toString() ]
})
export class UpdateUserComponent implements OnInit {

    private id: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private password: string;
    private repeatPassword: string;
    private dobStr: string; // to be used in the template
    private dateOfBirth: Date; 
    private bio: string;
    
    private profilePicImg: any;
    private profilePicFile: Array<File> = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usersService: UserService,
        private imageService: ImageService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.id = params["id"];
            this.usersService.getSingleUser(this.id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/users"]);
                    } else {
                        this.email = json.username;

                        let name = json.name.split(" ");
                        let len = name.length;
                        this.firstName = name[0];
                        this.lastName = name[len - 1];

                        this.dateOfBirth = new Date(json.dateOfBirth);
                        this.dobStr = this.dateOfBirth.toISOString().slice(0, 10);
                        this.bio = json.bio;

                        // empty the password fields first
                        this.password = "";
                        this.repeatPassword = "";
                    }
                });
        });
    }

    onSubmitUser(): void {
        // update this.dateOfBirth after being changed from the template
        this.dateOfBirth = new Date(this.dobStr);

        let reqBody: any = {
            id: this.id,
            name: this.firstName + " " + this.lastName, 
            username: this.email,
            password: this.password, 
            dateOfBirth: (new Date(this.dateOfBirth)).getTime(),
            bio: this.bio
        };

        if (this.profilePicFile.length === 1) {
            let file: File = this.profilePicFile[0];
            let reader: FileReader = new FileReader();

            reader.onloadend = (e) => {
                this.profilePicImg = reader.result;
                this.imageService
                    .upload(this.profilePicImg)
                    .subscribe(result => {
                        if (result.error) {
                            alert("Upload picture error. Default profile picture will be used.");
                        } else {
                            // assign profile picture URL to request body
                            // to be saved in the database
                            reqBody.profilePic = result.secure_url;
                        }

                        // start request to update user with new profile pic
                        this.requestToUpdate(reqBody);
                    });
            };
            reader.readAsDataURL(file);
        } else {
            // simply request to upload user without uploading profile pic
            this.requestToUpdate(reqBody);
        }
    }

    fileChangeEvent(fileInput: any) {
        this.profilePicFile = <Array<File>> fileInput.target.files;
    }

    private requestToUpdate(reqBody: any) {
        this.usersService.updateUser(reqBody).subscribe(result => {
            alert(result.message);
            this.router.navigate(["/users"]);
        });
    }

    private isValidInput(): boolean {
        if (this.password !== this.repeatPassword) {
            alert("Both passwords must be the same. Please input again.");
            return false;
        }

        if (!this.isEligibleAge()) {
            alert("User must be 13 years old or older. Please input again.");
            return false;
        }

        return true;
    }

    private isEligibleAge(): boolean {
        let today = new Date();
        let dob = new Date(this.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        let month = today.getMonth() - dob.getMonth();

        if (month < 0 || 
            (month === 0 && today.getDate() < dob.getDate())) {

            age--;
        }

        return (age >= 13);
    }

}