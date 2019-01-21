import { NgModule } from '@angular/core';

import { IntelligenceComponent } from './intelligence.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { IntelligenceRoutingModule } from './intelligence-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { ProfitCalculatorComponent } from './profit-calculator/profit-calculator.component';

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
    ProfitCalculatorComponent,
  ],
})
export class IntelligenceModule {
}
