import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { DirectiveModule } from '../../directives/directives.module';

@NgModule({
    imports: [
        ThemeModule,
        DirectiveModule
    ],
    declarations: [
        DashboardComponent,
    ],
})
export class DashboardModule { }
