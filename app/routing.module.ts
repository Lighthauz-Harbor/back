import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

import { UsersListComponent } from "./components/users-list/users-list.component";
import { UserDetailsComponent } from "./components/user-details/user-details.component";
import { CreateUserComponent } from "./components/user-create/user-create.component";
import { UpdateUserComponent } from "./components/user-update/user-update.component";

import { IdeasListComponent } from "./components/ideas-list/ideas-list.component";
import { IdeaDetailsComponent } from "./components/idea-details/idea-details.component";
import { CreateIdeaComponent } from "./components/idea-create/idea-create.component";
import { UpdateIdeaComponent } from "./components/idea-update/idea-update.component";
import { IdeaResponsesComponent } from "./components/idea-responses/idea-responses.component";

import { ReportsListComponent } from "./components/reports-list/reports-list.component";
import { ViewReportComponent } from "./components/report-view/report-view.component";
import { ReplyToReportComponent } from "./components/report-reply/report-reply.component";

import { AuthenticationGuard } from "./services/authentication.guard";

const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [ AuthenticationGuard ]
    },
    {
        path: "users",
        canActivate: [ AuthenticationGuard ],
        children: [
            {
                path: "",
                component: UsersListComponent
            },
            {
                path: "create",
                component: CreateUserComponent
            },
            {
                path: "details/:id",
                component: UserDetailsComponent
            },
            {
                path: "update/:id",
                component: UpdateUserComponent
            }
        ]
    },
    {
        path: "ideas",
        canActivate: [ AuthenticationGuard ],
        children: [
            {
                path: "",
                component: IdeasListComponent
            },
            {
                path: "create",
                component: CreateIdeaComponent
            },
            {
                path: "details/:id",
                children: [
                    {
                        path: "",
                        component: IdeaDetailsComponent
                    },
                    {
                        path: "responses",
                        component: IdeaResponsesComponent
                    }
                ]
            },
            {
                path: "update/:id",
                component: UpdateIdeaComponent
            }
        ]
    },
    {
        path: "reports",
        canActivate: [ AuthenticationGuard ],
        children: [
            {
                path: "",
                component: ReportsListComponent
            },
            {
                path: "view/:id",
                component: ViewReportComponent
            },
            {
                path: "reply/:id",
                component: ReplyToReportComponent
            }
        ]
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "**",
        redirectTo: "/dashboard"
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class RoutingModule {

}