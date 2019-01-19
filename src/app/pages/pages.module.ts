import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { LoginComponent } from './login/login.component';
import { VehicleKpisComponent } from './vehicle-kpis/vehicle-kpis.component';
import { KpisDetailsComponent } from '../modals/kpis-details/kpis-details.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsAllComponent } from './tickets-all/tickets-all.component';
import { LorryRecciptsComponent } from './lorry-receipts/lorry-reccipts.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ConciseComponent } from './concise/concise.component';
import { TicketTrailsComponent } from '../modals/ticket-trails/ticket-trails.component';
import { ChartModule } from 'angular2-chartjs';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
 
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    ChartModule

  ],
  declarations: [
    ...PAGES_COMPONENTS,
    LoginComponent,
    VehicleKpisComponent,
    TicketsComponent,
    TicketsAllComponent,
    LorryRecciptsComponent,
    ExpensesComponent,
    ConciseComponent,

  ],
})
export class PagesModule {
}
