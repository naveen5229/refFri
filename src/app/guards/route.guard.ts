import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  url = null;
  constructor(public user: UserService,
    public common: CommonService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.url = state.url;
    return this.checkRouteAccessPermission(state.url);
  }



  checkRouteAccessPermission(route) {
    let status = false;
    this.user._pages.map(page => {
      if (page.route == route) {
        status = true;
        this.user.permission = {
          add: page.isadd,
          edit: page.isedit,
          delete: page.isdeleted,
        };
      }
    });
    return status;
  }

}


export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuardService implements CanDeactivate<CanComponentDeactivate>{

  canDeactivate(component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    let url: string = state.url;

    return component.canDeactivate ? component.canDeactivate() : true;
  }

}

