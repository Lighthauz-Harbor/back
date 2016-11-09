import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Http, Headers, Response } from "@angular/http";

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
        private http: Http,
        private router: Router,
        private usersService: UsersService) {

    }

    onSubmitUser(): void {
        if (this.isValidInput()) {
            // submit input to server
            this.router.navigate(["/users"]);
        } else {
            this.router.navigate(["/users/create"]);
        }
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
        let age = today.getFullYear() - this.dateOfBirth.getFullYear();
        let month = today.getMonth() - this.dateOfBirth.getMonth();

        if (month < 0 || 
            (month === 0 && today.getDate() < this.dateOfBirth.getDate())) {

            age--;
        }

        return (age >= 13);
    }

}