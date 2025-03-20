import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonHandlerService } from '../../services/button-handler.service';
import { Subscription } from 'rxjs';
import { ScreenComponent } from './screen/screen.component';

@Component({
  selector: 'app-device',
  imports: [ScreenComponent],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  buttonID: number = 0;

  constructor(private buttonHandlerService: ButtonHandlerService) {}

  getCurrentButtonID(ID: number) {
    this.buttonHandlerService.updateButtonID(ID);
  }

  updateLastClickedButtonID(ID: number) {
    this.buttonHandlerService.updateLastClickedButtonID(ID);
  }

  ngOnInit(): void {
    this.buttonHandlerService.buttonID$.subscribe((ID) => {
      this.buttonID = ID;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
