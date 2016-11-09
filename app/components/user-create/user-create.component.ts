import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";

import { UsersService } from "../../services/users.service";

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

    constructor(
        private router: Router,
        private usersService: UsersService) {

    }

    onSubmitUser(): void {
        if (this.isValidInput()) {
            this.usersService.createUser({
                name: this.firstName + " " + this.lastName, 
                username: this.email, 
                password: this.password, 
                dateOfBirth: (new Date(this.dateOfBirth)).toISOString().slice(0, 10), 
                bio: this.bio,
                role: "user"
            }).subscribe(result => {
                console.log("Result:", result);
                // matching result string with that from the API
                if (result === "User successfully created!") {
                    alert("Successfully created user!");
                    this.router.navigate(["/users"]);
                } else {
                    alert("Error creating user: redirecting back to creation form.");
                    this.router.navigate(["/users/create", null]);
                }
            });
        }
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