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
Accounts =[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
    this.GetAccount();
    }

  ngOnInit() {
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

  openAccountModal (Accounts?) {
   // console.log('Accounts',Accounts);
      if (Accounts) this.common.params = Accounts;
      const activeModal = this.modalService.open(AccountsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
         this.addAccount(data.Accounts);
        }
      });
    }

    addAccount(Accounts) {
      console.log('accountdata',Accounts);
     // const params ='';
      const params = {
          name: Accounts.name,
          foid: Accounts.user.id,
          parentid: Accounts.account.id,
          primarygroupid: Accounts.account.primarygroup_id,
          x_id:0
       };
  
       console.log('params11: ',params);
      this.common.loading++;
  
      this.api.post('Accounts/InsertAccount', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res: ', res);
          this.GetAccount();
        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
  
    }
}
