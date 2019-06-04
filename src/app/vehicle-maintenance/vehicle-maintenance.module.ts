import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleMaintenanceComponent } from './vehicle-maintenance-components';
import { VehicleMaintenanceRoutingModule } from './vehicle-maintenance-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from '../documents/dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { ImageViewerModule } from 'ng2-image-viewer';
import { AddVehicleMaintenanceComponent } from './add-vehicle-maintenance/add-vehicle-maintenance.component';
import { AddMaintenanceComponent } from './model/add-maintenance/add-maintenance.component';
import { ViewMaintenanceComponent } from './model/view-maintenance/view-maintenance.component';
import { MaintenanaceDashboardComponent } from './maintenanace-dashboard/maintenanace-dashboard.component';
import { MaintenanceSummaryComponent } from './maintenance-summary/maintenance-summary.component';
import { MaintenanceReportComponent } from './model/maintenance-report/maintenance-report.component';
import { AddVehicleModalServiceComponent } from './model/add-vehicle-modal-service/add-vehicle-modal-service.component';
import { ViewModalServiceComponent } from './view-modal-service/view-modal-service.component';

const PAGES_COMPONENTS = [
  VehicleMaintenanceComponent,
];
@NgModule({

  imports: [
    VehicleMaintenanceRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    ImageViewerModule
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
    AddVehicleModalServiceComponent,
    ViewModalServiceComponent,

  ],
  entryComponents: [
    AddMaintenanceComponent,
    ViewMaintenanceComponent,
    AddVehicleModalServiceComponent,
    MaintenanaceDashboardComponent,
    MaintenanceReportComponent
  ]
})
export class VehicleMaintenanceModule { }
