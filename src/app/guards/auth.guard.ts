import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public user: UserService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Next', next);
    console.log('State', state);

    if (!this.user._token) {
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      return true;
    }
  }
}
