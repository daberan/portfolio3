import { Routes } from '@angular/router';
import { DeviceComponent } from './features/device/device.component';

export const routes: Routes = [
  {
    path: 'geraet',
    component: DeviceComponent,
    children: [
      //   { path: 'inhalt1', component: Inhalt1Component },
      //   { path: 'inhalt2', component: Inhalt2Component },
      //   { path: 'inhalt3', component: Inhalt3Component },
      { path: '', redirectTo: 'inhalt1', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'geraet', pathMatch: 'full' },
];
