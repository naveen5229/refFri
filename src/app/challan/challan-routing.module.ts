import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';
import { ChallanComponent } from './challan-component';
import { PendingChallanComponent } from './pending-challan/pending-challan.component';

const routes: Routes = [

    {
        path: '',
        component: ChallanComponent,
        children: [
            {
                path: 'pending-challan',
                component: PendingChallanComponent,
                canActivate: [AuthGuard,RouteGuard]
            },
            



        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChallanRoutingModule {
}