/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './auth/login/login.component';
import { HttpModule } from '@angular/http';
import { KpisDetailsComponent } from './modals/kpis-details/kpis-details.component';
import { LocationMarkerComponent } from './modals/location-marker/location-marker.component';
import { TicketTrailsComponent } from './modals/ticket-trails/ticket-trails.component';
import { ImageViewComponent } from './modals/image-view/image-view.component';
import { BuyTimeComponent } from './modals/buy-time/buy-time.component';
import { ReminderComponent } from './modals/reminder/reminder.component';
import { TicketForwardComponent } from './modals/ticket-forward/ticket-forward.component';
import { RemarkModalComponent } from './modals/remark-modal/remark-modal.component';
import { VehicleHaltComponent } from './modals/vehicle-halt/vehicle-halt.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { DatePickerComponent } from './modals/date-picker/date-picker.component';
import { LocationSelectionComponent } from './modals/location-selection/location-selection.component';
import { ViewListComponent } from './modals/view-list/view-list.component';
import { VehicleTripUpdateComponent } from './modals/vehicle-trip-update/vehicle-trip-update.component';




@NgModule({
  declarations: [AppComponent, 
    LoginComponent, 
    KpisDetailsComponent, 
    LocationMarkerComponent, 
    TicketTrailsComponent, 
    ImageViewComponent, 
    TicketForwardComponent, 
    BuyTimeComponent, 
    ReminderComponent, 
    RemarkModalComponent, 
    VehicleHaltComponent, 
    ConfirmComponent, 
    DatePickerComponent,
    LocationSelectionComponent,
    ViewListComponent,
    VehicleTripUpdateComponent],
    
  entryComponents: [
    KpisDetailsComponent,
    LocationMarkerComponent,
    ImageViewComponent,
    TicketTrailsComponent,
    BuyTimeComponent,
    ReminderComponent,
    TicketForwardComponent,
    RemarkModalComponent,
    VehicleHaltComponent,
    ConfirmComponent,
    DatePickerComponent,
    LocationSelectionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
