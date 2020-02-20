import { NgModule } from '@angular/core';
import { BidSystemComponent } from './bid-system-component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BidsRoutingModule } from './bid-system-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SharedModule } from '../shared.module';
import { DirectiveModule } from '../directives/directives.module';

const PAGES_COMPONENTS = [
  BidSystemComponent,
];
@NgModule({
  declarations: [DashboardComponent, BidSystemComponent],
  imports: [
    ThemeModule,
    BidsRoutingModule,
    SharedModule,
    DirectiveModule,
  ]
})
export class BidSystemModule { }
