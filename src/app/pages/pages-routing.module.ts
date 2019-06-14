import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleKpisComponent } from './vehicle-kpis/vehicle-kpis.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsAllComponent } from './tickets-all/tickets-all.component';
import { LorryRecciptsComponent } from './lorry-receipts/lorry-reccipts.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ConciseComponent } from './concise/concise.component';
import { TicketSiteDetailsComponent } from './ticket-site-details/ticket-site-details.component';
import { TicketTrailsComponent } from '../modals/ticket-trails/ticket-trails.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { FuelAverageAnalysisComponent } from './fuel-average-analysis/fuel-average-analysis.component';
import { VehicleTripComponent } from './vehicle-trip/vehicle-trip.component';
import { TrendsComponent } from './trends/trends.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';
import { PlacementsComponent } from './placements/placements.component';
import { from } from 'rxjs';
import { ImageProcessingComponent } from './image-processing/image-processing.component';
import { RouteMapperComponent } from './route-mapper/route-mapper.component';
import { CallLogsComponent } from './call-logs/call-logs.component';
import { UserCallSummaryComponent } from './user-call-summary/user-call-summary.component';
import { PlacementsDashBoardComponent } from './placements-dash-board/placements-dash-board.component';
import { TripStatusFeedbackComponent } from './trip-status-feedback/trip-status-feedback.component';
import { UserActivityStatusComponent } from './user-activity-status/user-activity-status.component';
import { PlacementDelayFaultsComponent } from './placement-delay-faults/placement-delay-faults.component';
import { DriverCallSuggestionComponent } from '../pages/driver-call-suggestion/driver-call-suggestion.component';
import { VehicleGpsDetailComponent } from './vehicle-gps-detail/vehicle-gps-detail.component';
import { VehicleCoveredDistanceComponent } from './vehicle-covered-distance/vehicle-covered-distance.component';
import { TipFeedbackLogsComponent } from './tip-feedback-logs/tip-feedback-logs.component';
import { TripOnwardDelayComponent } from './trip-onward-delay/trip-onward-delay.component';
import { ShortTargetComponent } from './short-target/short-target.component';
import { onwardKmpdComponent } from './onward-kmpd/onward-kmpd.component';
import { VehicleTripStagesComponent } from './vehicle-trip-stages/vehicle-trip-stages.component';
import { FuelFillingsComponent } from '../admin/fuel-fillings/fuel-fillings.component';
import { RemainingFuelComponent } from '../admin/remaining-fuel/remaining-fuel.component';
import { DocumentationDetailsComponent } from '../documents/documentation-details/documentation-details.component';
import { DocumentsSummaryComponent } from '../documents/documents-summary/documents-summary.component';
import { DocumentDashboardComponent } from '../documents/dashboard/dashboard.component';
import { DriverPerformanceComponent } from '../driver/driver-performance/driver-performance.component';
import { VehicleDistanceComponent } from '../admin/vehicle-distance/vehicle-distance.component';
import { TripVerifyStatesComponent } from './trip-verify-states/trip-verify-states.component';
import { VehiclePerformanceComponent } from './vehicle-performance/vehicle-performance.component';
import { ConsolidateFuelAverageComponent } from '../admin/consolidate-fuel-average/consolidate-fuel-average.component';
import { DaywiseVehicleDistanceComponent } from './daywise-vehicle-distance/daywise-vehicle-distance.component';
import { GenerateLrNoVehiclesComponent } from '../lorry-receipt/generate-lr-no-vehicles/generate-lr-no-vehicles.component';
import { GenerateLrMainfestoComponent } from '../lorry-receipt/generate-lr-mainfesto/generate-lr-mainfesto.component';
import { ViewManifestoComponent } from '../lorry-receipt/view-manifesto/view-manifesto.component';
import { DriverListComponent } from '../driver/driver-list/driver-list.component';
import { VehicleDriverMappingComponent } from '../driver/vehicle-driver-mapping/vehicle-driver-mapping.component';
import { DriverAttendanceComponent } from '../driver/driver-attendance/driver-attendance.component';
import { DriverDocumentComponent } from '../driver/driver-document/driver-document.component';
import { LicenceUploadComponent } from '../driver/licence-upload/licence-upload.component';
import { PendingLicenceComponent } from '../driver/pending-licence/pending-licence.component';
import { LrPodReceiptsComponent } from '../lorry-receipt/lr-pod-receipts/lr-pod-receipts.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: '',
    component: ConciseComponent
  },
  {

    path: 'dashboard',
    component: ConciseComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'vehicle-kpis',
    component: VehicleKpisComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {

    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'tickets-all',
    component: TicketsAllComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'lorry-receipts',
    component: LorryRecciptsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'generate-lr',
    component: GenerateLRComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'expenses',
    component: ExpensesComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'concise',
    component: ConciseComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'ticket-site-details',
    component: TicketSiteDetailsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'ticket-details',
    component: TicketDetailsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'fuel-average-analysis',
    component: FuelAverageAnalysisComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'vehicle-trip',
    component: VehicleTripComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'route-mapper',
    component: RouteMapperComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'trends',
    component: TrendsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'placements',
    component: PlacementsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'call-logs',
    component: CallLogsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'driver-call-suggestion',
    component: DriverCallSuggestionComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'user-call-summary',
    component: UserCallSummaryComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'placements-dash-board',
    component: PlacementsDashBoardComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'trip-status-feedback',
    component: TripStatusFeedbackComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'trip-onward-delay',
    component: TripOnwardDelayComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'user-activity-status',
    component: UserActivityStatusComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'placement-delay-faults',
    component: PlacementDelayFaultsComponent,
    canActivate: [AuthGuard],
  },
  {

    path: 'vehicle-covered-distance',
    component: VehicleCoveredDistanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-gps-detail',
    component: VehicleGpsDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trip-feedback-logs',
    component: TipFeedbackLogsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'short-target',
    component: ShortTargetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'onward-kmpd',
    component: onwardKmpdComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-trip-stages',
    component: VehicleTripStagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-trip-states',
    component: VehicleTripStagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel-fillings',
    component: FuelFillingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'remaining-fuel',
    component: RemainingFuelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'consolidate-fuel-average',
    component: ConsolidateFuelAverageComponent,
  },
  {
    path: 'documentation-details',
    component: DocumentationDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'documents-summary',
    component: DocumentsSummaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'document-dashboard',
    component: DocumentDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'driver-performance',
    component: DriverPerformanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-distance',
    component: VehicleDistanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'trip-verify-states',
    component: TripVerifyStatesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-performance',
    component: VehiclePerformanceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'daywise-vehicle-distance',
    component: DaywiseVehicleDistanceComponent,
  },
  {
    path: 'generate-lr-no-vehicles',
    component: GenerateLrNoVehiclesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'generate-lr-mainfesto',
    component: GenerateLrMainfestoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-manifesto',
    component: ViewManifestoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'driver-list',
    component: DriverListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle-driver-mapping',
    component: VehicleDriverMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'driver-attendance',
    component: DriverAttendanceComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'driver-document',
    component: DriverDocumentComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'licence-upload',
    component: LicenceUploadComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'pending-licence',
    component: PendingLicenceComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'lr-pod-receipts',
    component: LrPodReceiptsComponent,
    canActivate: [AuthGuard]
  },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
