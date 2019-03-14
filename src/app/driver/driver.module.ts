import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';

import { DatePipe } from '@angular/common';
import { DriverComponent } from './driver.component';
import { DriverRoutingModule } from './driver-routing.module';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { VehicleDriverMappingComponent } from './vehicle-driver-mapping/vehicle-driver-mapping.component';

const PAGES_COMPONENTS = [
  DriverComponent,
];


@NgModule({
  imports: [
    DriverRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    AddDriverComponent,
    DriverListComponent,
    VehicleDriverMappingComponent,
  ],
})
export class DriverModule { }
