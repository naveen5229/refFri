import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LorryReceiptComponent } from './lorry-receipt.component';
import { LRViewComponent } from './lrview/lrview.component';
import { GenerateLRComponent } from './generate-lr/generate-lr.component';
const routes: Routes = [{
    path: '',
    component: LorryReceiptComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        }
    , {
        path: 'lrview',
        component: LRViewComponent,
    },
    {
        path: 'generate-lr',
        component: GenerateLRComponent,
    }
]

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LorryReceiptRoutingModule {

}
