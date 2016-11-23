import { Component, OnInit } from "@angular/core";

import { Report } from "../../models/report.model.app";

import { UsersService } from "../../services/users.service";
import { IdeasService } from "../../services/ideas.service";
import { ReportsService } from "../../services/reports.service";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styles: [ require("./dashboard.component.css").toString() ]
})
export class DashboardComponent implements OnInit {

    private message: string = "";

    private userActivity: number = 0;
    private totalUsers: number = 0;
    private ideasToday: number = 0;
    private totalIdeas: number = 0;
    private reportsList: Report[] = [];

    constructor(
        private usersService: UsersService,
        private ideasService: IdeasService,
        private reportsService: ReportsService) {

    }

    ngOnInit(): void {
        this.loadRecentReports();
    }

    private loadRecentReports(): void {
        this.reportsService.getRecent().subscribe((json: any) => {
            if (json.fail) {
                this.message = json.fail;
            } else if (json.reports.length === 0) {
                this.message = "There are no unsolved reports, so far.";
            } else {
                json.reports.map((report: any) => {
                    this.reportsList.push(new Report(
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