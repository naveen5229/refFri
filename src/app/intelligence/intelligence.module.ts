import { NgModule } from '@angular/core';

import { IntelligenceComponent } from './intelligence.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntelligenceRoutingModule } from './intelligence-routing.module';
import { ThemeModule } from '../@theme/theme.module';

const PAGES_COMPONENTS = [
  IntelligenceComponent,
];

@NgModule({

  imports: [
    IntelligenceRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class IntelligenceModule {
}
