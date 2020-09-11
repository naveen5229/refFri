import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WareHouseRoutingModule } from './ware-house-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DirectiveModule } from '../directives/directives.module';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { WareHouseComponent } from './ware-house-component';
import { WareHouseDashbordComponent } from './ware-house-dashbord/ware-house-dashbord.component';
import { WareHouseReceiptsComponent } from './ware-house-receipts/ware-house-receipts.component';
import { ManualItemsComponent } from './modal/manual-items/manual-items.component';
import { WarehouseInventoryComponent } from './warehouse-inventory/warehouse-inventory.component';
import { StateLogsComponent } from './state-logs/state-logs.component';
import { ReceiveItemsComponent } from './modal/receive-items/receive-items.component';
import { CheckDetailComponent } from './modal/check-detail/check-detail.component';
import { GotPassComponent } from './modal/got-pass/got-pass.component';
import { ManageStockExchangeComponent } from './manage-stock-exchange/manage-stock-exchange.component';

const PAGES_COMPONENTS = [
  WareHouseComponent,
];

@NgModule({
  declarations: [
    ...PAGES_COMPONENTS,
    WareHouseDashbordComponent,
    WareHouseReceiptsComponent,
    ManualItemsComponent,
    WarehouseInventoryComponent,
    StateLogsComponent,
    ReceiveItemsComponent,
    CheckDetailComponent,
    GotPassComponent,
    ManageStockExchangeComponent
  ],
  entryComponents:[
    ReceiveItemsComponent,
    ManualItemsComponent,
    GotPassComponent,

  ],
  
  imports: [
    CommonModule,
    WareHouseRoutingModule,
    ThemeModule,
    DirectiveModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
  ]
})
export class WareHouseModule { }
