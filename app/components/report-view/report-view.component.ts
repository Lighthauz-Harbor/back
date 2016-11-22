import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { Report } from "../../models/report.model.app";

import { ReportsService } from "../../services/reports.service";

@Component({
    selector: "view-report",
    templateUrl: "./report-view.component.html",
    styles: [ require("./report-view.component.css").toString() ]
})
export class ViewReportComponent implements OnInit {

    // initialized using default values (must not be null)
    private report: Report = new Report("", "", "", "", "", false, "", new Date(0));

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
                        this.report = new Report(id, 
                            json.title, json.author, json.message, 
                            "", json.solved, json.type, 
                            new Date(json.createdAt));
                    }
                });
        });
    }

}