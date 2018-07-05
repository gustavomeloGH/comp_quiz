import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Questionnaries } from '../entity/questionnaires';
import { AuthService } from '../service/auth.service';
import { DaoService } from '../service/dao-service.service';
import { Router } from '@angular/router';
import { ENTITIES } from '../util/ENTITIES';
import { map } from 'rxjs/operators';
import { User } from '../entity/user';
import { element } from 'protractor';

@Component({
  selector: 'app-quiz',
  providers: [AuthService, DaoService],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  readonly OK = '0';
  readonly NOTOK = '1';
  readonly NEED = '2';

  user: User;
  modalRef: BsModalRef;
  arrayQuiz: Array<any>;
  arrayCategory: Array<string>;
  isLoading: boolean;
  showQuiz: boolean;
  showQuestion: boolean;
  showEnd: boolean;
  currCategory: string;
  arrayByCategory: Array<Questionnaries>;
  questionShow: number;
  indexAswerRadio: number;
  msgAswer: string;
  msgEnd: string;
  alert: string;
  points: number;

  constructor(private modalService: BsModalService,
              private authService: AuthService,
              private daoService: DaoService,
              private router: Router) {
    this.isLoading = true;
    this.showQuiz = true;
    this.showQuestion = false;
    this.showEnd = false;
    this.arrayCategory = new Array<string>();
    this.questionShow = 0;
    this.indexAswerRadio = null;
    this.msgAswer = '';
    this.alert = '';
    this.points = 0;
  }

  ngOnInit() {
    this.getQuiz();
  }

  getQuiz() {
    this.daoService.list<Questionnaries>(ENTITIES.quiz)
      .snapshotChanges().pipe(
        map(actions =>
          actions.map(snapshot => snapshot.payload.val())
        ))
        .subscribe(  quiz =>  {
          this.arrayQuiz = quiz;
          // tslint:disable-next-line:no-shadowed-variable
          this.arrayQuiz.forEach(element => {
            if (!this.arrayCategory.includes(element.category)) {
              this.arrayCategory.push(element.category);
            }
          });
          this.getCurrentUser();
        });
  }


  startQuestion(category: string) {
    this.currCategory = category;
    this.setQuestionScreen();
    this.arrayByCategory = this.arrayQuiz.filter( elem => elem.category === category );

  }


  setQuizScreen() {
    this.showQuiz = true;
    this.showQuestion = false;
  }

  setQuestionScreen() {
    this.showQuiz = false;
    this.showQuestion = true;
  }

  nextQuestionShow() {
      this.questionShow += 1;
  }

  submitAswer(indexQuestion: number) {
    if ( this.indexAswerRadio === null ) {
      this.needAswer();
    } else {
      if ( this.arrayByCategory[indexQuestion].aswerIndex === this.indexAswerRadio ) {
        this.rightAswer();
      } else {
        this.wrongAswer();
      }
      this.getNextQuestion();
    }
  }

  rightAswer() {
    this.points += 1;
    this.msgAswer = 'Você acertou!';
    this.alert = this.OK;
  }

  wrongAswer() {
    this.msgAswer = 'Você errou!';
    this.alert = this.NOTOK;
  }

  needAswer() {
    this.msgAswer = 'Você precisa responder, para avançar!';
    this.alert = this.NEED;
  }

  getNextQuestion() {
    this.indexAswerRadio = null;
    if ( this.questionShow < this.arrayByCategory.length - 1 ) {
      this.nextQuestionShow();
    } else {
      this.prepareUpdate();
    }
  }

  setMsgEnd() {
    this.showEnd = true;
    const total = this.arrayByCategory.length;
    const perc = ( this.points * 100 ) / total;
    if ( perc <= 50 ) {
      // tslint:disable-next-line:max-line-length
      this.msgEnd = `${this.capitalize(this.user.nome)}, você apenas acertou: ${perc}%!\n Veja essa e outras pontuações no Dashboard!`;
    } else {
      this.msgEnd = `Parabéns ${this.capitalize(this.user.nome)}, você acertou: ${perc}%! Veja essa e outras pontuações no Dashboard!`;
    }
  }

  changeValue(index: number) {
    this.indexAswerRadio = index;
  }
  openModal(template: any) {
    if ( !this.showEnd ) {
      this.modalRef = this.modalService.show(template);
    }
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
          this.user = user;
          this.daoService.getUserKey(ENTITIES.user, 'email', this.user.email)
            .then( key => {
              this.isLoading = false;
              this.user.$key = key[0];
          });
     });
 }

 goToPage(pageName) {
  this.router.navigate([pageName]);
}

updateUserRanking() {
  this.msgAswer = '';
  this.showQuestion = false;
  this.isLoading = true;

  const newRanking = [this.currCategory, this.points];
  this.user.rankings.push(newRanking);

  this.daoService.update<User>(ENTITIES.user, this.user.$key, {rankings: this.user.rankings} )
  .then(() => {
    this.isLoading = false;
    this.setMsgEnd();
  });

}

prepareUpdate() {
  let removed = false;
  let cont = 0;

  if (this.user.rankings === undefined) {
    this.user.rankings = new Array([]);
    removed = true;
  } else {
    for (let i = 0; i < this.user.rankings.length; i++) {
      /*RANKINGS -> ARRAY 2 ELEMENTOS -> [0]: Categoria, [1]: Pontuação*/
      if ( this.user.rankings[i] !== undefined ) {
        if ( this.user.rankings[i][0] === this.currCategory ) {
          if ( this.user.rankings[i][1] < this.points ) {
            this.user.rankings.splice(i, 1);
            removed = true;
            break;
          }
        } else {
          cont += 1;
        }
      } else {
        cont += 1;
      }
    }
  }
  if (removed || cont === this.user.rankings.length) {
    this.updateUserRanking();
  } else {
    this.showQuestion = false;
    this.setMsgEnd();
  }
}

capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

}
