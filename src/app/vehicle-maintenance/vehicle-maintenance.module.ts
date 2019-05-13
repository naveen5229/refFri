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
import { MaintenanaceDashboardComponent } from './maintenanace-dashboard/maintenanace-dashboard.component';

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
    MaintenanaceDashboardComponent,

  ],
  entryComponents: [
    AddMaintenanceComponent,
    MaintenanaceDashboardComponent
  ]
})
export class VehicleMaintenanceModule { }
