import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service'
import { WareHouseModalComponent } from '../../acounts-modals/ware-house-modal/ware-house-modal.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ware-house',
  templateUrl: './ware-house.component.html',
  styleUrls: ['./ware-house.component.scss']
})
export class WareHouseComponent implements OnInit {
  wareHouseData = [];


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {

    this.getWareHouseData();

    this.common.currentPage = 'Ware House';
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getWareHouseData();
  }
  getWareHouseData() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('company/getWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data'].invoice[0]);
        this.wareHouseData = res['data'].invoice;
        console.log("after api data:", this.wareHouseData);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openwareHouseModal(wareHouse?) {

    if (wareHouse) {
      console.log('ware House', wareHouse);
      this.common.params = wareHouse;
      this.common.params.title = 'Ware house';
      const activeModal = this.modalService.open(WareHouseModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.updateWareHouse(data.wareHouse, wareHouse.id);
          return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(WareHouseModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addWareHouse(data.wareHouse);
          return;
        }
      });
    }
  }


  addWareHouse(wareHouse) {
    console.log('wareHouse', wareHouse);
    const params = {
      name: wareHouse.name,
      foid: 123,
      parentid: wareHouse.account.id,
      primarygroupid: wareHouse.account.primarygroup_id,
      x_id: 0
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_warehouse;
        if (result == '') {
          this.common.showToast("Add Successfull  ");
        }
        else {
          this.common.showToast(result);
        }
        this.getWareHouseData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  updateWareHouse(wareHouse, rowid) {
    console.log('updated data', wareHouse);
    const params = {
      name: wareHouse.name,
      foid: 123,
      parentid: wareHouse.account.id,
      primarygroupid: wareHouse.account.primarygroup_id,
      x_id: rowid
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_warehouse;
        if (result == '') {
          this.common.showToast(" Updated Sucess");
        }
        else {
          this.common.showToast(result);
        }
        this.getWareHouseData();
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
      tblname: 'warehouse'
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
              this.getWareHouseData();
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
