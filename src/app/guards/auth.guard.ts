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

  state = "";

  constructor(public user: UserService,
    public common: CommonService,
    public activity: ActivityService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Next', next);
    console.log('State', state);

    // this.common.params=state.url;

    if (!this.user._token) {
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      if (this.user._loggedInBy == 'customer') {
        this.state = "login";
        let date;
        date = this.common.dateFormatter(new Date());
        this.activity.heartbeat();
        this.activity.ActivityHandler(this.state, date);
        console.log('State_Url', state.url);
        // this.activity.RouterDetection(state.url);

      }

      return true;
    }
  }
}
