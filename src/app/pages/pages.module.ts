import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { LoginComponent } from './login/login.component';
import { VehicleKpisComponent } from './vehicle-kpis/vehicle-kpis.component';
import { KpisDetailsComponent } from '../modals/kpis-details/kpis-details.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsAllComponent } from './tickets-all/tickets-all.component';
import { LorryRecciptsComponent } from './lorry-receipts/lorry-reccipts.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ConciseComponent } from './concise/concise.component';
import { TicketTrailsComponent } from '../modals/ticket-trails/ticket-trails.component';
import { ChartModule } from 'angular2-chartjs';
import { TicketSiteDetailsComponent } from './ticket-site-details/ticket-site-details.component';
import { TicketActionsComponent } from './ticket-actions/ticket-actions.component';
import { RemarkModalComponent } from '../modals/remark-modal/remark-modal.component';
import { DatePickerComponent } from '../modals/date-picker/date-picker.component';

import { from } from 'rxjs';
import { FuelAverageAnalysisComponent } from './fuel-average-analysis/fuel-average-analysis.component';
import { VehicleTripComponent } from './vehicle-trip/vehicle-trip.component';
import { AutoSuggestionComponent } from '../directives/auto-suggestion/auto-suggestion.component';
import { DirectiveModule } from '../directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { VehicleSearchComponent } from '../modals/vehicle-search/vehicle-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageProcessingComponent } from './image-processing/image-processing.component';
import { RouteMapperComponent } from './route-mapper/route-mapper.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';
import { TrendsComponent } from './trends/trends.component';
import { ResizableModule } from 'angular-resizable-element';
import { PlacementsComponent } from './placements/placements.component';
import { CallLogsComponent } from './call-logs/call-logs.component';
import { DriverCallSuggestionComponent } from './driver-call-suggestion/driver-call-suggestion.component';
import { UserCallSummaryComponent } from './user-call-summary/user-call-summary.component';
import { PlacementsDashBoardComponent } from './placements-dash-board/placements-dash-board.component';
import { LorryReceiptModule } from '../lorry-receipt/lorry-receipt.module';
import { TripStatusFeedbackComponent } from './trip-status-feedback/trip-status-feedback.component';
import { UserActivityStatusComponent } from './user-activity-status/user-activity-status.component';
import { PlacementDelayFaultsComponent } from './placement-delay-faults/placement-delay-faults.component';
import { VehicleGpsDetailComponent } from './vehicle-gps-detail/vehicle-gps-detail.component';
import { VehicleCoveredDistanceComponent } from './vehicle-covered-distance/vehicle-covered-distance.component';
import { TipFeedbackLogsComponent } from './tip-feedback-logs/tip-feedback-logs.component';
import { TripOnwardDelayComponent } from './trip-onward-delay/trip-onward-delay.component';
import { ShortTargetComponent } from './short-target/short-target.component';
import { onwardKmpdComponent } from './onward-kmpd/onward-kmpd.component';
import { CustomDatePipe } from '../pipes/custom-date/custom-date.pipe';
import { VehicleTripStagesComponent } from './vehicle-trip-stages/vehicle-trip-stages.component';
import { AdminModule } from '../admin/admin.module';
import { FuelFillingsComponent } from '../admin/fuel-fillings/fuel-fillings.component';
import { SharedModule } from '../shared.module';
import { TripVerifyStatesComponent } from './trip-verify-states/trip-verify-states.component';
import { VehiclePerformanceComponent } from './vehicle-performance/vehicle-performance.component';
import { DaywiseVehicleDistanceComponent } from './daywise-vehicle-distance/daywise-vehicle-distance.component';
import { DriverModule } from '../driver/driver.module';
import { DateServiceTesterComponent } from './date-service-tester/date-service-tester.component';
import { VehicleOdometerComponent } from './vehicle-odometer/vehicle-odometer.component';
import { VehicleDistanceWithOdometerComponent } from './vehicle-distance-with-odometer/vehicle-distance-with-odometer.component';
import { FSEEntryComponent } from './fse-entry/fse-entry.component';
import { FrieghtRateInputComponent } from './frieght-rate-input/frieght-rate-input.component';
import { FuelIndentComponent } from './fuel-indent/fuel-indent.component';
import { AdvicesComponent } from './advices/advices.component';
import { FreightExpensesComponent } from './freight-expenses/freight-expenses.component';
// import { LrInvoiceColumnsComponent } from './lr-invoice-columns/lr-invoice-columns.component';
import { SiteInOutComponent } from './site-in-out/site-in-out.component';
import { FreightInvoicesComponent } from './freight-invoices/freight-invoices.component';
import { CardMappingComponent } from './card-mapping/card-mapping.component';
import { TransfersComponent } from './transfers/transfers.component';
import { SitesComponent } from './sites/sites.component';
import { FinanceRecoveryComponent } from './finance-recovery/finance-recovery.component';
import { ManageFoPartyComponent } from './manage-fo-party/manage-fo-party.component';
import { FoFuelAverageComponent } from './fo-fuel-average/fo-fuel-average.component';
import { FuelMileageWithOdoComponent } from './fuel-mileage-with-odo/fuel-mileage-with-odo.component';
import { FuelMasterComponent } from './fuel-master/fuel-master.component';
import { FuelConsumptionComponent } from './fuel-consumption/fuel-consumption.component';
import { TripPnlComponent } from './trip-pnl/trip-pnl.component';
import { RouteDashboardComponent } from './route-dashboard/route-dashboard.component';
import { FoUserRoleComponent } from './fo-user-role/fo-user-role.component';
import { TrendsFoComponent } from './trends-fo/trends-fo.component';
import { MvsFreightStatementComponent } from './mvs-freight-statement/mvs-freight-statement.component';
import { UnmergeLRStateComponent } from './unmerge-lrstate/unmerge-lrstate.component';
import { VehicleSupplierAssociationComponent } from './vehicle-supplier-association/vehicle-supplier-association.component';
import { MvGpsApisComponent } from './mv-gps-apis/mv-gps-apis.component';
import { VehicleDetailsUpdateComponent } from '../modals/vehicle-details-update/vehicle-details-update.component';
import { MvGpsApiHistoryComponent } from './mv-gps-api-history/mv-gps-api-history.component';
import { RouteTripComponent } from './route-trip/route-trip.component';
import { TripSummaryComponent } from './trip-summary/trip-summary.component';
import { RouteDeviationsComponent } from './route-deviations/route-deviations.component';
import { FuelDailyConsumptionComponent } from './fuel-daily-consumption/fuel-daily-consumption.component';
import { VehicleStatusChangeByUserComponent } from './vehicle-status-change-by-user/vehicle-status-change-by-user.component';
import { TripissuesComponent } from './tripissues/tripissues.component';
import { TicketsKpiComponent } from './tickets-kpi/tickets-kpi.component';
import { SupervisorUserAssociationComponent } from './supervisor-user-association/supervisor-user-association.component';
import { TripsComponent } from './trips/trips.component';
import { IssuesReportComponent } from './issues-report/issues-report.component';
import { VehicleStatesComponent } from './vehicle-states/vehicle-states.component';
import { GraphicalReportsComponent } from './graphical-reports/graphical-reports.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UlheatmapComponent } from './ulheatmap/ulheatmap.component';
import { TicketsReportComponent } from './tickets-report/tickets-report.component';
import { TripmasterreportComponent } from './tripmasterreport/tripmasterreport.component';
import { TransporterViewComponent } from './transporter-view/transporter-view.component';
import { CooperateViewComponent } from './cooperate-view/cooperate-view.component';
import { TriptatreportComponent } from './triptatreport/triptatreport.component';
import { LeadvalidationreportComponent } from './leadvalidationreport/leadvalidationreport.component';
import { TripdeliverycomplinancereportComponent } from './tripdeliverycomplinancereport/tripdeliverycomplinancereport.component';
import { TripstoppageComponent } from './tripstoppage/tripstoppage.component';
import { DynamicReportDashboardComponent } from './dynamic-report-dashboard/dynamic-report-dashboard.component';
import { DynamicReportComponent } from './dynamic-report-dashboard/dynamic-report/dynamic-report';
import { ReportViewComponent } from './dynamic-report-dashboard/report-view/report-view.component';
import { ReportEditComponent } from './dynamic-report-dashboard/report-edit/report-edit.component';
import { DriverPreferencesComponent } from './driver-preferences/driver-preferences.component';
import { ConsignmentComponent } from './consignment/consignment.component';

import { TrendsComponent as ChallanTrends } from '../widgets/challans/trends/trends.component';
import { StateWiseComponent } from '../widgets/challans/state-wise/state-wise.component';
import { MostAgedComponent } from '../widgets/challans/most-aged/most-aged.component';
import { LatestComponent } from '../widgets/challans/latest/latest.component';
import { WorstDriversComponent } from '../widgets/challans/worst-drivers/worst-drivers.component';
import { WorstDriversYearsComponent } from '../widgets/challans/worst-drivers-years/worst-drivers-years.component';
import { OnwardKmpdComponent as tripOnwardKmpd } from '../widgets/trips/onward-kmpd/onward-kmpd.component';
import { AvgLoadingComponent } from '../widgets/trips/avg-loading/avg-loading.component';
import { AvgUnloadingComponent } from '../widgets/trips/avg-unloading/avg-unloading.component';
import { WorstVehiclesComponent } from '../widgets/trips/worst-vehicles/worst-vehicles.component';
import { LongestLoadingComponent } from '../widgets/trips/longest-loading/longest-loading.component';
import { LongestUnloadingComponent } from '../widgets/trips/longest-unloading/longest-unloading.component';
import { SlowestOnwardComponent } from '../widgets/trips/slowest-onward/slowest-onward.component';
import { LongestUnloadingSitesComponent } from '../widgets/trips/longest-unloading-sites/longest-unloading-sites.component';
import { GpsPerformanceComponent } from '../widgets/trips/gps-performance/gps-performance.component';
import { LiveTrafficStatusComponent } from '../widgets/traffic/live-traffic-status/live-traffic-status.component';
import { LongestDriverUnavailableComponent } from '../widgets/traffic/longest-driver-unavailable/longest-driver-unavailable.component';
import { LongestEmptyVehicleComponent } from '../widgets/traffic/longest-empty-vehicle/longest-empty-vehicle.component';
import { LongestGpsOfflineComponent } from '../widgets/traffic/longest-gps-offline/longest-gps-offline.component';
import { LongestLoadingSitesComponent } from '../widgets/traffic/longest-loading-sites/longest-loading-sites.component';
import { SlowestOnwardVeiclesComponent } from '../widgets/traffic/slowest-onward-veicles/slowest-onward-veicles.component';
import { TopVehicleRtoComponent } from '../widgets/traffic/top-vehicle-rto/top-vehicle-rto.component';
import { LongestUnloadingOfflineComponent } from '../widgets/traffic/longest-unloading-offline/longest-unloading-offline.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  DynamicReportComponent,
  ChallanTrends,
  StateWiseComponent,
  MostAgedComponent,
  LatestComponent,
  WorstDriversComponent,
  WorstDriversYearsComponent,
  tripOnwardKmpd,
  AvgLoadingComponent,
  AvgUnloadingComponent,
  WorstVehiclesComponent,
  LongestLoadingComponent,
  LongestUnloadingComponent,
  SlowestOnwardComponent,
  GpsPerformanceComponent,
  LiveTrafficStatusComponent,
  LongestDriverUnavailableComponent,
  LongestEmptyVehicleComponent,
  LongestGpsOfflineComponent,
  LongestLoadingSitesComponent,
  LongestUnloadingSitesComponent,
  SlowestOnwardVeiclesComponent,
  TopVehicleRtoComponent,
  LongestUnloadingOfflineComponent

];

@NgModule({

  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    ChartModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    ResizableModule,
    LorryReceiptModule,
    SharedModule,
    DriverModule,
    DragDropModule,
    FormsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    LoginComponent,
    VehicleKpisComponent,
    TicketsComponent,
    TicketsAllComponent,
    LorryRecciptsComponent,
    ExpensesComponent,
    ConciseComponent,
    TicketSiteDetailsComponent,
    TicketActionsComponent,
    ConciseComponent,
    VehicleTripComponent,
    ImageProcessingComponent,
    RouteMapperComponent,
    TrendsComponent,
    PlacementsComponent,
    CallLogsComponent,
    DriverCallSuggestionComponent,
    UserCallSummaryComponent,
    PlacementsDashBoardComponent,
    TripStatusFeedbackComponent,
    TicketsReportComponent,

    // UserActivityStatusComponent,
    PlacementDelayFaultsComponent,
    VehicleGpsDetailComponent,
    VehicleCoveredDistanceComponent,
    TipFeedbackLogsComponent,
    TripOnwardDelayComponent,
    ShortTargetComponent,
    onwardKmpdComponent,
    VehicleTripStagesComponent,
    TripVerifyStatesComponent,
    VehiclePerformanceComponent,
    DaywiseVehicleDistanceComponent,
    DateServiceTesterComponent,
    VehicleOdometerComponent,
    VehicleDistanceWithOdometerComponent,
    FSEEntryComponent,
    FrieghtRateInputComponent,
    FuelIndentComponent,
    AdvicesComponent,
    FreightExpensesComponent,
    // LrInvoiceColumnsComponent,
    SiteInOutComponent,
    FreightInvoicesComponent,
    CardMappingComponent,
    TransfersComponent,
    SitesComponent,
    FinanceRecoveryComponent,
    ManageFoPartyComponent,
    ManageFoPartyComponent,
    FuelMasterComponent,
    FuelConsumptionComponent,
    TripPnlComponent,
    RouteDashboardComponent,
    FoUserRoleComponent,
    TrendsFoComponent,
    MvsFreightStatementComponent,
    UnmergeLRStateComponent,
    VehicleSupplierAssociationComponent,
    MvGpsApisComponent,
    MvGpsApiHistoryComponent,
    RouteTripComponent,
    TripSummaryComponent,
    RouteDeviationsComponent,
    FuelDailyConsumptionComponent,
    VehicleStatusChangeByUserComponent,
    TripissuesComponent,
    TicketsKpiComponent,
    SupervisorUserAssociationComponent,
    TripsComponent,
    IssuesReportComponent,
    VehicleStatesComponent,
    GraphicalReportsComponent,
    UlheatmapComponent,
    TripmasterreportComponent,
    UlheatmapComponent,
    TransporterViewComponent,
    CooperateViewComponent,
    TriptatreportComponent,
    LeadvalidationreportComponent,
    TripdeliverycomplinancereportComponent,
    TripstoppageComponent,
    DynamicReportDashboardComponent,
    ReportViewComponent,
    ReportEditComponent,
    DriverPreferencesComponent,
    ConsignmentComponent
  ],
  exports: [
    FuelAverageAnalysisComponent,
    FuelMileageWithOdoComponent,
    FoFuelAverageComponent,


  ],
})
export class PagesModule {
}
