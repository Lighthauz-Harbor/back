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

import { AuthenticationGuard } from "./services/authentication.guard";
import { AuthenticationService } from "./services/authentication.service";
import { GlobalEventsManager } from "./services/events-manager.service";

import "./vendor";

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
        UsersListComponent
    ],
    providers: [ 
        AuthenticationGuard,
        AuthenticationService,
        GlobalEventsManager
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}