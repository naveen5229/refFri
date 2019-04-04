/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { EditDocumentComponent } from './documents/documentation-modals/edit-document/edit-document.component';
import { PendingDocumentComponent } from './documents/documentation-modals/pending-document/pending-document.component';
import { ErrorReportComponent } from './documents/documentation-modals/error-report/error-report.component';
import { ReportIssueComponent } from './modals/report-issue/report-issue.component';
import { AddEscalationIssueComponent } from './modals/add-escalation-issue/add-escalation-issue.component';
import { VoucherSummaryComponent } from './accounts-modals/voucher-summary/voucher-summary.component';

import { DocumentReportComponent } from './documents/documentation-modals/document-report/document-report.component';
import { DocumentHistoryComponent } from './documents/documentation-modals/document-history/document-history.component';
import { EmpDashboardComponent } from './documents/documentation-modals/emp-dashboard/emp-dashboard.component';
import { DocumentIssuesComponent } from './documents/documentation-modals/document-issues/document-issues.component';
import { LicenceUploadComponent } from './driver/licence-upload/licence-upload.component';
import { ChangeVehicleStatusComponent } from './modals/change-vehicle-status/change-vehicle-status.component';
import { ChangeHaltComponent } from './modals/change-halt/change-halt.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageViewerModule } from 'ng2-image-viewer';
import { MatIconModule } from '@angular/material/icon';
import { UpdateTicketPropertiesComponent } from './modals/update-ticket-properties/update-ticket-properties.component';
import { EditLorryDetailsComponent } from './modals/edit-lorry-details/edit-lorry-details.component';
import { AddTripComponent } from './modals/add-trip/add-trip.component';
import { ManualHaltComponent } from './modals/manual-halt/manual-halt.component';

import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { ReactiveFormsModule } from '@angular/forms';
import { ParticlularsComponent } from './modals/LRModals/particlulars/particlulars.component';
import { AddConsigneeComponent } from './modals/LRModals/add-consignee/add-consignee.component';
import { AddDriverComponent } from './modals/add-driver/add-driver.component';
import { DatePicker2Component } from './modals/date-picker2/date-picker2.component';
import { 
  MatFormFieldModule,
  MatMenuModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddFuelFillingComponent } from './modals/add-fuel-filling/add-fuel-filling.component';

import { UpdateSiteDetailsComponent } from './modals/update-site-details/update-site-details.component';
import { VechileTrailsComponent } from './modals/vechile-trails/vechile-trails.component';
import { HttpResponseHandlerService } from './services/http-response-handler.service';
import { VehiclesOnMapComponent } from './modals/vehicles-on-map/vehicles-on-map.component';


import { EditDriverComponent } from './modals/edit-driver/edit-driver.component';
import { AddDriverCompleteComponent} from './modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { AccountService } from './services/account.service';
import { ApiService } from './services/api.service';
import { CommonService } from './services/common.service';
import { UserService } from './@core/data/users.service';
import { VoucherdetailComponent } from './acounts-modals/voucherdetail/voucherdetail.component';
import { RadioSelectionComponent } from './modals/radio-selection/radio-selection.component';
import { UpdateTripDetailComponent } from './modals/update-trip-detail/update-trip-detail.component';
// import { VehicleDriverMappingComponent} from './driver/vehicle-driver-mapping/vehicle-driver-mapping.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
import { ResolveMissingIndustryComponent } from './modals/resolve-missing-industry/resolve-missing-industry.component';


import { DriverVehicleRemappingComponent} from './modals/driver-vehicle-remapping/driver-vehicle-remapping.component';
import { DriverStatusChangeComponent } from './modals/driver-status-change/driver-status-change.component';
import { NewDriverStatusComponent } from './modals/new-driver-status/new-driver-status.component';
import { VehicleReportComponent } from './modals/vehicle-report/vehicle-report.component';
import { LRViewComponent } from './modals/LRModals/lrview/lrview.component';
import { UpdateCompanyComponent } from './modals/update-company/update-company.component';
import { UpdateTransportAgentComponent } from './modals/update-transport-agent/update-transport-agent.component';
import { VehicleAnalysisComponent } from './modals/vehicle-analysis/vehicle-analysis.component';
import { RouteMapperComponent } from './modals/route-mapper/route-mapper.component';
import { PendingLicenceDetailComponent } from './modals/pending-licence-detail/pending-licence-detail.component';

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
    PendingDocumentComponent,
    ErrorReportComponent,
    ReportIssueComponent,
    DocumentReportComponent,
    ErrorReportComponent,
    AddEscalationIssueComponent,
    DocumentReportComponent,
    DocumentHistoryComponent,
    EmpDashboardComponent,
    DocumentIssuesComponent,
    //LicenceUploadComponent,
    UpdateTicketPropertiesComponent,
    EditLorryDetailsComponent,
    ChangeVehicleStatusComponent,
    ChangeHaltComponent,
    VoucherSummaryComponent,
    AddConsigneeComponent,
    ParticlularsComponent,
    AddDriverComponent,
    VechileTrailsComponent,
    AddTripComponent,
    AddFuelFillingComponent,
    AddDriverComponent,
    UpdateSiteDetailsComponent,
    AddDriverCompleteComponent,
    UpdateSiteDetailsComponent,
    EditDriverComponent,
    // VehicleDriverMappingComponent
    VehiclesOnMapComponent,
    VoucherdetailComponent,
    RadioSelectionComponent,
    UpdateTripDetailComponent,
    ManualHaltComponent,
    ResolveMissingIndustryComponent,
    DriverVehicleRemappingComponent,
    DriverStatusChangeComponent,
    NewDriverStatusComponent,
    VehicleReportComponent,
    LRViewComponent,
    UpdateCompanyComponent,
    UpdateTransportAgentComponent,
    VehicleAnalysisComponent,
    RouteMapperComponent,
    PendingLicenceDetailComponent

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
    EditLorryDetailsComponent,
    PendingDocumentComponent,
    ErrorReportComponent,
    ReportIssueComponent,
    DocumentReportComponent,
    ErrorReportComponent,
    AddEscalationIssueComponent,
    DocumentReportComponent,
    DocumentHistoryComponent,
    EmpDashboardComponent,
    DocumentIssuesComponent,
    //LicenceUploadComponent,
    ChangeVehicleStatusComponent,
    ChangeHaltComponent,
    VoucherSummaryComponent,
    ParticlularsComponent,
    UpdateTicketPropertiesComponent,
    AddConsigneeComponent,
    AddDriverComponent,
    AddTripComponent,
    AddFuelFillingComponent,
    AddDriverCompleteComponent,
    UpdateSiteDetailsComponent,
    AddConsigneeComponent,
    AddTripComponent,
    AddFuelFillingComponent,
    VechileTrailsComponent,
    AddTripComponent,
    EditDriverComponent,
    VoucherdetailComponent,
    VehiclesOnMapComponent,
    // VehicleDriverMappingComponent 
    RadioSelectionComponent,
    UpdateTripDetailComponent,
    ManualHaltComponent,
    ResolveMissingIndustryComponent,
    DriverVehicleRemappingComponent,
    DriverStatusChangeComponent,
    NewDriverStatusComponent,
    VehicleReportComponent,
    LRViewComponent,
    UpdateCompanyComponent,
    UpdateTransportAgentComponent,
    VehicleAnalysisComponent,
    RouteMapperComponent,
    PendingLicenceDetailComponent
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
    ImageViewerModule,
    MatIconModule,
    DragDropModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD7Wk-pXb6r4rYUPQtvR19jjK2WkYaFYOs',
      libraries: ['drawing']
    })
  ],

  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseHandlerService, multi: true },
    // {provide: OWL_DATE_TIME_FORMATS, useValue: 'MMMM YYYY'}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
