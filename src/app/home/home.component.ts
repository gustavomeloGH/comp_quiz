import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from '../entity/user';
import { AuthService } from '../service/auth.service';
import { DaoService } from '../service/dao-service.service';
import { ENTITIES } from '../util/ENTITIES';
import { Router } from '@angular/router';
import { Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { Questionnaries } from '../entity/questionnaires';


declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [AuthService, DaoService],
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  confirmacaoSenha: string;
  user: User;
  msgValidateError: string;
  userAlreadyLoggedIn: boolean;
  isLoading: boolean;



  constructor(private modalService: BsModalService,
              private authService: AuthService,
              private daoService: DaoService,
              private router: Router) {
    this.cleanUserData();
    this.isLoading = true;
    this.checkUserAlreadyLoggedIn();

  }

  ngOnInit() {
  }


  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
    this.cleanUserData();
  }

  closeModal() {
    this.modalRef.hide();
    this.cleanUserData();
  }


  cleanUserData() {
    this.user = new User();
  }

  doLogin() {
    const arrayData = new Array( 'email', 'senha' );
    if ( this.validateData(arrayData) ) {

      this.authService.signinUser(this.user.email, this.user.senha)
        .then(() => {
            alert('Login efetuado com sucesso!');
            this.goQuestionPage();
          })
        .catch(error => alert(error));
    } else {
      alert( this.msgValidateError );
    }
  }

  validateData(arrayData) {
    let isValidate = false;
    const emptyField = arrayData.filter(fieldInput => {
      return ( this.user[fieldInput] === undefined || this.user[fieldInput] === '' );
    });
    if ( emptyField.length === 0 ) {
        isValidate = true;
    } else {
      this.msgValidateError = ('Os seguintes campos devem ser preenchidos: ' + emptyField);
    }
    return isValidate;
  }


  doRegister() {
    const arrayData = new Array( 'nome', 'email', 'senha' );
    if ( this.validateData(arrayData)  &&  this.validatePassword() )  {
      this.validateEmail()
        .then(() => this.registerUser())
        .catch(() => alert(this.msgValidateError));
    } else {
      alert( this.msgValidateError );
    }
  }

  registerUser() {
        this.daoService.insert<User>( ENTITIES.user, this.user )
        .then(resolve => {
          this.registerAuth();
        } , error => console.log('error: ' + error));
  }

  registerAuth() {
    this.authService.signupUser(this.user.email, this.user.senha)
        .then(() => {
            alert('Usuário registrado com sucesso!');
            this.closeModal();
            this.goQuestionPage();
          })
        .catch(error => alert(error));
  }

  validatePassword() {
    let isValidate = false;
    if ( this.confirmacaoSenha === undefined || this.confirmacaoSenha === '') {
      this.msgValidateError = ('O campo confirmação de senha é obrigatório!');
    } else if (this.confirmacaoSenha !== this.user.senha ) {
      this.msgValidateError = ('As senhas digitadas não conferem!');
    } else {
      isValidate = true;
    }
    return isValidate;
  }


  validateEmail(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.daoService.get<User>(ENTITIES.user, 'email', this.user.email)
        .then(res => {
          if (res !== undefined) {
            this.msgValidateError = 'O Email já existe no sistema';
            reject();
          } else {
            resolve();
          }
        });
    });
  }

  goQuestionPage() {
    this.router.navigate(['quiz']);
  }

  userAlreadLoggedIn() {
      this.authService.getCurrentUser()
      .then(currentUser => {
          this.isLoading = false;
          if ( currentUser ) {
            this.userAlreadyLoggedIn = true;
          } else {
            this.userAlreadyLoggedIn = false;
          }
      });
  }

  checkUserAlreadyLoggedIn() {
    this.userAlreadyLoggedIn = true;
    this.router.events.subscribe((event) => {
      event =  event as NavigationEnd;
      // tslint:disable-next-line:no-unused-expression
      if (event.url === '/home') {
        this.userAlreadLoggedIn();
      }
   });
  }

}
