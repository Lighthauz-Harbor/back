import { Component, OnInit } from "@angular/core";

import { Observable, Subject } from "rxjs";

import { User } from "../../models/user.model.app";
import { UsersService } from "../../services/users.service";

@Component({
    selector: "users-list",
    templateUrl: "./users-list.component.html",
    styles: [ require("./users-list.component.css").toString() ]
})
export class UsersListComponent implements OnInit {

    private list: User[] = [];
    private searchTerms = new Subject<string>();
    private toggleAll: boolean = false;
    private message: string = "";

    constructor(private usersService: UsersService) {

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
                    // some arguments are left empty or 0 because
                    // they are not needed at the moment
                    this.list.push(
                        new User(u.username, "user", u.name, u.bio,
                            "", new Date(0), new Date(u.createdAt)));
                });
            }
        });
    }

    search(term: string): void {
        if (term === "") this.loadUsersList();
        else this.loadUsersListByTerm(term);
    }

    private loadUsersListByTerm(term: string): void {
        // renew list every load
        this.list = [];

        this.usersService.searchUser(term).subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "User not found. Please try again.";
            } else {
                json.results.map((u: any) => {
                    // some arguments are left empty or 0 because
                    // they are not needed at the moment
                    this.list.push(
                        new User(u.username, "user", u.name, 
                            u.bio, "", new Date(0), 
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

    cancelToggleAll(): void {
        this.toggleAll = false;
    }

    deleteSelectedUsers(): void {
        let selectedUsernames = this.list.filter((row) => {
            return row.selected;
        }).map((user) => {
            return user.username;
        });

        if (selectedUsernames.length === 0) {
            alert("Please select the users to delete first!");
        } else {
            this.usersService.deleteUsers(selectedUsernames)
                .subscribe((json: any) => {
                    alert(json.message);
                    this.loadUsersList(); // reload the users list
                });
        }
    }
}
