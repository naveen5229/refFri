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
import { LRViewComponent } from '../lorry-receipt/lrview/lrview.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';
import { IssueAlertsComponent } from './issue-alerts/issue-alerts.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SiteFencingComponent } from './site-fencing/site-fencing.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { UpdateSiteDetailsComponent } from '../modals/update-site-details/update-site-details.component';
  import { from } from 'rxjs';
import { DocumentsModule } from '../documents/documents.module';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';

const PAGES_COMPONENTS = [
  AdminComponent,
  VehicleStatusChangeComponent,
  EscalationMatrixComponent,
  LRViewComponent,
  GenerateLRComponent,
  GroupManagementsComponent,
  TicketPropertiesComponent,
  IssueAlertsComponent,
  LorryReceiptDetailsComponent,
  SiteFencingComponent,
  DiagnosticsComponent,
  SiteDetailsComponent, 
  UserPreferencesComponent 
];
@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DocumentsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class AdminModule { }
