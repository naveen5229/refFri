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
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { TicketSiteDetailsComponent } from './ticket-site-details/ticket-site-details.component';
import { TicketActionsComponent } from './ticket-actions/ticket-actions.component';
import { RemarkModalComponent } from '../modals/remark-modal/remark-modal.component';
import { DatePickerComponent } from '../modals/date-picker/date-picker.component';

import { from } from 'rxjs';
import { FuelAverageAnalysisComponent } from './fuel-average-analysis/fuel-average-analysis.component';
import { VehicleTripComponent } from './vehicle-trip/vehicle-trip.component';
import { AutoSuggestionComponent } from '../directives/auto-suggestion/auto-suggestion.component';
import { DirectiveModule } from '../directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { VehicleSearchComponent } from '../modals/vehicle-search/vehicle-search.component';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ReactiveFormsModule } from '@angular/forms';
import { DriversAttendanceComponent } from './drivers-attendance/drivers-attendance.component';
import { VehicleReportComponent } from './vehicle-report/vehicle-report.component';
import { TrendsComponent } from './trends/trends.component';




const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({

  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    ChartModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ImageViewerModule,
    ReactiveFormsModule
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
    TicketDetailsComponent,
    TicketSiteDetailsComponent,
    TicketActionsComponent,
    ConciseComponent,
    FuelAverageAnalysisComponent,
    VehicleTripComponent,
    VehicleReportComponent,
    TrendsComponent,
   
    
    DriversAttendanceComponent,
  ],
})
export class PagesModule {
}
