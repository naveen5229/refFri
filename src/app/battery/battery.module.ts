import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatteryRoutingModule } from './battery-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { BatteryComponent } from './battery.component';
import { BatteryInventoryComponent } from './battery-inventory/battery-inventory.component';
import { DirectiveModule } from '../directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

const PAGES_COMPONENTS = [
    BatteryComponent,
];


@NgModule({
    imports: [
        BatteryRoutingModule,
        ThemeModule,
        DirectiveModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    declarations: [
        ...PAGES_COMPONENTS,
        BatteryInventoryComponent,

    ],
})
export class BatteryModule { }
