import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { RiveComponent } from '../../../rive/rive.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';

@Component({
  selector: 'app-home',
  imports: [RiveComponent, PortfolioComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private subscription: Subscription | null = null;

  constructor() {}
}
