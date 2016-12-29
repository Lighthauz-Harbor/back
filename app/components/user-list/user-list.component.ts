import {Component, OnInit} from "@angular/core";
import {User} from "../../models/user.model.app";
import {UserService} from "../../services/user.service";

@Component({
    selector: "user-list",
    templateUrl: "user-list.component.html",
    styles: [ require("./user-list.component.css").toString() ]
})
export class UserListComponent implements OnInit {

    private list: User[] = [];
    private toggleAll: boolean = false;
    private message: string = "";

    constructor(private userService: UserService) {

    }

    ngOnInit(): void {
        this.loadUserList();
    }

    private loadUserList(): void {
        // renew list every load (esp. in case of deletion)
        this.list = []; 

        this.userService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "No users have been created, yet.";
            } else {
                json.results.map((u: any) => {
                    // some arguments are left empty or 0 because
                    // they are not needed at the moment
                    this.list.push(
                        new User(u.id, u.username, "user", u.name, u.bio,
                            "", new Date(0), new Date(u.createdAt)));
                });
            }
        });
    }

    search(term: string): void {
        if (term === "") this.loadUserList();
        else this.loadUserListByTerm(term);
    }

    private loadUserListByTerm(term: string): void {
        // renew list every load
        this.list = [];

        this.userService.searchUser(term).subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.results.length === 0) {
                this.message = "User not found. Please try again.";
            } else {
                json.results.map((u: any) => {
                    // some arguments are left empty or 0 because
                    // they are not needed at the moment
                    this.list.push(
                        new User(u.id, u.username, "user", u.name, 
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
        let selectedIds = this.list.filter((row) => {
            return row.selected;
        }).map((user) => {
            return user.id;
        });

        console.log(selectedIds);

        if (selectedIds.length === 0) {
            alert("Please select the users to delete first!");
        } else {
            this.userService.deleteUsers(selectedIds)
                .subscribe((json: any) => {
                    alert(json.message);
                    this.loadUserList(); // reload the users list
                });
        }
    }
}
