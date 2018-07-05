import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
  }


}
