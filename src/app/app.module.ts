/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './auth/login/login.component';
import { HttpModule } from '@angular/http';
import { KpisDetailsComponent } from './modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from './modals/location-marker/location-marker.component';
import { TicketTrailsComponent } from './modals/ticket-trails/ticket-trails.component';
import { ImageViewComponent } from './modals/image-view/image-view.component';
import { BuyTimeComponent } from './modals/buy-time/buy-time.component';
import { ReminderComponent } from './modals/reminder/reminder.component';
import { TicketForwardComponent } from './modals/ticket-forward/ticket-forward.component';
import { RemarkModalComponent } from './modals/remark-modal/remark-modal.component';
import { VehicleHaltComponent } from './modals/vehicle-halt/vehicle-halt.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { DatePickerComponent } from './modals/date-picker/date-picker.component';
import { LocationSelectionComponent } from './modals/location-selection/location-selection.component';
import { ViewListComponent } from './modals/view-list/view-list.component';
import { VehicleTripUpdateComponent } from './modals/vehicle-trip-update/vehicle-trip-update.component';
import { FuelEntriesComponent } from './modals/fuel-entries/fuel-entries.component';
import { CustomerSelectionComponent } from './modals/customer-selection/customer-selection.component';
import { StockTypeComponent } from './acounts-modals/stock-type/stock-type.component';
import { StockSubtypeComponent } from './acounts-modals/stock-subtype/stock-subtype.component';
import { StockitemComponent } from './acounts-modals/stockitem/stockitem.component';
import { DirectiveModule } from './directives/directives.module';
import { AddDocumentComponent } from './documents/documentation-modals/add-document/add-document.component';
import { ImportDocumentComponent } from './documents/documentation-modals/import-document/import-document.component';
import { AddAgentComponent } from '../app/documents/documentation-modals/add-agent/add-agent.component';
import { from } from 'rxjs';
import { AccountsComponent } from './acounts-modals/accounts/accounts.component';
import { LedgerComponent } from './acounts-modals/ledger/ledger.component';
import { BranchComponent } from './acounts-modals/branch/branch.component';
import { VoucherComponent } from './acounts-modals/voucher/voucher.component';
import { VehicleSearchComponent } from './modals/vehicle-search/vehicle-search.component';
import { OrderComponent } from './acounts-modals/order/order.component';
import { TaxdetailComponent } from './acounts-modals/taxdetail/taxdetail.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {EditDocumentComponent} from './documents/documentation-modals/edit-document/edit-document.component';
import { ErrorReportComponent } from './documents/documentation-modals/error-report/error-report.component';
import { AddEscalationIssueComponent } from './modals/add-escalation-issue/add-escalation-issue.component';


@NgModule({
  declarations: [AppComponent,
    LoginComponent,
    KpisDetailsComponent,
    LocationMarkerComponent,
    TicketTrailsComponent,
    ImageViewComponent,
    TicketForwardComponent,
    BuyTimeComponent,
    ReminderComponent,
    RemarkModalComponent,
    VehicleHaltComponent,
    ConfirmComponent,
    DatePickerComponent,
    LocationSelectionComponent,
    ViewListComponent,
    VehicleTripUpdateComponent,
    FuelEntriesComponent,
    CustomerSelectionComponent,
    StockTypeComponent,
    StockSubtypeComponent,
    StockTypeComponent,
    StockSubtypeComponent,
    StockitemComponent,
    AddDocumentComponent,
    ImportDocumentComponent,
    AddAgentComponent,
    AccountsComponent,
    LedgerComponent,
    BranchComponent,
    VoucherComponent,
    VehicleSearchComponent,
    OrderComponent,
    TaxdetailComponent,
    EditDocumentComponent,
    ErrorReportComponent,
    AddEscalationIssueComponent
  ],
  entryComponents: [
    KpisDetailsComponent,
    LocationMarkerComponent,
    ImageViewComponent,
    TicketTrailsComponent,
    BuyTimeComponent,
    ReminderComponent,
    TicketForwardComponent,
    RemarkModalComponent,
    VehicleHaltComponent,
    ConfirmComponent,
    DatePickerComponent,
    LocationSelectionComponent,
    VehicleTripUpdateComponent,
    ViewListComponent,
    FuelEntriesComponent,
    CustomerSelectionComponent,
    StockTypeComponent,
    StockSubtypeComponent,
    StockitemComponent,
    AddDocumentComponent,
    ImportDocumentComponent,
    AddAgentComponent,
    AccountsComponent,
    LedgerComponent,
    BranchComponent,
    VoucherComponent,
    VehicleSearchComponent,
    OrderComponent,
    TaxdetailComponent,
    EditDocumentComponent,
    ErrorReportComponent,
    AddEscalationIssueComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Ng2SmartTableModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
