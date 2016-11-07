import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../models/user.model.app";
import { UsersService } from "../../services/users.service";

@Component({
    selector: "users-list",
    templateUrl: "./users-list.component.html",
    styles: [ require("./users-list.component.css").toString() ]
})
export class UsersListComponent implements OnInit {

    private list: User[] = [];
    private toggleAll: boolean = false;

    private message: string = "";

    constructor(
        private router: Router,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.loadUsersList();
    }

    private loadUsersList(): void {
        // renew list every load (esp. in case of deletion)
        this.list = []; 

        this.usersService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "No users have been created, yet.";
            } else {
                json.results.map((u: any) => {
                    this.list.push(
                        new User(u.username, u.role, u.name, u.bio, 
                            u.profilePic, new Date(u.dateOfBirth), 
                            new Date(u.createdAt)));
                });
            }
        });
    }

    toggleAllUsers(): void {
        this.toggleAll = !this.toggleAll;
        this.list.map((row) => {
            row.selected = this.toggleAll;
        });
    }

    deleteSelectedUsers(): void {
        let selectedUsernames = this.list.filter((row) => {
            return row.selected;
        }).map((user) => {
            return user.username;
        });

        if (selectedUsernames.length === 0) {
            alert("Please select the users first!");
        } else {
            this.usersService.deleteUsers(selectedUsernames).subscribe((json: any) => {
                alert(json.message);
                this.loadUsersList(); // reload the users list
            });
        }
    }
}