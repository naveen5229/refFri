import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostCentersComponent } from '../../acounts-modals/cost-centers/cost-centers.component';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'costcenter',
  templateUrl: './costcenter.component.html',
  styleUrls: ['./costcenter.component.scss']
})
export class CostcenterComponent implements OnInit {
  title = '';
  Accounts = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {

    this.GetAccount();
    this.common.currentPage = 'Cost Center';
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {
    this.GetAccount();
  }

  GetAccount() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Accounts/GetCostCenter', params)
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
      const activeModal = this.modalService.open(CostCentersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          // this.updateAccount(data.Accounts, Accounts.id);
          // return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(CostCentersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          // this.addAccount(data.Accounts);
          //  return;
        }
      });
    }
    this.GetAccount();
  }



  delete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'costcenter'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete Cost Center ',
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

}
