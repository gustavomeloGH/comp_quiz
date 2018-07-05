import { Component, OnInit } from '@angular/core';
import { DaoService } from '../service/dao-service.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { User } from '../entity/user';
import { ENTITIES } from '../util/ENTITIES';

@Component({
  selector: 'app-dashboard',
  providers: [DaoService, AuthService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLoading: boolean;
  user: User;
  isEmptyRanking: boolean;

  constructor(private router: Router,
              private daoService: DaoService,
              private authService: AuthService) {
          this.user = new User();
          this.isLoading = true;
  }


  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser()
      .then(currentUser => {
          if ( currentUser ) {
            this.getUser(currentUser.email);
          } else {
            alert('Houve um problema, tente realizar o login novamente!');
            this.goToPage('home');
          }
      });
  }

  getUser(email) {
    this.daoService.get<User>(ENTITIES.user, 'email', email)
      .then(user => {
        this.isLoading = false;
        this.user = user;
        this.prepareRankingsList();

     });
 }

 prepareRankingsList() {
   if ( this.user.rankings === undefined ) {
    this.isEmptyRanking = true;
   } else {
     this.user.rankings = this.user.rankings.filter(elem => elem !== undefined );
   }
 }


 goToPage(pageName) {
  this.router.navigate([pageName]);
}



}
