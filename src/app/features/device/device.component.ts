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
  lastPressedButton: number = 1;

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
      this.page = 'home';
    } else if (ID == 4) {
      this.page = 'home';
    } else if (ID == 5) {
      this.page = 'portfolio';
    }
    this.router.navigate([this.page]);
  }

  getCurrentButtonID(ID: number) {
    this.buttonHandlerService.updateButtonID(ID);
  }

  updateLastPressedButton(ID: number) {
    if (ID !== 0) {
      this.lastPressedButton = ID;
    }
    console.log('last:', this.lastPressedButton);
  }

  ngOnInit(): void {
    this.buttonHandlerService.buttonID$.subscribe((ID) => {
      this.buttonID = ID;
      this.updateLastPressedButton(ID);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
