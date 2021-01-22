import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-bid',
  templateUrl: './add-bid.component.html',
  styleUrls: ['./add-bid.component.scss']
})
export class AddBidComponent implements OnInit {
  orderId = null;
  bidId = null;
  vehicleId = null;
  remarks = null;
  rate = null;
  type = null;
  weight = null;
  bidExpTime = new Date(new Date().setHours(new Date().getHours() + 1));
  vehicleRegNo = null;
  orderType = null;
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,

  ) {
    // console.log("this.common.params",this.common.params);
    // this.common.handleModalSize('class', 'modal-lg', '450','px',1);
    this.orderId = this.common.params && this.common.params.order && this.common.params.order.id ? this.common.params.order.id : null;
    this.bidId = this.common.params && this.common.params.order && this.common.params.order.bidId ? this.common.params.order.bidId : null;
    this.remarks = this.common.params && this.common.params.order && this.common.params.order.remarks ? this.common.params.order.remarks : null;
    this.rate = this.common.params && this.common.params.order && this.common.params.order.rate ? this.common.params.order.rate : null;
    this.type = this.common.params && this.common.params.order && this.common.params.order.type ? this.common.params.order.type : null;
    this.bidExpTime = this.common.params && this.common.params.order && this.common.params.order.bidExpDate ? new Date(this.common.params.order.bidExpDate) : new Date(new Date().setHours(new Date().getHours() + 1));
    this.weight = this.common.params && this.common.params.order && this.common.params.order.weight ? this.common.params.order.weight : null;
    this.vehicleId = this.common.params && this.common.params.order && this.common.params.order.vehicleId ? this.common.params.order.vehicleId : null;
    this.vehicleRegNo = this.common.params && this.common.params.order && this.common.params.order.vehicleRegNo ? this.common.params.order.vehicleRegNo : null;
    this.orderType = this.common.params && this.common.params.order ? this.common.params.order.orderType : null;
    console.log("orderType",this.orderType);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(status) {
    this.activeModal.close({ response: status });
  }

  saveData() {
    this.common.loading++;
    let params = {
      orderId:this.orderId,
      remarks: this.remarks,
      rate: this.rate, 
      bidId:this.bidId,
      vId : this.vehicleId,
      expTime : this.common.dateFormatter(this.bidExpTime),
      weight : this.weight
    }
    this.api.post('Bidding/saveBid', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.closeModal({ response: true });
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  selectVehicle(vehicle){
    this.vehicleId = vehicle.id;
  }
}
