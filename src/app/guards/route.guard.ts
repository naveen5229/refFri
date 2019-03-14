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
    console.log('---------------------------------------------');
    console.log('Next', next);
    console.log('State', state);
    console.log('---------------------------------------------');

    return this.checkRouteAccessPermission(state.url);
    // if (!this.user._token) {
    //   this.router.navigate(['/auth/login']);
    //   return false;
    // } else {
    //   return true;
    // }
  }

  checkRouteAccessPermission(route) {
    let status = false;
    this.user._pages.map(page => (page.route == route) && (status = true));
    return status;
  }
}
