import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonHandlerService {
  constructor() {}

  private buttonID = new BehaviorSubject(0);
  buttonID$ = this.buttonID.asObservable();

  private isImprint = new BehaviorSubject(false);
  isImprint$ = this.isImprint.asObservable();

  updateButtonID(ID: number) {
    this.buttonID.next(ID);
  }

  toggleImprint(state: boolean) {
    this.isImprint.next(state);
  }
}
