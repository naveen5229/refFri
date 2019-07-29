import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss']
})
export class CustomerSelectionComponent implements OnInit {
  showSuggestions = false;
  suggestions = [];
  searchString = "";
  date = this.common.dateFormatter(new Date());

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    public accountService: AccountService,
    public router: Router,
    private route: ActivatedRoute,

  ) {
    this.common.handleModalSize('class', 'modal-lg', '480');

  }

  ngOnInit() {
  }

  searchUser() {
    this.showSuggestions = true;
    let params = 'search=' + this.searchString;
    this.api.get('Suggestion/getAllFoAdminListwithCustomer?' + params) // Customer API
      .subscribe(res => {
        this.suggestions = res['data'];
        console.log("suggestions", this.suggestions);
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectUser(user) {
    this.accountService.branches = [];
    this.searchString = user.foaname + " - " + user.foname;
    this.showSuggestions = false;
    this.user._customer.name = this.searchString;
    this.user._customer.id = user.foaid;
    localStorage.setItem('CUSTOMER_DETAILS', JSON.stringify(this.user._customer));
    this.api.getBranches();
    this.dismiss();
    //this.common.refresh();
    this.common.params.refreshPage();
    // if (window.location.href.endsWith('admin')||window.location.href.endsWith('pages')) {
    //   window.location.reload();
    // }
    // else if (window.location.href.includes('admin')) {
    //   this.router.navigate(['/admin']);
    // } else if  (window.location.href.includes('pages')){
    //   this.router.navigate(['/pages']);
    // }

  }

  dismiss() {
    this.activeModal.close();
  }

}
