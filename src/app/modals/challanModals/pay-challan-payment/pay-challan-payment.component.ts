import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'pay-challan-payment',
  templateUrl: './pay-challan-payment.component.html',
  styleUrls: ['./pay-challan-payment.component.scss']
})
export class PayChallanPaymentComponent implements OnInit {

  paymentState = 1;
  remark = "";

  regno = "";
  vehcileId = null;
  challanDate = null;
  challaNumber = null;
  challanId = null;
  amount = null;
  mainBalance = null;
  receiptdoc=null;



  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService) {
    this.paymentState = 1;
    console.log("this params", this.common.params);
    if (this.common.params) {
      this.regno = this.common.params.regNo;
      this.vehcileId = this.common.params.vehicleId;
      this.challanDate = this.common.params.chDate;
      this.challaNumber = this.common.params.chNo;
      this.amount = this.common.params.amount;
      this.mainBalance = this.common.params.amount;
      this.challanId = this.common.params.rowId;

    }
  }

  ngOnInit() {
  }


  changePaymentState(type) {
    this.paymentState = type;
    if (this.paymentState == 1) {
      this.challanPay();
    }
  }

  challanPay() {
    // document.getElementById("submit").disabled = true;
    if (this.amount <= this.mainBalance) {
      window.open("https://echallan.parivahan.gov.in/");
    } else {
      this.common.showError("Insufficent Amount")
    }
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

        console.log('Base 64: ', res);
        this.receiptdoc=res;
        // this.driver['image' + index] = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  submitChallanPayment() {
    let params = {};
    if (this.paymentState == 1) {
      params = {
        challanId: this.challanId,
        vehId: this.vehcileId,
        amount: this.amount,
        challanNo: this.challaNumber,
        status: this.paymentState,
        doc1:this.receiptdoc,
        remark: this.remark
      }
      // if(this.receiptdoc==null){
      //   this.common.showToast('please upload challan payment receipt.')
      // }
    }
    else {
      params = {
        challanId: this.challanId,
        status: this.paymentState,
        remark: this.remark
      }
    }

    this.common.loading++;
    this.api.post('Challans/completeChallanPayment', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        if (res['success'] === true) {
          this.common.showToast(res['msg']);
          this.activeModal.close({ response: true });
        } else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close({ response: false });
  }

}
