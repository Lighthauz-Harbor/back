import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { UsersListComponent } from "./components/users-list/users-list.component";

import { AuthenticationGuard } from "./services/authentication.guard";

const routes: Routes = [
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: "users",
        component: UsersListComponent,
        canActivate: [AuthenticationGuard]
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