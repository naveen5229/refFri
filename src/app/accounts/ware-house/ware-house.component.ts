import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service'
import { WareHouseModalComponent } from '../../acounts-modals/ware-house-modal/ware-house-modal.component';
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
  }

  ngOnInit() {
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
        console.log("after api data:",this.wareHouseData);
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
      this.common.params.title='Ware house';
      const activeModal = this.modalService.open(WareHouseModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.updateWareHouse(data.Accounts,wareHouse.id);
          return;
        }
      });
    }
    else {
      this.common.params = null;
      const activeModal = this.modalService.open(WareHouseModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addWareHouse(data.Accounts);
          return;
        }
      });
    }
  }


  addWareHouse(Accounts) {
    console.log('accountdata', Accounts);
    const params = {
      name: Accounts.name,
      foid:123,
      parentid: Accounts.account.id,
      primarygroupid: Accounts.account.primarygroup_id,
      xid: 0
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
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
        this.getWareHouseData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  updateWareHouse(Accounts,rowid){
    console.log('updated data', Accounts);
    const params = {
      name: Accounts.name,
      foid:123,
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
        this.getWareHouseData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

}
