import { Component } from '@angular/core';
import { RiveComponent } from '../../../rive/rive.component';

@Component({
  selector: 'app-home',
  imports: [RiveComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}
}
