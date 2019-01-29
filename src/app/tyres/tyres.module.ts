import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TyresRoutingModule } from './tyres-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TyresComponent } from './tyres.component';

const PAGES_COMPONENTS = [
  TyresComponent,
];


@NgModule({
  imports: [
    TyresRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class TyresModule { }
