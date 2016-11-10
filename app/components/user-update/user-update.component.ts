import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { User } from "../../models/user.model.app";

import { UsersService } from "../../services/users.service";

@Component({
    selector: "user-update",
    templateUrl: "./user-update.component.html",
    styles: [ require("./user-update.component.css").toString() ]
})
export class UpdateUserComponent implements OnInit {

    private firstName: string;
    private lastName: string;
    private email: string; // the new email/username
    private oldEmail: string; // to query for the user
    private password: string;
    private repeatPassword: string;
    private dobStr: string; // to be used in the template
    private dateOfBirth: Date; 
    private bio: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let username = params["username"];
            this.usersService.getSingleUser(username)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/users"]);
                    } else {
                        this.email = json.username;
                        this.oldEmail = json.username;

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

        this.usersService.updateUser({
            name: this.firstName + " " + this.lastName, 
            username: this.email,
            oldUsername: this.oldEmail,
            password: this.password, 
            dateOfBirth: (new Date(this.dateOfBirth)).toISOString().slice(0, 10), 
            bio: this.bio
        }).subscribe((result: any) => {
            alert(result.message);
            this.router.navigate(["/users"]);
        });
    }

    isValidInput(): boolean {
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