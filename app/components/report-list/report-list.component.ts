import { Component, OnInit } from "@angular/core";

import { Report } from "../../models/report.model.app";

import { ReportService } from "../../services/report.service";

@Component({
    selector: "report-list",
    templateUrl: "report-list.component.html",
    styles: [ require("./report-list.component.css").toString() ]
})
export class ReportsListComponent implements OnInit {

    private list: Report[] = [];
    private message: string = "";

    constructor(private reportService: ReportService) {

    }

    ngOnInit(): void {
        this.loadReportsList();
    }

    private loadReportsList(): void {
        // renew list every load
        this.list = [];

        this.reportService.getList().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.reports.length === 0) {
                this.message = "There are no unsolved reports, so far.";
            } else {
                json.reports.map((report: any) => {
                    this.list.push(new Report(
                        report.id,
                        report.title,
                        report.author,
                        "",
                        "",
                        false,
                        "",
                        new Date(report.createdAt)));
                });
            }
        });
    }
}