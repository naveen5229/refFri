import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostCentersComponent } from '../../acounts-modals/cost-centers/cost-centers.component';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
    this.common.currentPage = 'Cost Category';
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
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
          this.updateCostCenter(data.costCenter, Accounts.id)
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(CostCentersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addCostCenter(data.costCenter);
          return;
        }
      });
    }
  }





  addCostCenter(costCenter) {
    console.log('costCenter', costCenter);
    const params = {
      parentName: costCenter.parentName,
      parentid: costCenter.parentId,
      foid: 123,
      x_id: costCenter.xid,
      name: costCenter.name,
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_costcenter;
        if (result == '') {
          this.common.showToast("Save Successfully");
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

  updateCostCenter(costCenter, rowid) {
    console.log('costCenter', costCenter);
    const params = {
      parentName: costCenter.parentName,
      parentid: costCenter.parentId,
      foid: 123,
      x_id: rowid,
      name: costCenter.name,
    };
    console.log('params123: ', params);

    this.common.loading++;
    this.api.post('Accounts/InsertCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_costcenter;
        if (result == '') {
          this.common.showToast("Save Successfully");
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
