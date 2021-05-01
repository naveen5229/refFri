import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { ConfirmComponent } from '../../confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'challan-pending-request',
  templateUrl: './challan-pending-request.component.html',
  styleUrls: ['./challan-pending-request.component.scss']
})
export class ChallanPendingRequestComponent implements OnInit {
  mainBalance = 0;
  totalAmt = 0;
  isCheckTollBal = true;
  challanId = null;
  vehId = null;
  challanNo = null;
  amount = null;
  regNo = null;
  chDate = null;
  accountBalance = 0;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
    console.log(this.common.params);
    this.challanId =  this.common.params.rowId;
    this.regNo = this.common.params.regNo;
    this.vehId = this.common.params.vehId;
    this.chDate = this.common.params.chDate;
    this.challanNo = this.common.params.chNo;
    this.amount = this.common.params.amount;
    this.totalAmt = this.common.params.amount+100;
    this.getMainBal();
    this.common.handleModalSize('class', 'modal-lg', '1020');

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getMainBal() {
    this.common.loading++;
    this.api.get('Gisdb/getAccountRemainingBalance?foid=' + this.common.params.foid)
      .subscribe(res => {
        this.common.loading--;
        this.mainBalance = res['data'][0].main_balance;
        this.accountBalance = res['data'][0].main_balance+res['data'][0].toll_balance;;
        
        console.log("res--", res);
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }


  challanPayRequest() {
    let params = {
      challanId: this.challanId,
      vehId: this.vehId,
      challanNo: this.challanNo,
      amount: this.amount,
      isCheckTollBal : this.isCheckTollBal
    };
    this.common.loading++;
    this.api.post('Challans/challanPaymentRequest', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == 2 ) {
          this.confirmation(res['msg']);
        }
        else {
          this.common.showToast(res['msg']);
          this.activeModal.close({ response: true });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }

 
  confirmation(msg) {
    let totalAmt = parseInt(this.amount) + 50
    this.common.params = {
      title: 'Information',
      description: msg
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      if (data.response) {
        this.isCheckTollBal=false;
        this.challanPayRequest();  
      }
    });
  }
}
