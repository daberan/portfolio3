import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceComponent } from '../device/device.component';
import { ButtonHandlerService } from '../../services/button-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [DeviceComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
  constructor(private buttonHandlerService: ButtonHandlerService) {}
  private subscription: Subscription | null = null;
  isImprint: boolean = false;

  toggleImprint(state: boolean) {
    this.buttonHandlerService.toggleImprint(state);
  }

  ngOnInit(): void {
    this.subscription = this.buttonHandlerService.isImprint$.subscribe(
      (state: boolean) => {
        this.isImprint = state;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
