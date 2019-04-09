import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from '../../acounts-modals/accounts/accounts.component';
import { UserService } from '../../@core/data/users.service';
@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  title = '';
  Accounts = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {

    this.GetAccount();
    this.common.currentPage = 'Account';
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh(){
    this.GetAccount();
  }

  GetAccount() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Accounts/GetAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.Accounts = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openAccountModal(Accounts?) {

    if (Accounts) {
      console.log('Accounts', Accounts);
      this.common.params = Accounts;
      const activeModal = this.modalService.open(AccountsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.updateAccount(data.Accounts, Accounts.id);
          return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(AccountsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addAccount(data.Accounts);
          return;
        }
      });
    }
  }

  addAccount(Accounts) {
    console.log('accountdata', Accounts);
    const params = {
      name: Accounts.name,
      foid: 123,
      parentid: Accounts.account.id,
      primarygroupid: Accounts.account.primarygroup_id,
      x_id: 0
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_secondarygroup;
        if (result == '') {
          this.common.showToast("Add Successfull  ");
        }
        else {
          this.common.showToast(result);
        }
        this.GetAccount();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  updateAccount(Accounts, rowid) {
    console.log('updated data', Accounts);
    const params = {
      name: Accounts.name,
      foid: 123,
      parentid: Accounts.account.id,
      primarygroupid: Accounts.account.primarygroup_id,
      x_id: rowid
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_secondarygroup;
        if (result == '') {
          this.common.showToast(" Updated Sucess");
        }
        else {
          this.common.showToast(result);
        }
        this.GetAccount();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

}
