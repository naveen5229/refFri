import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'intelligence',
    loadChildren: 'app/intelligence/intelligence.module#IntelligenceModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    loadChildren: 'app/accounts/accounts.module#AccountsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'partner',
    loadChildren: 'app/partner/partner.module#PartnerModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'tyres',
    loadChildren: 'app/tyres/tyres.module#TyresModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'battery',
    loadChildren: 'app/battery/battery.module#BatteryModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'ware-house',
    loadChildren: 'app/ware-house/ware-house.module#WareHouseModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'documents',
    loadChildren: 'app/documents/documents.module#DocumentsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'lorry-receipt',
    loadChildren: 'app/lorry-receipt/lorry-receipt.module#LorryReceiptModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'driver',
    loadChildren: 'app/driver/driver.module#DriverModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-maintenance',
    loadChildren: 'app/vehicle-maintenance/vehicle-maintenance.module#VehicleMaintenanceModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'walle8',
    loadChildren: 'app/walle8/walle8.module#Walle8Module',
    canActivate: [AuthGuard],
  },
  {
    path:'challan',
    loadChildren:'app/challan/challan.module#ChallanModule',
    canActivate:[AuthGuard]
  },
  {
    path: 'bid-system',
    loadChildren: 'app/bid-system/bid-system.module#BidSystemModule',
    canActivate: [AuthGuard],
  },

  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'login/:type',
        component: LoginComponent,
      },
      {
        path: 'old-login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
