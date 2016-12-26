import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {Report} from "../../models/report.model.app";
import {ReportService} from "../../services/report.service";

@Component({
    selector: "view-report",
    templateUrl: "./report-view.component.html",
    styles: [ require("./report-view.component.css").toString() ]
})
export class ViewReportComponent implements OnInit {

    // initialized using default values (must not be null)
    private report: Report = new Report();
    private author: any = { name: "", email: "" };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private reportService: ReportService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.reportService.getSingle(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/reports"]);
                    } else {
                        this.report.id = id;
                        this.report.title = json.report.title;
                        this.report.message = json.report.message;
                        this.report.reply = json.report.reply;
                        this.report.solved = json.report.solved;
                        this.report.type = json.report.type;
                        this.report.createdAt = new Date(json.createdAt);
                        this.author.name = json.author.name;
                        this.author.email = json.author.email;
                    }
                });
        });
    }

}