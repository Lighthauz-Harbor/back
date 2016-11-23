import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Report } from "../../models/report.model.app";

import { ReportsService } from "../../services/reports.service";

@Component({
    selector: "reply-to-report",
    templateUrl: "./report-reply.component.html",
    styles: [ require("./report-reply.component.css").toString() ]
})
export class ReplyToReportComponent implements OnInit {

    private report: Report = new Report("", "", "", "", "", false, "", new Date(0));
    private solved: string;
    private solvedChoices: string[] = ["No", "Yes"];

    constructor(
        private route: ActivatedRoute,
        private router: Router, 
        private reportsService: ReportsService) {

    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params["id"];
            this.reportsService.getSingle(id)
                .subscribe((json: any) => {
                    if (json.fail) {
                        alert(json.fail);
                        this.router.navigate(["/reports"]);
                    } else {
                        this.report.id = id;
                        this.report.title = json.title;
                        this.report.type = json.type;
                        this.report.message = json.message;
                        this.report.reply = json.reply;
                    }
                });
        });
    }

    onSubmitReply(): void {
        this.report.solved = this.solved === "Yes";

        this.reportsService.replyToReport(
                this.report.id, this.report.reply, this.report.solved)
            .subscribe((result: any) => {
                alert(result.message);
                this.router.navigate(["/reports"]);
            });
    }
}