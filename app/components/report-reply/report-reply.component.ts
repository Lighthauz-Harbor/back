import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Report } from "../../models/report.model.app";

import { ReportService } from "../../services/report.service";

@Component({
    selector: "reply-to-report",
    templateUrl: "./report-reply.component.html",
    styles: [ require("./report-reply.component.css").toString() ]
})
export class ReplyToReportComponent implements OnInit {

    // initialize using default values first
    // (its values will be set during `ngOnInit()`)
    private report: Report = new Report();

    private solved: string;
    private solvedChoices: string[] = ["No", "Yes"];

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
                        this.report.title = json.title;
                        this.report.author = json.author;
                        this.report.type = json.type;
                        this.report.message = json.message;
                        this.report.reply = json.reply;
                    }
                });
        });
    }

    onSubmitReply(): void {
        this.report.solved = this.solved === "Yes";

        this.reportService.replyToReport(
                this.report.id, this.report.reply, this.report.solved)
            .subscribe((result: any) => {
                alert(result.message);
                this.router.navigate(["/reports"]);
            });
    }
}