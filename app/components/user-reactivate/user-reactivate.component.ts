import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
    selector: "user-reactivate",
    templateUrl: "./user-reactivate.component.html",
    styles: [ require("./user-reactivate.component.css").toString() ]
})
export class ReactivateUserComponent implements OnInit {

    private name: string = "";

    private id: string = "";
    private reason: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private usersService: UserService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.id = params["id"];
            this.usersService.getName(this.id)
                .subscribe((json: any) => {
                    this.name = json.fail || json.name;
                });
        });
    }

    onSubmitReactivationRequest(): void {
        this.usersService.reactivateUser(this.id, this.reason)
            .subscribe((json: any) => {
                alert(json.message);
                this.router.navigate(["/users", this.id]);
            });
    }

}