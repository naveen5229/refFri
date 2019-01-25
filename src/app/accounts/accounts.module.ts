import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountsComponent } from './accounts.component';

const PAGES_COMPONENTS = [
  AccountsComponent,
];


@NgModule({
  imports: [
    AccountsRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class AccountsModule { }
