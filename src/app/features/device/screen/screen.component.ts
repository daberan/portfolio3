import { Component, OnDestroy, OnInit } from '@angular/core';
import { RiveComponent } from '../../rive/rive.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ButtonHandlerService } from '../../../services/button-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-screen',
  imports: [RiveComponent, PortfolioComponent],
  templateUrl: './screen.component.html',
  styleUrl: './screen.component.scss',
})
export class ScreenComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  lastClickedButtonID: number = 0;
  // lastClickedButtonID: number = 0;
  constructor(private buttonHandler: ButtonHandlerService) {}

  ngOnInit(): void {
    this.buttonHandler.lastClickedButtonID$.subscribe((ID) => {
      this.lastClickedButtonID = ID;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
