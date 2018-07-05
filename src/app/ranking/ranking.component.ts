import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { DaoService } from '../service/dao-service.service';
import { Router } from '@angular/router';
import { User } from '../entity/user';
import { ENTITIES } from '../util/ENTITIES';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-ranking',
  providers: [AuthService, DaoService],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  users: Array<any>;
  isLoading: boolean;

  constructor(private authService: AuthService,
              private daoService: DaoService,
              private router: Router) {
    this.isLoading = true;
  }


  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
      this.daoService.list<User>(ENTITIES.user)
      .snapshotChanges().pipe(
        map(actions =>
          actions.map(snapshot =>  snapshot.payload.val() )
        ))
        .subscribe(  currUsers =>  {
               this.users = currUsers;
               this.calculateRankingByUsers();
               this.isLoading = false;

              });
  }

  calculateRankingByUsers() {
    this.users.forEach( (user, i) => {
      if ( user.rankings !== undefined ) {
        const sumOfAllRankings = user.rankings.reduce(function(prev, current) {
          return prev + current[1];
        }, 0);
        this.users[i].rankingGeral = sumOfAllRankings;
      } else {
        this.users[i].rankingGeral = 0;
      }
    });

    this.sortRankingGeral();
  }

  sortRankingGeral() {
    this.users.sort(this.sortfunction);
  }

  sortfunction(a: User, b: User) {
    return (b.rankingGeral - a.rankingGeral);
  }

}
