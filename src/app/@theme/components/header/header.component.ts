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

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    public accountService: AccountService,
    public router: Router,
    public user: UserService,
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
      this.user._token = '';
      this.user._details = null;
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }
  }

  openChangeModal() {
    console.log("open change modal");
    this.modalService.open(CustomerSelectionComponent, { size: 'md', container: 'nb-layout', windowClass: 'admin-popup' });
  }

  backTOHome() {
    this.user._customer = { name: '', id: '' };
    this.router.navigate(['/admin']);
  }

  refresh() {
    // window.location.reload();
    // this.router.navigateByUrl('/pages/dashboard', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(["ConciseComponent"]));
    this.common.refresh();
  }

}
