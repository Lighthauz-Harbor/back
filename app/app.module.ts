import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RoutingModule } from "./routing.module";

import { AppComponent } from "./components/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

import { UsersListComponent } from "./components/users-list/users-list.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { CreateUserComponent } from "./components/user-create/user-create.component";
import { UpdateUserComponent } from "./components/user-update/user-update.component";
import { UserIdeasComponent } from "./components/user-ideas/user-ideas.component";
import { UserConnectionsComponent } from 
    "./components/user-connections/user-connections.component";

import { IdeasListComponent } from "./components/ideas-list/ideas-list.component";
import { IdeaDetailsComponent } from "./components/idea-details/idea-details.component";
import { CreateIdeaComponent } from "./components/idea-create/idea-create.component";
import { UpdateIdeaComponent } from "./components/idea-update/idea-update.component";
import { IdeaResponsesComponent } from "./components/idea-responses/idea-responses.component";
import { IdeaPartnersComponent } from "./components/idea-partners/idea-partners.component";

import { ReportsListComponent } from "./components/reports-list/reports-list.component";
import { ViewReportComponent } from "./components/report-view/report-view.component";
import { ReplyToReportComponent } from "./components/report-reply/report-reply.component";

import { AuthenticationGuard } from "./services/authentication.guard";
import { AuthenticationService } from "./services/authentication.service";
import { UsersService } from "./services/users.service";
import { IdeasService } from "./services/ideas.service";
import { ImageService } from "./services/image.service";
import { ReportsService } from "./services/reports.service";

import "./vendor/vendor"; // vendor.ts file

@NgModule({
    imports: [ 
        BrowserModule, 
        FormsModule,
        HttpModule,
        RoutingModule
    ],
    declarations: [ 
        AppComponent,
        HeaderComponent,
        LoginComponent,
        DashboardComponent,
        FooterComponent,
        SidebarComponent,
        UsersListComponent,
        UserDetailsComponent,
        CreateUserComponent,
        UpdateUserComponent,
        UserIdeasComponent,
        UserConnectionsComponent,
        IdeasListComponent,
        IdeaDetailsComponent,
        CreateIdeaComponent,
        UpdateIdeaComponent,
        IdeaResponsesComponent,
        IdeaPartnersComponent,
        ReportsListComponent,
        ViewReportComponent,
        ReplyToReportComponent,
    ],
    providers: [ 
        AuthenticationGuard,
        AuthenticationService,
        UsersService,
        IdeasService,
        ImageService,
        ReportsService,
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}