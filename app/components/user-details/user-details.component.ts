import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {User} from "../../models/user.model.app";
import {UserService} from "../../services/user.service";

@Component({
    selector: "user-details",
    templateUrl: "./user-details.component.html",
    styles: [ require("./user-details.component.css").toString() ]
})
export class UserDetailsComponent implements OnInit {

    private user: User = new User();
    private blocked: boolean;
    private preferredCategories: string[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService) {

        this.user.profilePic = 
            "https://res.cloudinary.com/lighthauz-harbor/image/upload/v1482734274/hourglass.gif";

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.userService.getSingleUser(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/users"]);
                    } else {
                        this.user = new User(
                            json.id, json.username, json.role,
                            json.name, json.bio, json.profilePic,
                            new Date(json.dateOfBirth),
                            new Date(json.createdAt));
                    }
                });

            this.userService.isDeactivatedUser(id)
                .subscribe((json: any) => {
                    this.blocked = json.blocked;
                });
                
            this.userService.listPreferredCategories(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        this.preferredCategories.push("Failed to load.");
                    } else {
                        json.list.map((item: string) => {
                            this.preferredCategories.push(item);
                        });
                        if (this.preferredCategories.length === 0) {
                            this.preferredCategories.push("No preferred categories.");
                        }
                    }
                });
        });
    }

}