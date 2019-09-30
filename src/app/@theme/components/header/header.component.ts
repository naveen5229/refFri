import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../services/user.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerSelectionComponent } from '../../../modals/customer-selection/customer-selection.component';
import { AccountService } from '../../../services/account.service';
import { ActivityService } from '../../../services/Activity/activity.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  showSuggestions = false;
  suggestions = [];
  searchString = "";
  branches = [
    {
      "id": 0,
      "name": "All"
    },
    {
      "id": 5,
      "name": "test2322"
    }
  ];
  selectedBranch = 0;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    public accountService: AccountService,
    public router: Router,
    public user: UserService,
    public activity: ActivityService,
    private analyticsService: AnalyticsService,
    public api: ApiService,
    public modalService: NgbModal,
    public common: CommonService) {

  }

  ngOnInit() {

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

  // startSearch() {
  //   this.analyticsService.trackEvent('startSearch');
  // }

  logout() {
    if (confirm('Are you sure to logout?')) {

      let params = {};
      ++this.common.loading;
      this.api.post('Login/logout', params)
        .subscribe(res => {
          --this.common.loading;
          this.common.showToast(res['msg']);
          console.log("logout", res);
        }, err => {
          --this.common.loading;
          this.common.showError();
          console.log(err);
        });
      if (this.user._loggedInBy == 'customer') {
        this.activity.activityHandler('logout');
      }
      this.user._token = '';
      this.user._details = null;
      this.user._loggedInBy = '';
      this.user._pages = null;
      this.user._menu = {
        admin: [],
        pages: [],
        tyres: [],
        battery: [],
        vehicleMaintenance: [],
        wareHouse: [],
        account: [],
      };
      localStorage.clear();
      localStorage.removeItem('DOST_USER_PAGES');
      this.router.navigate(['/auth/login']);
    }
  }

  openChangeModal() {
    console.log("open change modal");
    this.common.params = { refreshPage: this.common.refresh };

    this.modalService.open(CustomerSelectionComponent, { container: 'nb-layout', windowClass: 'admin-popup' });
  }

  backTOHome() {
    // this.user._customer = { name: '', id: '' };
    this.router.navigate(['/admin']);
  }

  refresh() {
    if (!this.common.refresh) {
      this.router.navigateByUrl('/pages/dashboard');
      return;
    }
    this.common.refresh();
  }

  selectBranch() {
    this.accountService.selected.branch = this.accountService.branches.find(branch => {
      if (branch.id == this.accountService.selected.branchId) return true;
      return false;
    });
    console.log('________', this.accountService.selected.branch);
  }

}
