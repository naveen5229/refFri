import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  constructor(public user: UserService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('---------------------Route Guards------------------------');
    // console.log('Next', next);
    // console.log('State', state);
    // console.log('-----------------------Route Guards----------------------');

    return this.checkRouteAccessPermission(state.url);

  }

  checkRouteAccessPermission(route) {
    let status = false;
    this.user._pages.map(page => (page.route == route) && (status = true));
    return status;
  }
}
