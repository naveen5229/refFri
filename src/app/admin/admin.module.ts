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

const PAGES_COMPONENTS = [
  AdminComponent,
];


@NgModule({
  imports: [
    AdminRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    VehicleStatusChangeComponent,
    EscalationMatrixComponent,
    GroupManagementsComponent
  ],
})
export class AdminModule { }
