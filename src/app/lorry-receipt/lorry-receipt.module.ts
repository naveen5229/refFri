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
import { GenerateLrNoVehiclesComponent } from './generate-lr-no-vehicles/generate-lr-no-vehicles.component';
import { GenerateLrMainfestoComponent } from './generate-lr-mainfesto/generate-lr-mainfesto.component';
import { ViewManifestoComponent } from './view-manifesto/view-manifesto.component';
import { LrPodReceiptsComponent } from './lr-pod-receipts/lr-pod-receipts.component';
import { DispatchOrdersComponent } from './dispatch-orders/dispatch-orders.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


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
    OwlNativeDateTimeModule,
    DragDropModule
  ],
  exports: [
    GenerateLRComponent
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    GenerateLRComponent,
    GenerateLrNoVehiclesComponent,
    // GenerateLrMainfestoComponent,
    ViewManifestoComponent,
    LrPodReceiptsComponent,
    DispatchOrdersComponent
  ],

})
export class LorryReceiptModule { }
