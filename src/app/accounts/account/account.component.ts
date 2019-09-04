import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from '../../acounts-modals/accounts/accounts.component';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  title = '';
  Accounts = [];
  pageName="";
  staticCondition=0;
  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      if(this.common.params && this.common.params.pageName){
        this.pageName=this.common.params.pageName;
        this.staticCondition=1;
    }
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
      foid: 123,
      staticCondition:this.staticCondition
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
          this.common.showToast(" Updated Successfull");
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

  delete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'secondary_group'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete City ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Stock/deletetable', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              this.GetAccount();
              this.common.showToast(" This Value Has been Deleted!");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('This Value has been used another entry!');
            });
        }
      });
    }
  }

  modelCondition() {
    this.activeModal.close({ });
    event.preventDefault();
    return;
  }
}
