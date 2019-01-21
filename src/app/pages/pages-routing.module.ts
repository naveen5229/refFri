import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
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
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'vehicle-kpis',
      component: VehicleKpisComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'tickets',
      component: TicketsComponent,
    },
    {
      path: 'tickets-all',
      component: TicketsAllComponent,
    },
    {
      path: 'lorry-receipts',
      component: LorryRecciptsComponent,
    },
    {
      path: 'expenses',
      component: ExpensesComponent,
    },
    {
      path:'concise',
      component: ConciseComponent,
    },
    {
      path: 'ticket-site-details',
      component: TicketSiteDetailsComponent
    },
    {
      path: 'ticket-details',
      component: TicketDetailsComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
