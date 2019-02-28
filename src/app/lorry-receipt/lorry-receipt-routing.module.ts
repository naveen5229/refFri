import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LorryReceiptComponent } from './lorry-receipt.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [{
    path: '',
    component: LorryReceiptComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
       
       
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TyresRoutingModule {
}
