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
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketSiteDetailsComponent } from './ticket-site-details/ticket-site-details.component';
import { TicketActionsComponent } from './ticket-actions/ticket-actions.component';
import { RemarkModalComponent } from '../modals/remark-modal/remark-modal.component';
import { DatePickerComponent } from '../modals/date-picker/date-picker.component';

import { from } from 'rxjs';
import { FuelAverageAnalysisComponent } from './fuel-average-analysis/fuel-average-analysis.component';
import { VehicleTripComponent } from './vehicle-trip/vehicle-trip.component';
import { AutoSuggestionComponent } from '../directives/auto-suggestion/auto-suggestion.component';
import { DirectiveModule } from '../directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { VehicleSearchComponent } from '../modals/vehicle-search/vehicle-search.component';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ReactiveFormsModule } from '@angular/forms';
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
import { FreightRevenueComponent } from './freight-revenue/freight-revenue.component';
import { AdvicesComponent } from './advices/advices.component';
import { FreightExpensesComponent } from './freight-expenses/freight-expenses.component';
import { LrInvoiceColumnsComponent } from './lr-invoice-columns/lr-invoice-columns.component';
import { FreightInvoicesComponent } from './freight-invoices/freight-invoices.component';


const PAGES_COMPONENTS = [
  PagesComponent
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
    ImageViewerModule,
    ReactiveFormsModule,
    ResizableModule,
    LorryReceiptModule,
    SharedModule,
    DriverModule,
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
    TicketDetailsComponent,
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
    FreightRevenueComponent,
    AdvicesComponent,
    FreightExpensesComponent,
    LrInvoiceColumnsComponent,
    FreightInvoicesComponent,
    // CustomDatePipe
  ],
  exports: [
    FuelAverageAnalysisComponent,

  ],
})
export class PagesModule {
}
