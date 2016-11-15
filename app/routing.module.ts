import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

import { UsersListComponent } from "./components/users-list/users-list.component";
import { CreateUserComponent } from "./components/user-create/user-create.component";
import { UpdateUserComponent } from "./components/user-update/user-update.component";

import { IdeasListComponent } from "./components/ideas-list/ideas-list.component";
import { CreateIdeaComponent } from "./components/idea-create/idea-create.component";
import { UpdateIdeaComponent } from "./components/idea-update/idea-update.component";

import { AuthenticationGuard } from "./services/authentication.guard";

const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: "users",
        canActivate: [AuthenticationGuard],
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
                path: "update/:username",
                component: UpdateUserComponent
            }
        ]
    },
    {
        path: "ideas",
        canActivate: [AuthenticationGuard],
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
                path: "update/:id",
                component: UpdateIdeaComponent
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