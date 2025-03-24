import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ButtonHandlerService {
  constructor() {}

  private buttonID = new BehaviorSubject(0);
  buttonID$ = this.buttonID.asObservable();

  updateButtonID(ID: number) {
    this.buttonID.next(ID);
  }
}
