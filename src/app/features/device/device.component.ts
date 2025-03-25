import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonHandlerService } from '../../services/button-handler.service';
import { Subscription } from 'rxjs';
import { ScreenComponent } from './screen/screen.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device',
  imports: [ScreenComponent],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  buttonID: number = 0;
  page: string = 'home';
  lastPressedButton: number = 0;

  constructor(
    private buttonHandlerService: ButtonHandlerService,
    private router: Router
  ) {}

  navigateToScreenPage(ID: number): void {
    if (ID == 1) {
      this.page = 'home';
    } else if (ID == 2) {
      this.page = 'contact';
    } else if (ID == 3) {
      this.page = 'about';
    } else if (ID == 4) {
      window.open('https://www.linkedin.com/in/davidberan89/', '_blank');
      console.log('bid', this.buttonID);

      return;
    } else if (ID == 5) {
      this.page = 'portfolio';
    }
    this.router.navigate([this.page]);
    console.log(this.lastPressedButton);
  }

  getCurrentButtonID(ID: number) {
    this.buttonHandlerService.updateButtonID(ID);
  }

  checkPath() {
    if (window.location.pathname === '/home') {
      this.lastPressedButton = 1;
    } else if (window.location.pathname === '/contact') {
      this.lastPressedButton = 2;
    } else if (window.location.pathname === '/about') {
      this.lastPressedButton = 3;
    } else if (window.location.pathname === '/portfolio') {
      this.lastPressedButton = 5;
    }
  }

  updateLastPressedButton(ID: number) {
    if (ID !== 0) {
      this.lastPressedButton = ID;
    }
    console.log('last:', this.lastPressedButton);
  }

  ngOnInit(): void {
    this.checkPath();
    this.buttonHandlerService.buttonID$.subscribe((ID) => {
      this.buttonID = ID;
      if (this.buttonID !== 4) {
        this.updateLastPressedButton(ID);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
