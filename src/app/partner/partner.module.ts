import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartnerRoutingModule } from './partner-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PartnerComponent } from './partner.component';

const PAGES_COMPONENTS = [
  PartnerComponent,
];


@NgModule({
  imports: [
    PartnerRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PartnerModule { }
