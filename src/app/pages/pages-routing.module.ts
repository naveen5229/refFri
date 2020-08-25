import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouteGuard, DeactivateGuardService } from '../guards/route.guard';
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
import { LrPodReceiptsComponent } from '../lorry-receipt/lr-pod-receipts/lr-pod-receipts.component';
import { VehiclesComponent } from '../admin/vehicles/vehicles.component';
import { VehicleOdometerComponent } from './vehicle-odometer/vehicle-odometer.component';
import { VehicleDistanceWithOdometerComponent } from './vehicle-distance-with-odometer/vehicle-distance-with-odometer.component';
import { FSEEntryComponent } from './fse-entry/fse-entry.component';
import { FrieghtRateInputComponent } from './frieght-rate-input/frieght-rate-input.component';
import { FuelIndentComponent } from './fuel-indent/fuel-indent.component';
import { ViaRoutesComponent } from '../admin/via-routes/via-routes.component';
import { PodDashboardComponent } from '../admin/pod-dashboard/pod-dashboard.component';
import { AdvicesComponent } from './advices/advices.component';
import { FreightExpensesComponent } from './freight-expenses/freight-expenses.component';
import { LrInvoiceColumnsComponent } from './lr-invoice-columns/lr-invoice-columns.component';
import { SiteInOutComponent } from './site-in-out/site-in-out.component';
import { FreightInvoicesComponent } from './freight-invoices/freight-invoices.component';
import { NearbyPodsComponent } from '../admin/nearby-pods/nearby-pods.component';
import { CardMappingComponent } from './card-mapping/card-mapping.component';
import { TransfersComponent } from './transfers/transfers.component';
import { SitesComponent } from './sites/sites.component';
import { FinanceRecoveryComponent } from './finance-recovery/finance-recovery.component';
import { ManageFoPartyComponent } from './manage-fo-party/manage-fo-party.component';
import { FoFuelAverageComponent } from './fo-fuel-average/fo-fuel-average.component';
import { FuelMileageWithOdoComponent } from './fuel-mileage-with-odo/fuel-mileage-with-odo.component';
import { FuelMasterComponent } from './fuel-master/fuel-master.component';
import { WebActivitySummaryComponent } from '../admin/web-activity-summary/web-activity-summary.component';
import { DispatchOrdersComponent } from '../lorry-receipt/dispatch-orders/dispatch-orders.component';
import { FuelConsumptionComponent } from './fuel-consumption/fuel-consumption.component';
import { TripPnlComponent } from './trip-pnl/trip-pnl.component';
import { RouteDashboardComponent } from './route-dashboard/route-dashboard.component';
import { FoUserRoleComponent } from './fo-user-role/fo-user-role.component';
import { TrendsFoComponent } from './trends-fo/trends-fo.component';
import { MvsFreightStatementComponent } from './mvs-freight-statement/mvs-freight-statement.component';
import { UnmergeLRStateComponent } from './unmerge-lrstate/unmerge-lrstate.component';
import { VehicleSupplierAssociationComponent } from './vehicle-supplier-association/vehicle-supplier-association.component';
import { MvGpsApisComponent } from './mv-gps-apis/mv-gps-apis.component';
import { MvGpsApiHistoryComponent } from './mv-gps-api-history/mv-gps-api-history.component';
import { RouteTripComponent } from './route-trip/route-trip.component';
import { TripSummaryComponent } from './trip-summary/trip-summary.component';
import { RouteDeviationsComponent } from './route-deviations/route-deviations.component';
import { FuelDailyConsumptionComponent } from './fuel-daily-consumption/fuel-daily-consumption.component';
import { VehicleStatusChangeComponent } from '../admin/vehicle-status-change/vehicle-status-change.component';
import { VehicleStatusChangeByUserComponent } from './vehicle-status-change-by-user/vehicle-status-change-by-user.component';
import { TripissuesComponent } from './tripissues/tripissues.component';
import { TicketsKpiComponent } from './tickets-kpi/tickets-kpi.component';
import { SupervisorUserAssociationComponent } from './supervisor-user-association/supervisor-user-association.component';
import { TripsComponent } from './trips/trips.component';
import { VehicleStatesComponent } from './vehicle-states/vehicle-states.component';
import { IssuesReportComponent } from './issues-report/issues-report.component';


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
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'load-intelligence',
    loadChildren: 'app/load-intelligence/load-intelligence.module#LoadIntelligenceModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'vehiclestatuschange',
    component: VehicleStatusChangeByUserComponent ,
    canActivate: [AuthGuard, RouteGuard],
},
{
  path: 'vehicle-states',
  component: VehicleStatesComponent ,
  canActivate: [AuthGuard, RouteGuard],
},
{
  path: 'tripissues',
  component: TripissuesComponent ,
  canActivate: [AuthGuard, RouteGuard],
},
{
  path: 'issues-report',
  component: IssuesReportComponent ,
  canActivate: [AuthGuard, RouteGuard],
},
  {

    path: 'vehicle-kpis',
    component: VehicleKpisComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'tickets',
    component: TicketsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'tickets-all',
    component: TicketsAllComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'tickets-kpi',
    component: TicketsKpiComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'lorry-receipts',
    component: LorryRecciptsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'generate-lr',
    component: GenerateLRComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'concise',
    component: ConciseComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'ticket-site-details',
    component: TicketSiteDetailsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'card-mapping',
    component: CardMappingComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
 
  {

    path: 'fuel-average-analysis',
    component: FuelAverageAnalysisComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-trip',
    component: VehicleTripComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'trip',
    component: TripsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'route-mapper',
    component: RouteMapperComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'trends',
    component: TrendsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'placements',
    component: PlacementsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'finance-recovery',
    component: FinanceRecoveryComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'fo-fuel-average',
    component: FoFuelAverageComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'fuel-master',
    component: FuelMasterComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'call-logs',
    component: CallLogsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'driver-call-suggestion',
    component: DriverCallSuggestionComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'site-in-out',
    component: SiteInOutComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'user-call-summary',
    component: UserCallSummaryComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'placements-dash-board',
    component: PlacementsDashBoardComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'trip-status-feedback',
    component: TripStatusFeedbackComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'trip-onward-delay',
    component: TripOnwardDelayComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'user-activity-status',
    component: UserActivityStatusComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'placement-delay-faults',
    component: PlacementDelayFaultsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'vehicle-covered-distance',
    component: VehicleCoveredDistanceComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-gps-detail',
    component: VehicleGpsDetailComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'trip-feedback-logs',
    component: TipFeedbackLogsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'short-target',
    component: ShortTargetComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'onward-kmpd',
    component: onwardKmpdComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-trip-stages',
    component: VehicleTripStagesComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-trip-states',
    component: VehicleTripStagesComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'fuel-fillings',
    component: FuelFillingsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'remaining-fuel',
    component: RemainingFuelComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  // {
  //   path: 'lr-invoice-columns',
  //   component: LrInvoiceColumnsComponent,
  //   canActivate: [AuthGuard,RouteGuard],
  // },
  {
    path: 'consolidate-fuel-average',
    component: ConsolidateFuelAverageComponent,
  },
  {
    path: 'documentation-details',
    component: DocumentationDetailsComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'documents-summary',
    component: DocumentsSummaryComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'document-dashboard',
    component: DocumentDashboardComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'driver-performance',
    component: DriverPerformanceComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-distance',
    component: VehicleDistanceComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'trip-verify-states',
    component: TripVerifyStatesComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'vehicle-performance',
    component: VehiclePerformanceComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'daywise-vehicle-distance',
    component: DaywiseVehicleDistanceComponent,
  },
  {
    path: 'generate-lr-no-vehicles',
    component: GenerateLrNoVehiclesComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  // {
  //   path: 'generate-lr-mainfesto',
  //   component: GenerateLrMainfestoComponent,
  //   canActivate: [AuthGuard,RouteGuard],
  // },
  {
    path: 'view-manifesto',
    component: ViewManifestoComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'driver-list',
    component: DriverListComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'vehicle-driver-mapping',
    component: VehicleDriverMappingComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'driver-attendance',
    component: DriverAttendanceComponent,
    canActivate: [AuthGuard, RouteGuard]

  },
  {
    path: 'driver-document',
    component: DriverDocumentComponent,
    canActivate: [AuthGuard, RouteGuard]

  },


  {
    path: 'lr-pod-receipts',
    component: LrPodReceiptsComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'vehicle-distance-with-odometer',
    component: VehicleDistanceWithOdometerComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'vehicles',
    component: VehiclesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'fse-entry',
    component: FSEEntryComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'vehicle-odoMeter',
    component: VehicleOdometerComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'fuel-indent',
    component: FuelIndentComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'frieght-rate-input',
    component: FrieghtRateInputComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'via-routes',
    component: ViaRoutesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },

  {
    path: 'freight-expenses',
    component: FreightExpensesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'pod-dashboard',
    component: PodDashboardComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'advices',
    component: AdvicesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'freight-invoices',
    component: FreightInvoicesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'nearby-pods',
    component: NearbyPodsComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'transfers',
    component: TransfersComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'sites',
    component: SitesComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'manage-fo-party',
    component: ManageFoPartyComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'fuel-mileage-with-odo',
    component: FuelMileageWithOdoComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'web-acttivity-summary',
    component: WebActivitySummaryComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'dispatch-orders',
    component: DispatchOrdersComponent,
    canActivate: [AuthGuard, RouteGuard]
  }, {
    path: 'fuel-consumption',
    component: FuelConsumptionComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'trip-pnl',
    component: TripPnlComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'route-dashboard',
    component: RouteDashboardComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'fo-user-role',
    component: FoUserRoleComponent,
    canActivate: [AuthGuard, RouteGuard],
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: 'supervisor-user-association',
    component: SupervisorUserAssociationComponent,
    canActivate: [AuthGuard, RouteGuard],
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: 'trends-fo',
    component: TrendsFoComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'mvs-freight-statement',
    component: MvsFreightStatementComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'unmerge-lrstate',
    component: UnmergeLRStateComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'vehicle-supplier-association',
    component: VehicleSupplierAssociationComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'mv-gps-apis',
    component: MvGpsApisComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {
    path: 'mv-gps-api-history',
    component: MvGpsApiHistoryComponent,
    canActivate: [AuthGuard, RouteGuard]
  },
  {

    path: 'route-trip',
    component: RouteTripComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {

    path: 'trip-summary',
    component: TripSummaryComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  {
    path: 'route-deviations',
    component: RouteDeviationsComponent,
    canActivate: [AuthGuard, RouteGuard],

  }, {
    path: 'fuel-daily-consumption',
    component: FuelDailyConsumptionComponent,
    canActivate: [AuthGuard, RouteGuard],
  },
  
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
