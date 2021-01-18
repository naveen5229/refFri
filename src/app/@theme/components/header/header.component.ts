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
import { BankDetailsComponent } from '../../../modals/bank-details/bank-details.component';
import * as localforage from 'localforage';
import { TicketFormFieldComponent } from '../../../modals/ticket-form-field/ticket-form-field.component';

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
          if (this.user._loggedInBy == 'customer') {
            this.activity.activityHandler('logout');
          }
          this.user.resetUserService();
          this.common.resetCommonService();
          
          localStorage.removeItem('USER_DETAILS');
          localStorage.removeItem('USER_TOKEN');
          localStorage.removeItem('LOGGED_IN_BY');
          localStorage.removeItem('CUSTOMER_DETAILS');
          localStorage.removeItem('DOST_USER_PAGES');
          localStorage.removeItem('DOST_axesToken');
          localStorage.removeItem('iswallet');
          localStorage.removeItem('DOST_axesToken');
          
          localforage.clear();
          this.router.navigate(['/auth/login']);
          console.log("logout", res);
        }, err => {
          --this.common.loading;
          this.common.showError();
          console.log(err);
        });


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
    this.refresh();
    console.log('________', this.accountService.selected.branch);
  }

  openBankModal() {
    console.log("openBankModal");
    const activeModal = this.modalService.open(BankDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  openCustomerComplaint(){
    this.common.params = null;
    // console.log("CurrentUrl:",this.common.params.currentUrl);
    const activeModal = this.modalService.open(TicketFormFieldComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  } 

}
