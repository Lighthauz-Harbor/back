import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { UsersService } from "../../services/users.service";

@Component({
    selector: "user-deactivate",
    templateUrl: "./user-deactivate.component.html",
    styles: [ require("./user-deactivate.component.css").toString() ]
})
export class DeactivateUserComponent implements OnInit {

    private name: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UsersService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.usersService.getName(id)
                .subscribe((json: any) => {
                    this.name = json.fail || json.name;
                });
        });
    }

}