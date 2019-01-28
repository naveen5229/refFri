import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api2.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;
  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  showSuggestions = false;
  suggestions = [];
  foAdminName="";
  foAdminUserId = null;
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              public router: Router,
              private userService: UserService,
              private analyticsService: AnalyticsService,
              public api : ApiService,
              public common : CommonService) {
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  logout(){
    if(confirm('Are you sure to logout?')){
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }
  }

  searchUser() {
    this.showSuggestions = true;
    let params = 'search=' + this.foAdminName;
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
 
  selectUser(user) {
    this.foAdminName = user.name;
    this.foAdminUserId = user.id;
    this.showSuggestions = false;
  }
}
