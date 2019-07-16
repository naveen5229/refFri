import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WareHouseRoutingModule } from './ware-house-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DirectiveModule } from '../directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { WareHouseComponent } from './ware-house-component';
import { WareHouseDashbordComponent } from './ware-house-dashbord/ware-house-dashbord.component';


const PAGES_COMPONENTS = [
  WareHouseComponent,
];

@NgModule({
  declarations: [
    ...PAGES_COMPONENTS,
    WareHouseDashbordComponent,

  ],
  imports: [
    CommonModule,
    WareHouseRoutingModule,
    ThemeModule,
    DirectiveModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class WareHouseModule { }
