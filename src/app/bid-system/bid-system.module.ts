import { NgModule } from '@angular/core';
import { BidSystemComponent } from './bid-system-component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BidsRoutingModule } from './bid-system-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared.module';
import { DirectiveModule } from '../directives/directives.module';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { OrderBoardsComponent } from './order-boards/order-boards.component';

const PAGES_COMPONENTS = [
  BidSystemComponent,
];
@NgModule({
  declarations: [DashboardComponent, BidSystemComponent, OpenOrdersComponent, OrderBoardsComponent],
  imports: [
    ThemeModule,
    BidsRoutingModule,
    SharedModule,
    DirectiveModule,
  ]
})
export class BidSystemModule { }
