import { Routes } from '@angular/router';
import { HomeComponent } from './features/device/screen/home/home.component';
import { PortfolioComponent } from './features/device/screen/portfolio/portfolio.component';
import { ContactComponent } from './features/device/screen/contact/contact.component';
import { AboutComponent } from './features/device/screen/about/about.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
