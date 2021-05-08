import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { VisitProfileComponent } from './visit-profile/visit-profile.component';
import { EventsComponent } from './events/events.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { QueryComponent } from './query/query.component';
import { RequestsComponent } from './requests/requests.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    SearchComponent,
    VisitProfileComponent,
    EventsComponent,
    AboutusComponent,
    QueryComponent,
    RequestsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'home', component: HomeComponent },
      { path: 'search', component:SearchComponent },
      { path: 'visitprofile/:id', component:VisitProfileComponent },
      { path: 'events', component:EventsComponent },
      { path: 'aboutus', component:AboutusComponent },
      { path: 'queries', component:QueryComponent },
      { path: 'requests', component:RequestsComponent }
    ])
  ],
  providers: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
