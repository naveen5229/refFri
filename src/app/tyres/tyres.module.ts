import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TyresRoutingModule } from './tyres-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TyresComponent } from './tyres.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InputsComponent } from './inputs/inputs.component';
import { DirectiveModule } from '../directives/directives.module';
import { TyreHealthCheckUpComponent } from './tyre-health-check-up/tyre-health-check-up.component';
import { AddTrollyComponent } from './add-trolly/add-trolly.component';
import { VehicleTrollyMappingComponent } from './vehicle-trolly-mapping/vehicle-trolly-mapping.component';

const PAGES_COMPONENTS = [
  TyresComponent,
];


@NgModule({
  imports: [
    TyresRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    InventoryComponent,
    InputsComponent,
    TyreHealthCheckUpComponent,
    AddTrollyComponent,
    VehicleTrollyMappingComponent,
  ],
})
export class TyresModule { }
