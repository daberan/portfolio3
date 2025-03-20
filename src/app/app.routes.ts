import { Routes } from '@angular/router';
import { HomeComponent } from './features/device/screen/home/home.component';
import { PortfolioComponent } from './features/device/screen/portfolio/portfolio.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
