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
    private author: any = { name: "", email: "" };

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
                        this.report.title = json.report.title;
                        this.report.type = json.report.type;
                        this.report.message = json.report.message;
                        this.report.reply = json.report.reply;
                        this.author.name = json.author.name;
                        this.author.email = json.author.email;
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