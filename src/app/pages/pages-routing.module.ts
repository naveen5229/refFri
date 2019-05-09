import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
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
  },
  {

    path: 'vehicle-kpis',
    component: VehicleKpisComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {

    path: 'tickets',
    component: TicketsComponent,
  },
  {

    path: 'tickets-all',
    component: TicketsAllComponent,
  },
  {

    path: 'lorry-receipts',
    component: LorryRecciptsComponent,
  },
  {

    path: 'generate-lr',
    component: GenerateLRComponent,
  },
  {

    path: 'expenses',
    component: ExpensesComponent,
  },
  {

    path: 'concise',
    component: ConciseComponent,
  },
  {

    path: 'ticket-site-details',
    component: TicketSiteDetailsComponent
  },
  {

    path: 'ticket-details',
    component: TicketDetailsComponent
  },
  {

    path: 'fuel-average-analysis',
    component: FuelAverageAnalysisComponent
  },
  {

    path: 'vehicle-trip',
    component: VehicleTripComponent
  },
  {

    path: 'route-mapper',
    component: RouteMapperComponent
  },
  {

    path: 'trends',
    component: TrendsComponent
  },
  {

    path: 'placements',
    component: PlacementsComponent
  },
  {

    path: 'call-logs',
    component: CallLogsComponent
  },
  {

    path: 'driver-call-suggestion',
    component: DriverCallSuggestionComponent
  },
  {

    path: 'user-call-summary',
    component: UserCallSummaryComponent
  },
  {

    path: 'placements-dash-board',
    component: PlacementsDashBoardComponent
  },
  {

    path: 'trip-status-feedback',
    component: TripStatusFeedbackComponent
  },
  {

    path: 'trip-onward-delay',
    component: TripOnwardDelayComponent
  },
  {

    path: 'user-activity-status',
    component: UserActivityStatusComponent
  },
  {

    path: 'placement-delay-faults',
    component: PlacementDelayFaultsComponent
  },
  {

    path: 'vehicle-covered-distance',
    component: VehicleCoveredDistanceComponent
  },
  {
    path: 'vehicle-gps-detail',
    component: VehicleGpsDetailComponent
  },
  {
    path: 'tip-feedback-logs',
    component: TipFeedbackLogsComponent,
  },
  {
    path: 'short-target',
    component: ShortTargetComponent,
  },
  {
    path: 'onward-kmpd',
    component: onwardKmpdComponent,
  },
  {
    path: 'vehicle-trip-stages',
    component: VehicleTripStagesComponent,
  },
  {
    path: 'vehicle-trip-stages',
    component: VehicleTripStagesComponent,
  },
  {
    path: 'fuel-fillings',
    component: FuelFillingsComponent
  },
  {
    path: 'remaining-fuel',
    component: RemainingFuelComponent
  },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
