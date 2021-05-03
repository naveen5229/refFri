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
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';
import { TagSummaryComponent } from './tag-summary/tag-summary.component';
import { FinancialhistorysummaryComponent } from './financialhistorysummary/financialhistorysummary.component';
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
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'card-usage',
            component: CardUsageComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'payments-made',
            component: PaymentsMadeComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'latest-recharge',
            component: LatestRechargeComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'toll-usage-summary',
            component: TollUsageSummaryComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'toll-discount',
            component: TollDiscountComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'toll-usage',
            component: TollUsageComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'toll-setteled-request',
            component: TollSetteledRequestComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'current-tag-balance',
            component: CurrentTagBalanceComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'double-toll-report',
            component: DoubleTollReportComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'financial-toll-summary',
            component: FinancialTollSummaryComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'financial-toll-summary-addtime',
            component: FinancialTollSummaryAddtimeComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'financial-main-summary',
            component: FinancialMainSummaryComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'toll-analatics',
            component: TollAnalaticsComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'other-usage',
            component: OtherUsageComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'card-balance',
            component: CardBalanceComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'tag-summary',
            component: TagSummaryComponent,
            // canActivate: [AuthGuard, RouteGuard]
        },
        {
            path: 'financialhistorysummary',
            component: FinancialhistorysummaryComponent,
            // canActivate: [AuthGuard, RouteGuard]
        },



    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Walle8RoutingModule {
}
