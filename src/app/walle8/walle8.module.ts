import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { Walle8Component } from './walle8.component';
import { Walle8RoutingModule } from './walle8-routing.module';
import { ThemeModule } from '../@theme/theme.module';

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
  ],
})
export class Walle8Module { }
