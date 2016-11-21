import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";

import { UsersService } from "../../services/users.service";
import { ImageService } from "../../services/image.service";

@Component({
    selector: "user-create",
    templateUrl: "./user-create.component.html",
    styles: [ require("./user-create.component.css").toString() ]
})
export class CreateUserComponent {

    private firstName: string;
    private lastName: string;
    private email: string;
    private password: string;
    private repeatPassword: string;
    private dateOfBirth: Date;
    private bio: string;

    private profilePicImg: any;
    private profilePicFile: Array<File> = [];

    constructor(
        private router: Router,
        private usersService: UsersService,
        private imageService: ImageService) {

   } 

    onSubmitUser(): void {
        if (this.isValidInput()) {
            // create request body
            let reqBody: any = {
                name: this.firstName + " " + this.lastName, 
                username: this.email, 
                password: this.password, 
                dateOfBirth: (new Date(this.dateOfBirth)).toISOString().slice(0, 10), 
                bio: this.bio,
                role: "user"
            };

            // upload profile picture first
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

                            // request to create user after picture upload
                            this.requestToCreate(reqBody);
                        });
                };
                reader.readAsDataURL(file);
            } else {
                // simply request to create user without uploading profile pic
                this.requestToCreate(reqBody);
            }
        }
}

    private requestToCreate(reqBody: any) {
        this.usersService.createUser(reqBody).subscribe(result => {
            // matching result string with that from the API
            if (result.fail) {
                alert(result.fail);
                this.router.navigate(["/users/create", null]);
            } else {
                alert(result.message);
                this.router.navigate(["/users"]);
            }
        });
    }

    fileChangeEvent(fileInput: any): void {
        this.profilePicFile = <Array<File>> fileInput.target.files;
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

        if (this.profilePicFile.length > 1) {
            alert("Invalid number of pictures (not 0 or 1). Please input again.");
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