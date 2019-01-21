import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IntelligenceComponent } from './intelligence.component';
import { ProfitCalculatorComponent } from './profit-calculator/profit-calculator.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: IntelligenceComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
          path:'profit-calculator',
          component: ProfitCalculatorComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IntelligenceRoutingModule {
}
