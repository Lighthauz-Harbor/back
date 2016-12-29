import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import {User} from "../../models/user.model.app";

import {UserService} from "../../services/user.service";
import {ImageService} from "../../services/image.service";

@Component({
    selector: "user-update",
    templateUrl: "./user-update.component.html",
    styles: [ require("./user-update.component.css").toString() ]
})
export class UpdateUserComponent implements OnInit {

    private user: User = new User();
    private repeatPassword: string;
    private dobStr: string; // to be used in the template
    
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
            this.user.id = params["id"];
            this.usersService.getSingleUser(this.user.id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/users"]);
                    } else {
                        let {username, name, dateOfBirth, bio} = json;
                        this.user.username = username;
                        this.user.name = name;

                        this.user.dateOfBirth = new Date(dateOfBirth);
                        this.dobStr = this.user.dateOfBirth.toISOString().slice(0, 10);
                        this.user.bio = bio;

                        // empty the password fields first
                        this.user.password = "";
                        this.repeatPassword = "";
                    }
                });
        });
    }

    onSubmitUser(): void {
        // update this.dateOfBirth after being changed from the template
        let dateOfBirth = (new Date(this.dobStr)).getTime();

        let {id, name, username, password, bio} = this.user;
        let reqBody: any = {id, name, username, password, dateOfBirth, bio};

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
        if (this.user.password !== this.repeatPassword) {
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
        let dob = new Date(this.user.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        let month = today.getMonth() - dob.getMonth();

        if (month < 0 || 
            (month === 0 && today.getDate() < dob.getDate())) {

            age--;
        }

        return (age >= 13);
    }

}