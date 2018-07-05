
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireModule } from 'angularfire2/index';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RankingComponent } from './ranking/ranking.component';
import { importType } from '@angular/compiler/src/output/output_ast';
import { NotfoundComponent } from './notfound/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { RouterModule, Routes } from '@angular/router';
import { routes, partialComponents } from './app.routing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DaoService } from './service/dao-service.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    partialComponents,
    HeaderComponent,
    FooterComponent,
    RankingComponent,
    NotfoundComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
