import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { DatePipe } from '@angular/common';
import { LorryReceiptComponent } from './lorry-receipt.component';
import { LorryReceiptRoutingModule } from './lorry-receipt-routing.module';
import { GenerateLRComponent } from './generate-lr/generate-lr.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


const PAGES_COMPONENTS = [
  LorryReceiptComponent,
];


@NgModule({
  imports: [
    LorryReceiptRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule 
  ],
  exports:[
    GenerateLRComponent
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    GenerateLRComponent
  ],

})
export class LorryReceiptModule { }
