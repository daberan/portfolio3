import {
  Component,
  HostListener,
  numberAttribute,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  lastPressedButton: number = 1;

  constructor(
    private buttonHandlerService: ButtonHandlerService,
    private router: Router
  ) {}

  @HostListener('window:wheel', ['$event'])
  onScrollWheel(event: WheelEvent) {
    let jump: number = 1;

    if (event.deltaY > 0) {
      if (this.lastPressedButton == 3) {
        jump = 2;
      }
      if (this.lastPressedButton == 5) {
        jump = 2;
        this.lastPressedButton = -1;
      }
      this.navigateToScreenPage((this.lastPressedButton += jump));
    } else if (event.deltaY < 0) {
      if (this.lastPressedButton == 5) {
        jump = 2;
      }
      if (this.lastPressedButton == 1) {
        this.lastPressedButton = 6;
      }

      this.navigateToScreenPage((this.lastPressedButton -= jump));
    }
    this.getCurrentButtonID(this.lastPressedButton);
  }

  navigateToScreenPage(ID: number): void {
    if (ID == 1) {
      this.page = 'home';
    } else if (ID == 2) {
      this.page = 'about';
    } else if (ID == 3) {
      this.page = 'contact';
    } else if (ID == 4) {
      window.open('https://www.linkedin.com/in/davidberan89/', '_blank');

      return;
    } else if (ID == 5) {
      this.page = 'portfolio';
    }
    this.router.navigate([this.page]);
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
  }

  scrollWheel() {
    console.log('scrolled');
    this.navigateToScreenPage(1);
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
    window.removeEventListener('wheel', () => this.scrollWheel);
  }
}
