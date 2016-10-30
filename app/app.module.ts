import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./components/app.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoginComponent } from "./components/login/login.component";
import { FooterComponent } from "./components/footer/footer.component";

import "./vendor";

@NgModule({
    imports: [ BrowserModule, FormsModule ],
    declarations: [ 
        AppComponent, 
        HeaderComponent, 
        LoginComponent, 
        FooterComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}