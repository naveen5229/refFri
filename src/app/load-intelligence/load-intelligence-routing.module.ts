import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadIntelligenceComponent } from './load-intelligence.component';
import { ShowRoutesComponent } from './show-routes/show-routes.component';
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';
import { PopulateAltitudeComponent } from './populate-altitude/populate-altitude.component';
import { UploadRoutesComponent } from './upload-routes/upload-routes.component';

const routes: Routes = [{
  path: '',
  component: LoadIntelligenceComponent,
  children: [
      {
          path: 'dashboard',
          component: DashboardComponent,
          canActivate: [AuthGuard, RouteGuard] 
      },
      {
        path: 'show-routes',
        component: ShowRoutesComponent,
        canActivate: [AuthGuard, RouteGuard]
    },
    {
      path: 'populate-altitude',
      component: PopulateAltitudeComponent,
      canActivate: [AuthGuard, RouteGuard]
    },
    {
      path: 'upload-routes',
      component: UploadRoutesComponent,
      canActivate: [AuthGuard, RouteGuard]
    }
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadIntelligenceRoutingModule { }
