import { Component } from '@angular/core';
import { DeviceComponent } from '../device/device.component';

@Component({
  selector: 'app-landing',
  imports: [DeviceComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
