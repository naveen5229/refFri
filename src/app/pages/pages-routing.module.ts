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
import { FuelAverageAnalysisComponent } from './fuel-average-analysis/fuel-average-analysis.component';
import { VehicleTripComponent } from './vehicle-trip/vehicle-trip.component';
import { TrendsComponent } from './trends/trends.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';


import { from } from 'rxjs';
import { ImageProcessingComponent } from './image-processing/image-processing.component';
import { RouteMapperComponent } from './route-mapper/route-mapper.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: '',
    component: ConciseComponent
  },
  {
    path: 'dashboard',
    component: ConciseComponent,
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
  // {
  //   path:'generate-lr',
  //   component:GenerateLRComponent,
  // },
  {
    path: 'expenses',
    component: ExpensesComponent,
  },
  {
    path: 'concise',
    component: ConciseComponent,
  },
  {
    path: 'ticket-site-details',
    component: TicketSiteDetailsComponent
  },
  {
    path: 'ticket-details',
    component: TicketDetailsComponent
  },
  {
    path: 'fuel-average-analysis',
    component: FuelAverageAnalysisComponent
  },
  {
    path: 'vehicle-trip',
    component: VehicleTripComponent
  },
  {
    path: 'route-mapper',
    component: RouteMapperComponent
  },
  {
    path: 'trends',
    component: TrendsComponent
  },
  // {
  //   path: 'image-processing',
  //   component: ImageProcessingComponent
  // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
