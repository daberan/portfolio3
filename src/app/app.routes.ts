import { Routes } from '@angular/router';
import { HomeComponent } from './features/device/screen/home/home.component';
import { PortfolioComponent } from './features/device/screen/portfolio/portfolio.component';
import { ContactComponent } from './features/device/screen/contact/contact.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
