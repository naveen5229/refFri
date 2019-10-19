import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pay-challan-payment',
  templateUrl: './pay-challan-payment.component.html',
  styleUrls: ['./pay-challan-payment.component.scss']
})
export class PayChallanPaymentComponent implements OnInit {

  paymentSucceful=false;
  constructor(public common:CommonService,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }

  challanPay(){
    this.paymentSucceful=true;
   // document.getElementById("submit").disabled = true;
    if(this.common.params.amount<=this.common.params.mainBalance){
    window.open("https://echallan.parivahan.gov.in/");   
    }else{
      this.common.showError("Insufficent Amount")
    }
  }

  closeModal(){
    this.activeModal.close();
  }

}
