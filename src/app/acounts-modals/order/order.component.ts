import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
order={

  amountDetails: [{
    transactionType: 'debit',
    ledger: '',
    amount: {
      debit: 0,
      credit: 0
    }
  }]
};
constructor(private activeModal: NgbActiveModal,
  public common: CommonService,
  public modalService: NgbModal,
  public api: ApiService){ }

  ngOnInit() {
  }


  calculateTotal(type) {
    let total = 0;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amount[type]);
      total += amountDetail.amount[type];
    });
    return total;
  }
  
  addAmountDetails() {
    this.order.amountDetails.push({
      transactionType: 'debit',
      ledger: '',
      amount: {
        debit: 0,
        credit: 0
      }
    });
  }
}
