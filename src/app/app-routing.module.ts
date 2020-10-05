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
import { CheckloginandredirectComponent } from './auth/checkloginandredirect/checkloginandredirect.component';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('app/pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'load-intelligence',
    loadChildren: () => import('app/load-intelligence/load-intelligence.module').then(m => m.LoadIntelligenceModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'intelligence',
    loadChildren: () => import('app/intelligence/intelligence.module').then(m => m.IntelligenceModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    loadChildren: () => import('app/accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'partner',
    loadChildren: () => import('app/partner/partner.module').then(m => m.PartnerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tyres',
    loadChildren: () => import('app/tyres/tyres.module').then(m => m.TyresModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'battery',
    loadChildren: () => import('app/battery/battery.module').then(m => m.BatteryModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ware-house',
    loadChildren: () => import('app/ware-house/ware-house.module').then(m => m.WareHouseModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'documents',
    loadChildren: () => import('app/documents/documents.module').then(m => m.DocumentsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'lorry-receipt',
    loadChildren: () => import('app/lorry-receipt/lorry-receipt.module').then(m => m.LorryReceiptModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'driver',
    loadChildren: () => import('app/driver/driver.module').then(m => m.DriverModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle-maintenance',
    loadChildren: () => import('app/vehicle-maintenance/vehicle-maintenance.module').then(m => m.VehicleMaintenanceModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'walle8',
    loadChildren: () => import('app/walle8/walle8.module').then(m => m.Walle8Module),
    canActivate: [AuthGuard],
  },
  {
    path:'challan',
    loadChildren:() => import('app/challan/challan.module').then(m => m.ChallanModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'bid-system',
    loadChildren: () => import('app/bid-system/bid-system.module').then(m => m.BidSystemModule),
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
        path: 'checkloginandredirect',
        component: CheckloginandredirectComponent,
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
