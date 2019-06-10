import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Walle8Component } from './walle8.component';
import { CardMappingComponent } from './card-mapping/card-mapping.component';
import { CardUsageComponent } from './card-usage/card-usage.component';
import { PaymentsMadeComponent } from './payments-made/payments-made.component';
import { LatestRechargeComponent } from './latest-recharge/latest-recharge.component';
import { TollUsageSummaryComponent } from './toll-usage-summary/toll-usage-summary.component';
import { TollDiscountComponent } from './toll-discount/toll-discount.component';
import { TollUsageComponent } from './toll-usage/toll-usage.component';
import { TollSetteledRequestComponent } from './toll-setteled-request/toll-setteled-request.component';
import { CurrentTagBalanceComponent } from './current-tag-balance/current-tag-balance.component';
import { DoubleTollReportComponent } from './double-toll-report/double-toll-report.component';
import { FinancialTollSummaryComponent } from './financial-toll-summary/financial-toll-summary.component';
import { FinancialTollSummaryAddtimeComponent } from './financial-toll-summary-addtime/financial-toll-summary-addtime.component';
import { FinancialMainSummaryComponent } from './financial-main-summary/financial-main-summary.component';
import { TollAnalaticsComponent } from './toll-analatics/toll-analatics.component';
import { OtherUsageComponent } from './other-usage/other-usage.component';
import { CardBalanceComponent } from './card-balance/card-balance.component';
const routes: Routes = [{
    path: '',
    component: Walle8Component,
    children: [
        {
            path: '',
            component: DashboardComponent,
        },
        {
            path: 'card-mapping',
            component: CardMappingComponent,
        },
        {
            path: 'card-usage',
            component: CardUsageComponent,
        },
        {
            path: 'payments-made',
            component: PaymentsMadeComponent,
        },
        {
            path: 'latest-recharge',
            component: LatestRechargeComponent,
        },
        {
            path: 'toll-usage-summary',
            component: TollUsageSummaryComponent,
        },
        {
            path: 'toll-discount',
            component: TollDiscountComponent,
        },
        {
            path: 'toll-usage',
            component: TollUsageComponent,
        },
        {
            path: 'toll-setteled-request',
            component: TollSetteledRequestComponent,
        },
        {
            path: 'current-tag-balance',
            component: CurrentTagBalanceComponent,
        },
        {
            path: 'double-toll-report',
            component: DoubleTollReportComponent,
        },
        {
            path: 'financial-toll-summary',
            component: FinancialTollSummaryComponent,
        },
        {
            path: 'financial-toll-summary-addtime',
            component: FinancialTollSummaryAddtimeComponent,
        },
        {
            path: 'financial-main-summary',
            component: FinancialMainSummaryComponent,
        },
        {
            path: 'toll-analatics',
            component: TollAnalaticsComponent,
        },
        {
            path: 'other-usage',
            component: OtherUsageComponent,
        },
        {
            path: 'card-balance',
            component: CardBalanceComponent,
        },



    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Walle8RoutingModule {
}
