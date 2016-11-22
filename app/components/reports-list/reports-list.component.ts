import { Component, OnInit } from "@angular/core";

import { Report } from "../../models/report.model.app";

import { ReportsService } from "../../services/reports.service";

@Component({
    selector: "reports-list",
    templateUrl: "./reports-list.component.html",
    styles: [ require("./reports-list.component.css").toString() ]
})
export class ReportsListComponent implements OnInit {

    private list: Report[] = [];
    private message: string = "";

    constructor(private reportsService: ReportsService) {

    }

    ngOnInit(): void {
        this.loadReportsList();
    }

    private loadReportsList(): void {
        // renew list every load
        this.list = [];

        this.reportsService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.reports.length === 0) {
                this.message = "No reports, so far.";
            } else {
                json.reports.map((report: any) => {
                    this.list.push(new Report(
                        report.id,
                        report.message,
                        report.author,
                        new Date(report.createdAt)));
                });
            }
        });
    }
}