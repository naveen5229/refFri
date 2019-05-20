import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { Walle8Component } from './walle8.component';
import { Walle8RoutingModule } from './walle8-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CardMappingComponent } from './card-mapping/card-mapping.component';

const PAGES_COMPONENTS = [
  Walle8Component,
];


@NgModule({
  imports: [
    Walle8RoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    CardMappingComponent
    
  ],
})
export class Walle8Module { }
