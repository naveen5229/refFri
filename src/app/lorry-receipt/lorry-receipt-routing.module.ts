import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LorryReceiptComponent } from './lorry-receipt.component';

const routes: Routes = [{
    path: '',
    component: LorryReceiptComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        }]

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LorryReceiptRoutingModule {

}
