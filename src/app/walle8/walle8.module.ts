import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { Walle8Component } from './walle8.component';
import { Walle8RoutingModule } from './walle8-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CardMappingComponent } from './card-mapping/card-mapping.component';
import { CardUsageComponent } from './card-usage/card-usage.component';
import { DatePipe } from '@angular/common';
import { PagesModule } from '../pages/pages.module';
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
import { ChartModule } from 'angular2-chartjs';
import { TagSummaryComponent } from './tag-summary/tag-summary.component';
const PAGES_COMPONENTS = [
  Walle8Component,
];


@NgModule({
  imports: [
    Walle8RoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    // PagesModule,
    ChartModule,

  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    CardMappingComponent,
    CardUsageComponent,
    PaymentsMadeComponent,
    LatestRechargeComponent,
    TollUsageSummaryComponent,
    TollDiscountComponent,
    TollUsageComponent,
    TollSetteledRequestComponent,
    CurrentTagBalanceComponent,
    DoubleTollReportComponent,
    FinancialTollSummaryComponent,
    FinancialTollSummaryAddtimeComponent,
    FinancialMainSummaryComponent,
    TollAnalaticsComponent,
    OtherUsageComponent,
    CardBalanceComponent,
    TagSummaryComponent,

  ],
  exports: [
    CardUsageComponent,
  ]
})
export class Walle8Module { }
