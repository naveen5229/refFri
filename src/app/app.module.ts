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
import { AddPlacementSiteRuleComponent } from './modals/add-placement-site-rule/add-placement-site-rule.component';
import { FuelfilingComponent } from './acounts-modals/fuelfiling/fuelfiling.component';
import { VehicleFuelFillingEntryComponent } from './modals/vehicle-fuel-filling-entry/vehicle-fuel-filling-entry.component';
import { VehicleWiseFuelFillingComponent } from './modals/vehicle-wise-fuel-filling/vehicle-wise-fuel-filling.component';
import { PumpWiseFuelFillingComponent } from './modals/pump-wise-fuel-filling/pump-wise-fuel-filling.component';
import { VehicleNextServiceDetailComponent } from './modals/vehicle-next-service-detail/vehicle-next-service-detail.component';
import { BulkVehicleNextServiceDetailComponent } from './modals/bulk-vehicle-next-service-detail/bulk-vehicle-next-service-detail.component';
import { GpsEnabledDisabledComponent } from './modals/gps-enabled-disabled/gps-enabled-disabled.component';
import { UnmappedLrComponent } from './modals/LRModals/unmapped-lr/unmapped-lr.component';
import { MappedLrComponent } from './modals/LRModals/mapped-lr/mapped-lr.component';
import { FoSiteCountComponent } from './modals/fo-site-count/fo-site-count.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { PrintManifestComponent } from './modals/print-manifest/print-manifest.component';
import { VoucherSummaryShortComponent } from './accounts-modals/voucher-summary-short/voucher-summary-short.component';
import { AddVehicleModalServiceComponent } from './vehicle-maintenance/model/add-vehicle-modal-service/add-vehicle-modal-service.component';
import { AddVehicleSubModalServiceComponent } from './vehicle-maintenance/model/add-vehicle-sub-modal-service/add-vehicle-sub-modal-service.component';
import { UpdateTicketSubscribeComponent } from './modals/update-ticket-subscribe/update-ticket-subscribe.component';
import { AddAdvancedMaintenanceComponent } from './vehicle-maintenance/model/add-advanced-maintenance/add-advanced-maintenance.component';
import { ViaRoutePointsComponent } from './modals/via-route-points/via-route-points.component';
import { ModalWiseFuelAvgComponent } from './modals/modal-wise-fuel-avg/modal-wise-fuel-avg.component';
import { FuelEditComponent } from './modals/modal-wise-fuel-avg/fuel-edit/fuel-edit.component';
import { AddViaRoutesComponent } from './modals/add-via-routes/add-via-routes.component';
import { VehicleTyreSummaryComponent } from './modals/Tyres/vehicle-tyre-summary/vehicle-tyre-summary.component';
import { LoadHaltComponent } from './modals/load-halts/load-halt.component';
import { FreightInputWithoutLocationComponent } from './modals/FreightRate/freight-input-without-location/freight-input-without-location.component';
import { FreightInputLocationComponent } from './modals/FreightRate/freight-input-location/freight-input-location.component';
import { FoFreightRatesComponent } from './modals/FreightRate/fo-freight-rates/fo-freight-rates.component';
import { LrPodDashboardComponent } from './modals/LRModals/lr-pod-dashboard/lr-pod-dashboard.component';
import { BatterySummaryReportComponent } from './modals/Battery/battery-summary-report/battery-summary-report.component';
import { RoutesExpensesComponent } from './modals/routes-expenses/routes-expenses.component';
import { RoutesAdvancesComponent } from './modals/routes-advances/routes-advances.component';
import { RoutesTrafficKpisComponent } from './modals/routes-traffic-kpis/routes-traffic-kpis.component';
import { AddFuelIndentComponent } from './modals/add-fuel-indent/add-fuel-indent.component';
import { LrGenerateComponent } from './modals/LRModals/lr-generate/lr-generate.component';
import { AddFieldComponent } from './modals/LRModals/add-field/add-field.component';
import { AddFreightRevenueComponent } from './modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { SaveAdvicesComponent } from './modals/save-advices/save-advices.component';
import { EntityFlagsComponent } from './modals/entity-flags/entity-flags.component';
import { ClearAdvicesComponent } from './modals/clear-advices/clear-advices.component';
import { TransferReceiptsComponent } from './modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { AddFreightExpensesComponent } from './modals/FreightRate/add-freight-expenses/add-freight-expenses.component';
import { LrPodDetailsComponent } from './modals/lr-pod-details/lr-pod-details.component';
import { FreightRateCalculationComponent } from './modals/freight-rate-calculation/freight-rate-calculation.component';
import { ViewFrieghtInvoiceComponent } from './modals/FreightRate/view-frieght-invoice/view-frieght-invoice.component';
import { LrNearbyPodComponent } from './modals/LRModals/lr-nearby-pod/lr-nearby-pod.component';
import { VehicleDistanceCoveredCompactFormComponent } from './modals/vehicle-distance-covered-compact-form/vehicle-distance-covered-compact-form.component';
import { FreightInvoiceComponent } from './modals/FreightRate/freight-invoice/freight-invoice.component';
import { LrAssignComponent } from './modals/LRModals/lr-assign/lr-assign.component';
import { TypeMasterComponent } from './modals/type-master/type-master.component';
import { TripSettlementComponent } from './modals/trip-settlement/trip-settlement.component';
import { EditViaRoutesPointsComponent } from './modals/edit-via-routes-points/edit-via-routes-points.component';
import { LrRateComponent } from './modals/LRModals/lr-rate/lr-rate.component';
import { LedgeraddressComponent } from './acounts-modals/ledgeraddress/ledgeraddress.component';
import { GenericModelComponent } from './modals/generic-modals/generic-model/generic-model.component';
import { AddReceiptsComponent } from './modals/add-receipts/add-receipts.component';
import { GetUserBankInfoComponent } from './modals/get-user-bank-info/get-user-bank-info.component';
import { UploadDocsComponent } from './modals/upload-docs/upload-docs.component';
import { OrderdetailComponent } from './acounts-modals/orderdetail/orderdetail.component';
import { AddTransportAgentComponent } from './modals/LRModals/add-transport-agent/add-transport-agent.component';
import { AddCompanyBranchComponent } from './modals/add-company-branch/add-company-branch.component';
import { CompanyAssociationComponent } from './modals/company-association/company-association.component';
import { CompanyEstablishmentComponent } from './modals/company-establishment/company-establishment.component';
import { CompanyContactsComponent } from './modals/company-contacts/company-contacts.component';
import { AddMaterialComponent } from './modals/LRModals/add-material/add-material.component';
import { LRRateCalculatorComponent } from './modals/LRModals/lrrate-calculator/lrrate-calculator.component';
import { FoUserStateComponent } from './modals/fo-user-state/fo-user-state.component';
import { LrInvoiceColumnsComponent } from './pages/lr-invoice-columns/lr-invoice-columns.component';
import { GenerateLrMainfestoComponent } from './lorry-receipt/generate-lr-mainfesto/generate-lr-mainfesto.component';
import { FeedbackModalComponent } from './modals/feedback-modal/feedback-modal.component';
import { GenericInputTypeComponent } from './modals/generic-modals/generic-input-type/generic-input-type.component';
import { ModalWiseFuelAverageComponent } from './modals/modal-wise-fuel-average/modal-wise-fuel-average.component';
import { TripdetailComponent } from './acounts-modals/tripdetail/tripdetail.component';
import { SupportingDocComponent } from './modals/LRModals/supporting-doc/supporting-doc.component';
import { FreightInvoiceRateComponent } from './modals/FreightRate/freight-invoice-rate/freight-invoice-rate.component';
import { BasicPartyDetailsComponent } from './modals/basic-party-details/basic-party-details.component';
import { BankAccountsComponent } from './modals/bank-accounts/bank-accounts.component';
import { PartyLedgerMappingComponent } from './modals/party-ledger-mapping/party-ledger-mapping.component';
import { FoWebViewSummaryComponent } from './modals/fo-web-view-summary/fo-web-view-summary.component';
import { VoucherTypeGetComponent } from './modals/voucher-type-get/voucher-type-get.component';
import { BulkCompanyAssociationComponent } from './modals/bulk-company-association/bulk-company-association.component';
import { AssignUserTemplateComponent } from './modals/assign-user-template/assign-user-template.component';
import { SaveUserTemplateComponent } from './modals/save-user-template/save-user-template.component';
import { StrictMappingComponent } from './modals/strict-mapping/strict-mapping.component';
import { VehiclePriSecRoutemappingComponent } from './modals/vehicle-pri-sec-routemapping/vehicle-pri-sec-routemapping.component';
import { TyreHistoryComponent } from './modals/Tyres/tyre-history/tyre-history.component';
import { TemplatePreviewComponent } from './modals/template-preview/template-preview.component';
import { AddDispatchOrderComponent } from './modals/LRModals/add-dispatch-order/add-dispatch-order.component';
import { RouteTimeTableComponent } from './modals/route-time-table/route-time-table.component';
import { RouteTimeTableDetailsComponent } from './modals/route-time-table-details/route-time-table-details.component';
import { RoutesTimetableComponent } from './modals/routes-timetable/routes-timetable.component';
import { VehicleTimeTableAssociationComponent } from './modals/vehicle-time-table-association/vehicle-time-table-association.component';
import { DriverLedgerMappingComponent } from './modals/DriverModals/driver-ledger-mapping/driver-ledger-mapping.component';



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
    LoadHaltComponent,
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
    VehiclesViewComponent,
    AddPlacementSiteRuleComponent,
    FuelfilingComponent,
    VehicleFuelFillingEntryComponent,
    VehicleWiseFuelFillingComponent,
    PumpWiseFuelFillingComponent,
    VehicleNextServiceDetailComponent,
    BulkVehicleNextServiceDetailComponent,
    GpsEnabledDisabledComponent,
    UnmappedLrComponent,
    MappedLrComponent,
    FoSiteCountComponent,
    PrintManifestComponent,
    VoucherSummaryShortComponent,
    AddVehicleModalServiceComponent,
    AddVehicleSubModalServiceComponent,
    UpdateTicketSubscribeComponent,
    AddAdvancedMaintenanceComponent,
    ViaRoutePointsComponent,
    ModalWiseFuelAvgComponent,
    FuelEditComponent,
    AddViaRoutesComponent,
    VehicleTyreSummaryComponent,
    FreightInputWithoutLocationComponent,
    FreightInputLocationComponent,
    FoFreightRatesComponent,
    LrPodDashboardComponent,
    BatterySummaryReportComponent,
    RoutesExpensesComponent,
    RoutesAdvancesComponent,
    RoutesTrafficKpisComponent,
    AddFuelIndentComponent,
    LrGenerateComponent,
    AddFieldComponent,
    AddFreightRevenueComponent,
    SaveAdvicesComponent,
    EntityFlagsComponent,
    ClearAdvicesComponent,
    GenericModelComponent,
    TransferReceiptsComponent,
    AddFreightExpensesComponent,
    LrPodDetailsComponent,
    FreightRateCalculationComponent,
    ViewFrieghtInvoiceComponent,
    LrNearbyPodComponent,
    VehicleDistanceCoveredCompactFormComponent,
    FreightInvoiceComponent,
    LrAssignComponent,
    TypeMasterComponent,
    TripSettlementComponent,
    EditViaRoutesPointsComponent,
    LrRateComponent,
    LedgeraddressComponent,
    AddReceiptsComponent,
    GetUserBankInfoComponent,
    UploadDocsComponent,
    OrderdetailComponent,
    AddTransportAgentComponent,
    AddCompanyBranchComponent,
    CompanyAssociationComponent,
    CompanyEstablishmentComponent,
    CompanyContactsComponent,
    AddMaterialComponent,
    LRRateCalculatorComponent,
    FoUserStateComponent,
    LrInvoiceColumnsComponent,
    GenerateLrMainfestoComponent,
    FeedbackModalComponent,
    GenericInputTypeComponent,
    ModalWiseFuelAverageComponent,
    GenerateLrMainfestoComponent,
    TripdetailComponent,
    SupportingDocComponent,
    FreightInvoiceRateComponent,
    BasicPartyDetailsComponent,
    BankAccountsComponent,
    LrInvoiceColumnsComponent,
    PartyLedgerMappingComponent,
    FoWebViewSummaryComponent,
    VoucherTypeGetComponent,
    BulkCompanyAssociationComponent,
    AssignUserTemplateComponent,
    SaveUserTemplateComponent,
    StrictMappingComponent,
    VehiclePriSecRoutemappingComponent,
    TyreHistoryComponent,
    TemplatePreviewComponent,
    AddDispatchOrderComponent,
    RouteTimeTableComponent,
    RouteTimeTableDetailsComponent,
    RoutesTimetableComponent,
    VehicleTimeTableAssociationComponent,
    DriverLedgerMappingComponent,

  ],
  entryComponents: [
    AddDispatchOrderComponent,
    FreightInvoiceRateComponent,
    LRRateCalculatorComponent,
    LrRateComponent,
    ViewFrieghtInvoiceComponent,
    LrGenerateComponent,
    AddFreightExpensesComponent,
    FreightInputWithoutLocationComponent,
    FreightInputLocationComponent,
    VehicleTyreSummaryComponent,
    BulkVehicleNextServiceDetailComponent,
    AddAdvancedMaintenanceComponent,
    VehicleNextServiceDetailComponent,
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
    AddEscalationIssueComponent,
    DocumentHistoryComponent,
    EmpDashboardComponent,
    DocumentIssuesComponent,
    DriverDistanceComponent,
    AddPumpComponent,
    ChangeVehicleStatusComponent,
    ChangeHaltComponent,
    LoadHaltComponent,
    VoucherSummaryComponent,
    ParticlularsComponent,
    UpdateTicketPropertiesComponent,
    AddConsigneeComponent,
    AddDriverComponent,
    AddTripComponent,
    AddFuelFillingComponent,
    AddDriverCompleteComponent,
    UpdateSiteDetailsComponent,
    VechileTrailsComponent,
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
    CostCenterViewComponent,
    AddPlacementSiteRuleComponent,
    FuelfilingComponent,
    VehicleFuelFillingEntryComponent,
    VehicleWiseFuelFillingComponent,
    PumpWiseFuelFillingComponent,
    GpsEnabledDisabledComponent,
    UnmappedLrComponent,
    MappedLrComponent,
    FoSiteCountComponent,
    PrintManifestComponent,
    VoucherSummaryShortComponent,
    AddVehicleModalServiceComponent,
    AddVehicleSubModalServiceComponent,
    UpdateTicketSubscribeComponent,
    ViaRoutePointsComponent,
    ModalWiseFuelAvgComponent,
    FuelEditComponent,
    AddViaRoutesComponent,
    FoFreightRatesComponent,
    LrPodDashboardComponent,
    BatterySummaryReportComponent,
    RoutesExpensesComponent,
    RoutesAdvancesComponent,
    RoutesTrafficKpisComponent,
    AddFuelIndentComponent,
    AddFieldComponent,
    AddFreightRevenueComponent,
    SaveAdvicesComponent,
    EntityFlagsComponent,
    ClearAdvicesComponent,
    GenericModelComponent,
    TransferReceiptsComponent,
    LrPodDetailsComponent,
    FreightRateCalculationComponent,
    LrNearbyPodComponent,
    VehicleDistanceCoveredCompactFormComponent,
    FreightInvoiceComponent,
    LrAssignComponent,
    TypeMasterComponent,
    TripSettlementComponent,
    EditViaRoutesPointsComponent,
    LedgeraddressComponent,
    AddReceiptsComponent,
    GetUserBankInfoComponent,
    UploadDocsComponent,
    OrderdetailComponent,
    AddTransportAgentComponent,
    AddCompanyBranchComponent,
    CompanyAssociationComponent,
    CompanyEstablishmentComponent,
    CompanyContactsComponent,
    AddMaterialComponent,
    BasicPartyDetailsComponent,
    BankAccountsComponent,
    LrInvoiceColumnsComponent,
    GenerateLrMainfestoComponent,
    FoUserStateComponent,
    FeedbackModalComponent,
    GenericInputTypeComponent,
    ModalWiseFuelAverageComponent,
    TripdetailComponent,
    SupportingDocComponent,
    VoucherTypeGetComponent,
    PartyLedgerMappingComponent,
    FoWebViewSummaryComponent,
    BulkCompanyAssociationComponent,
    AssignUserTemplateComponent,
    SaveUserTemplateComponent,
    StrictMappingComponent,
    VehiclePriSecRoutemappingComponent,
    TyreHistoryComponent,
    TemplatePreviewComponent,
    RouteTimeTableComponent,
    RouteTimeTableDetailsComponent,
    DriverLedgerMappingComponent,
    RoutesTimetableComponent,
    VehicleTimeTableAssociationComponent
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
    ResizableModule,
    DateInputsModule
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
