import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { RankingComponent } from './ranking/ranking.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', component: NotfoundComponent }
];

export const partialComponents = [];
