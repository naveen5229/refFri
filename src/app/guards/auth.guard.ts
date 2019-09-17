import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CommonService } from '../services/common.service';
import { ActivityService } from '../services/Activity/activity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(public user: UserService,
    public common: CommonService,
    public activity: ActivityService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.user._token) {
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      if (this.user._loggedInBy == 'customer') {
        this.activity.routerDetection(state.url);
      }

      return true;
    }
  }
}
