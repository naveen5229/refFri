import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminComponent } from './admin.component';
import { VehicleStatusChangeComponent } from './vehicle-status-change/vehicle-status-change.component';
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component';
import { DirectiveModule } from '../directives/directives.module';
import { GroupManagementsComponent } from './group-managements/group-managements.component';
import { TicketPropertiesComponent } from './ticket-properties/ticket-properties.component';
import { LorryReceiptDetailsComponent } from './lorry-receipt-details/lorry-receipt-details.component';
import { IssueAlertsComponent } from './issue-alerts/issue-alerts.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SiteFencingComponent } from './site-fencing/site-fencing.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { UpdateSiteDetailsComponent } from '../modals/update-site-details/update-site-details.component';
import { from } from 'rxjs';
import { DocumentsModule } from '../documents/documents.module';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { VSCTicketAuditComponent } from './vscticket-audit/vscticket-audit.component';
import { AlertRelatedIssueComponent } from './alert-related-issue/alert-related-issue.component';
import { GpsSupplierMappingComponent } from './gps-supplier-mapping/gps-supplier-mapping.component';
import { VehiclesViewComponent } from './vehicles-view/vehicles-view.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { TransportAgentsComponent } from './transport-agents/transport-agents.component';
import { LorryReceiptModule } from '../lorry-receipt/lorry-receipt.module';
import { DriverModule } from '../driver/driver.module';
import { PagesModule } from '../pages/pages.module';
import { VehicleGpsTrailComponent } from './vehicle-gps-trail/vehicle-gps-trail.component';
import { GpsTrailsComponent } from './gps-trails/gps-trails.component';
import { FuelFillingsComponent } from './fuel-fillings/fuel-fillings.component';
import { SubSitesComponent } from './sub-sites/sub-sites.component';
import { ActivitySummaryComponent } from './activity-summary/activity-summary.component';
import { VehicleGpsDetailComponent } from './vehicle-gps-detail/vehicle-gps-detail.component';
import { VehicleDistanceComponent } from './vehicle-distance/vehicle-distance.component';
import { TransportAreaComponent } from './transport-area/transport-area.component';
import { TripSiteRuleComponent } from './trip-site-rule/trip-site-rule.component';
import { TripStatusFeedbackLogsComponent } from './trip-status-feedback-logs/trip-status-feedback-logs.component';
import { ImageViewerModule } from 'ng2-image-viewer';
import { RemainingFuelComponent } from './remaining-fuel/remaining-fuel.component';
import { SharedModule } from '../shared.module';
import { TicketSubscribeComponent } from './ticket-subscribe/ticket-subscribe.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FuelRulesComponent } from './fuel-rules/fuel-rules.component';
import { PumpStationAreaComponent } from './pump-station-area/pump-station-area.component';
import { PendingVehicleComponent } from './pending-vehicle/pending-vehicle.component';



const PAGES_COMPONENTS = [
  AdminComponent,
  VehicleStatusChangeComponent,
  EscalationMatrixComponent,
  GroupManagementsComponent,
  TicketPropertiesComponent,
  IssueAlertsComponent,
  LorryReceiptDetailsComponent,
  SiteFencingComponent,
  DiagnosticsComponent,
  SiteDetailsComponent,
  UserPreferencesComponent,
  GpsSupplierMappingComponent,
  VehiclesViewComponent,
  VehicleGpsTrailComponent,
  ActivitySummaryComponent,
  VehicleGpsDetailComponent,
  TicketSubscribeComponent,
  AddCustomerComponent,
  FuelRulesComponent,
  PumpStationAreaComponent



];
@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DocumentsModule,
    LorryReceiptModule,
    DriverModule,
    ImageViewerModule,
    SharedModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    VSCTicketAuditComponent,
    AlertRelatedIssueComponent,
    GpsSupplierMappingComponent,
    VehiclesViewComponent,
    CompanyDetailsComponent,
    TransportAgentsComponent,
    VehicleGpsTrailComponent,
    GpsTrailsComponent,
    SubSitesComponent,
    ActivitySummaryComponent,
    VehicleGpsDetailComponent,
    // VehicleDistanceComponent,
    TransportAreaComponent,
    TripSiteRuleComponent,
    TripStatusFeedbackLogsComponent,
    TicketSubscribeComponent,
    AddCustomerComponent,
    FuelRulesComponent,
    PumpStationAreaComponent,
    PendingVehicleComponent


  ],
  exports: [
  ],
})
export class AdminModule { }
