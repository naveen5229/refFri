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
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
import { AddDriverCompleteComponent } from './modals/DriverModals/add-driver-complete/add-driver-complete.component';
import { AccountService } from './services/account.service';
import { ApiService } from './services/api.service';
import { CommonService } from './services/common.service';
import { UserService } from './@core/data/users.service';
import { VoucherdetailComponent } from './acounts-modals/voucherdetail/voucherdetail.component';
import { RadioSelectionComponent } from './modals/radio-selection/radio-selection.component';
import { UpdateTripDetailComponent } from './modals/update-trip-detail/update-trip-detail.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";
import { ResolveMissingIndustryComponent } from './modals/resolve-missing-industry/resolve-missing-industry.component';


import { DriverVehicleRemappingComponent } from './modals/driver-vehicle-remapping/driver-vehicle-remapping.component';
import { DriverStatusChangeComponent } from './modals/driver-status-change/driver-status-change.component';
import { NewDriverStatusComponent } from './modals/new-driver-status/new-driver-status.component';
import { DriverAttendanceUpdateComponent } from './modals/driver-attendance-update/driver-attendance-update.component';
import { VehicleReportComponent } from './modals/vehicle-report/vehicle-report.component';
import { LRViewComponent } from './modals/LRModals/lrview/lrview.component';
import { UpdateCompanyComponent } from './modals/update-company/update-company.component';
import { UpdateTransportAgentComponent } from './modals/update-transport-agent/update-transport-agent.component';
import { VehicleAnalysisComponent } from './modals/vehicle-analysis/vehicle-analysis.component';
import { RouteMapperComponent } from './modals/route-mapper/route-mapper.component';
import { PendingLicenceDetailComponent } from './modals/pending-licence-detail/pending-licence-detail.component';
import { TripDetailsComponent } from './modals/trip-details/trip-details.component';
import { ResizableModule } from 'angular-resizable-element';
import { NgxPrintModule } from 'ngx-print';
import { WareHouseModalComponent } from './acounts-modals/ware-house-modal/ware-house-modal.component';
import { UserCallHistoryComponent } from './modals/user-call-history/user-call-history.component';
import { DriverDistanceComponent } from './modals/driver-distance/driver-distance.component';
import { EditFillingComponent } from './modals/edit-filling/edit-filling.component';
import { AddPumpComponent } from './modals/add-pump/add-pump.component';
import { ImportFillingsComponent } from './modals/import-fillings/import-fillings.component';
import { AddCityComponent } from './acounts-modals/add-city/add-city.component';
import { SiteTripDetailsComponent } from './modals/site-trip-details/site-trip-details.component';
import { AddSiteRuleComponent } from './modals/add-site-rule/add-site-rule.component';
import { StorerequisitionComponent } from './acounts-modals/storerequisition/storerequisition.component';
import { DropDownListComponent } from './documents/documentation-modals/drop-down-list/drop-down-list.component';
import { VehicleGpsTrailComponent } from './modals/vehicle-gps-trail/vehicle-gps-trail.component';
import { VehicleLrComponent } from './modals/vehicle-lr/vehicle-lr.component';
import { ChoosePeriodsComponent } from './modals/choose-periods/choose-periods.component';
import { VehicleStatesComponent } from './modals/vehicle-states/vehicle-states.component';
import { ChangeDriverComponent } from './modals/DriverModals/change-driver/change-driver.component';
import { CsvErrorReportComponent } from './modals/csv-error-report/csv-error-report.component';
import { AddShortTargetComponent } from './modals/add-short-target/add-short-target.component';
import { FuelStationEntryComponent } from './modals/fuel-station-entry/fuel-station-entry.component';
import { ShowFuelStationComponent } from './modals/show-fuel-station/show-fuel-station.component';
import { CustomDatePipe } from './pipes/custom-date/custom-date.pipe';
import { DaybookComponent } from './acounts-modals/daybook/daybook.component';
import { ProfitlossComponent } from './acounts-modals/profitloss/profitloss.component';
import { LedgerviewComponent } from './acounts-modals/ledgerview/ledgerview.component';
import { CustomTimePipe } from './pipes/custom-time/custom-time.pipe';
import { VehicleTripStagesComponent } from './pages/vehicle-trip-stages/vehicle-trip-stages.component';
import { PoliceStationComponent } from './modals/police-station/police-station.component';
import { TankEmptyDetailsComponent } from './modals/tank-empty-details/tank-empty-details.component';
import { AddVehicleComponent } from './modals/add-vehicle/add-vehicle.component';
import { ImportBulkVehiclesComponent } from './modals/import-bulk-vehicles/import-bulk-vehicles.component';
import { AddFoAdminUsersComponent } from './modals/add-fo-admin-users/add-fo-admin-users.component';
import { AddFoComponent } from './modals/add-fo/add-fo.component';
import { PullHistoryGPSDataComponent } from './modals/pull-history-gps-data/pull-history-gps-data.component';
import { OdoMeterComponent } from './modals/odo-meter/odo-meter.component';
import { CostCentersComponent } from './acounts-modals/cost-centers/cost-centers.component';
import { ErrorCoomonVehiclesComponent } from './modals/error-coomon-vehicles/error-coomon-vehicles.component';
import { VouchercostcenterComponent } from './acounts-modals/vouchercostcenter/vouchercostcenter.component';
import { AddFuelFullRuleComponent } from './modals/add-fuel-full-rule/add-fuel-full-rule.component';
import { CostCenterViewComponent } from './acounts-modals/cost-center-view/cost-center-view.component';
import { VehiclesViewComponent } from './modals/vehicles-view/vehicles-view.component';

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
    VehiclesOnMapComponent,
    VoucherdetailComponent,
    RadioSelectionComponent,
    UpdateTripDetailComponent,
    ManualHaltComponent,
    ResolveMissingIndustryComponent,
    DriverVehicleRemappingComponent,
    DriverStatusChangeComponent,
    NewDriverStatusComponent,
    DriverAttendanceUpdateComponent,
    VehicleReportComponent,
    LRViewComponent,
    UpdateCompanyComponent,
    UpdateTransportAgentComponent,
    RouteMapperComponent,
    TripDetailsComponent,
    VehicleAnalysisComponent,
    RouteMapperComponent,
    PendingLicenceDetailComponent,
    WareHouseModalComponent,
    UserCallHistoryComponent,
    DriverDistanceComponent,
    EditFillingComponent,
    AddPumpComponent,
    ImportFillingsComponent,
    AddCityComponent,
    SiteTripDetailsComponent,
    AddSiteRuleComponent,
    StorerequisitionComponent,
    DropDownListComponent,
    VehicleGpsTrailComponent,
    VehicleLrComponent,
    ChoosePeriodsComponent,
    VehicleStatesComponent,
    ChangeDriverComponent,
    CsvErrorReportComponent,
    AddShortTargetComponent,
    FuelStationEntryComponent,
    ShowFuelStationComponent,
    CustomDatePipe,
    DaybookComponent,
    ProfitlossComponent,
    LedgerviewComponent,
    CustomTimePipe,
    PoliceStationComponent,
    TankEmptyDetailsComponent,
    AddVehicleComponent,
    ImportBulkVehiclesComponent,
    AddFoAdminUsersComponent,
    AddFoComponent,
    PullHistoryGPSDataComponent,
    OdoMeterComponent,
    CostCentersComponent,
    ErrorCoomonVehiclesComponent,
    VouchercostcenterComponent,
    AddFuelFullRuleComponent,
    CostCenterViewComponent,
    VehiclesViewComponent

  ],
  entryComponents: [
    ChangeDriverComponent,
    SiteTripDetailsComponent,
    UserCallHistoryComponent,
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
    DriverDistanceComponent,
    AddPumpComponent,
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
    RadioSelectionComponent,
    UpdateTripDetailComponent,
    ManualHaltComponent,
    ResolveMissingIndustryComponent,
    DriverVehicleRemappingComponent,
    DriverStatusChangeComponent,
    NewDriverStatusComponent,
    DriverAttendanceUpdateComponent,
    VehicleReportComponent,
    LRViewComponent,
    UpdateCompanyComponent,
    UpdateTransportAgentComponent,
    VehicleAnalysisComponent,
    RouteMapperComponent,
    EditFillingComponent,
    ImportFillingsComponent,
    TripDetailsComponent,
    PendingLicenceDetailComponent,
    WareHouseModalComponent,
    AddCityComponent,
    AddSiteRuleComponent,
    StorerequisitionComponent,
    DropDownListComponent,
    VehicleGpsTrailComponent,
    VehicleLrComponent,
    ChoosePeriodsComponent,
    VehicleStatesComponent,
    CsvErrorReportComponent,
    AddShortTargetComponent,
    FuelStationEntryComponent,
    ShowFuelStationComponent,
    DaybookComponent,
    ProfitlossComponent,
    PoliceStationComponent,
    LedgerviewComponent,
    TankEmptyDetailsComponent,
    AddVehicleComponent,
    ImportBulkVehiclesComponent,
    AddFoAdminUsersComponent,
    AddFoComponent,
    PullHistoryGPSDataComponent,
    OdoMeterComponent,
    CostCentersComponent,
    VouchercostcenterComponent,
    AddFuelFullRuleComponent,
    ErrorCoomonVehiclesComponent,
    VouchercostcenterComponent,
    CostCenterViewComponent
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
    NgxPrintModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD7Wk-pXb6r4rYUPQtvR19jjK2WkYaFYOs',
      libraries: ['drawing']
    }),
    ResizableModule
  ],

  bootstrap: [AppComponent],
  providers: [
    NgbActiveModal,
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseHandlerService, multi: true },
    // {provide: OWL_DATE_TIME_FORMATS, useValue: 'MMMM YYYY'}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
