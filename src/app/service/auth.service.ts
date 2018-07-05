import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { ENTITIES } from '../util/ENTITIES';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  signupUser(email, password) {
    return new Promise<any>((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(() => resolve())
          .catch(error => reject(error));
    });
  }

  signinUser(email, password) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => resolve())
          .catch(error => reject(error));
    });
  }

  logout() {
    return new Promise<void>((resolve, reject) => {
        this.afAuth.auth.signOut()
          .then(() => resolve())
          .catch(error => reject(error));
    });
  }

  getCurrentUser(): any {
    return new Promise<any>((resolve) => {
      this.afAuth.authState.subscribe((auth) => {
        resolve(auth);
      });
    });
  }


// tslint:disable-next-line:eofline
}
