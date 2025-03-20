import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonHandlerService {
  constructor() {}

  private buttonID = new BehaviorSubject(0);
  buttonID$ = this.buttonID.asObservable();

  private lastClickedButtonID = new BehaviorSubject(0);
  lastClickedButtonID$ = this.lastClickedButtonID.asObservable();

  updateButtonID(ID: number) {
    this.buttonID.next(ID);
    console.log('button ID:', ID);
  }

  updateLastClickedButtonID(ID: number) {
    this.lastClickedButtonID.next(ID);
    console.log('Last ID:', ID);
  }
}
