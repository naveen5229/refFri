import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleMaintenanceComponent } from './vehicle-maintenance-components';
import { VehicleMaintenanceRoutingModule } from './vehicle-maintenance-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from '../documents/dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { AddVehicleMaintenanceComponent } from './add-vehicle-maintenance/add-vehicle-maintenance.component';
import { AddMaintenanceComponent } from './model/add-maintenance/add-maintenance.component';
import { ViewMaintenanceComponent } from './model/view-maintenance/view-maintenance.component';
import { MaintenanaceDashboardComponent } from './maintenanace-dashboard/maintenanace-dashboard.component';
import { MaintenanceSummaryComponent } from './maintenance-summary/maintenance-summary.component';
import { MaintenanceReportComponent } from './model/maintenance-report/maintenance-report.component';
import { AddVehicleModalServiceComponent } from './model/add-vehicle-modal-service/add-vehicle-modal-service.component';
import { AddVehicleSubModalServiceComponent } from './model/add-vehicle-sub-modal-service/add-vehicle-sub-modal-service.component';
import { ViewModalServiceComponent } from './view-modal-service/view-modal-service.component';
import { SharedModule } from '../shared.module';
import { ViewSubModalServiceComponent } from './view-sub-modal-service/view-sub-modal-service.component';
import { AddAdvancedMaintenanceComponent } from './model/add-advanced-maintenance/add-advanced-maintenance.component';
import { ViewSummaryDetailsComponent } from './model/view-summary-details/view-summary-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-chartjs';
import { ResizableModule } from 'angular-resizable-element';

const PAGES_COMPONENTS = [
  VehicleMaintenanceComponent,
];
@NgModule({

  imports: [
    VehicleMaintenanceRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    SharedModule,
    ChartModule,
    ResizableModule
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    AddVehicleMaintenanceComponent,
    AddMaintenanceComponent,
    ViewMaintenanceComponent,
    MaintenanaceDashboardComponent,
    MaintenanceSummaryComponent,
    MaintenanceReportComponent,
    ViewSummaryDetailsComponent,
    DashboardComponent,
  ],
  entryComponents: [
    AddMaintenanceComponent,
    ViewMaintenanceComponent,
    MaintenanaceDashboardComponent,
    MaintenanceSummaryComponent,
    MaintenanceReportComponent,
    ViewSummaryDetailsComponent
  ],
  exports: [
    ViewModalServiceComponent,
    ViewSubModalServiceComponent

  ],
})
export class VehicleMaintenanceModule { }
