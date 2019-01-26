import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountsComponent } from './accounts.component';
import { OrdersComponent } from './orders/orders.component';
import { StockTypesComponent } from './stock-types/stock-types.component';

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
    OrdersComponent,
    StockTypesComponent,
  ],
})
export class AccountsModule { }
