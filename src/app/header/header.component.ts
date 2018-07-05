import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [AuthService],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userAlreadyLoggedIn: boolean;
  constructor(private router: Router,
              private renderer: Renderer,
              private authService: AuthService) {

      this.userAlreadyLoggedIn = false;

      this.router.events.subscribe((event) => {
        this.userAlreadLoggedIn();
       });
  }


  ngOnInit() { }

  isShowBasic () {
    return (this.router.url !== '/home');
  }

  conditionalShow() {
    let cont = 0;
    for (let i = 0; i < this.router.config.length; i++) {
        const routePath:  string = this.router.config[i].path;
        if ( routePath !== this.router.url.substring(1, this.router.url.length) ) {
          cont++;
        }
    }
    return ( cont !== this.router.config.length );
  }

  userAlreadLoggedIn() {
    if (!this.userAlreadyLoggedIn) {
      this.authService.getCurrentUser()
      .then(currentUser => {
          if ( currentUser ) {
            this.userAlreadyLoggedIn = true;
          } else {
            this.userAlreadyLoggedIn = false;
          }
      });
    }
  }


  doLogoff() {
    this.authService.logout()
      .then( res => {
          alert('Volte sempre!');
          this.userAlreadyLoggedIn = false;
          this.goToPage('home');
      })
      .catch( error => {
         alert('Falha ao deslogar, tente pelo dashboard!');
      });
  }

  goToPage(pageName) {
    this.router.navigate([pageName]);
  }

}
