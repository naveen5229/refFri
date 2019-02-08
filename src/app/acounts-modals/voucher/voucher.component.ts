import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  voucher = {
    name: '',
    date: '',
    foid:'',
    user: {
      name: '',
      id: ''
    },
    vouchertypeid:'',
    amountDetails: [{
      transactionType: 'debit',
      ledger: '',
      amount: {
        debit: 0,
        credit: 0
      }
    }]
  };

  date = this.common.dateFormatter(new Date());
  voucherId = '';
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
    if (this.common.params) {
     this.voucherId = this.common.params.voucherId;
    }
    console.log('ID: ', this.voucherId);
  }

  ngOnInit() {
  }

  dismiss(response) {
    console.log('Voucher:', this.voucher);
    if (response && (this.calculateTotal('credit') !== this.calculateTotal('debit'))) {
      this.common.showToast('Some Messages');
      return;
    }
    this.activeModal.close({ response: response, Voucher: this.voucher });
  }

  onSelected(selectedData, type, display) {
    this.voucher[type].name = selectedData[display];
    this.voucher[type].id = selectedData.id;
    console.log('Accounts User: ', this.voucher);
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.voucher.date = this.common.dateFormatter(data.date).split(' ')[0];
      //  console.log('Date:', this.date);
    });
  }

  addAmountDetails() {
    this.voucher.amountDetails.push({
      transactionType: 'debit',
      ledger: '',
      amount: {
        debit: 0,
        credit: 0
      }
    });
  }

  calculateTotal(type) {
    let total = 0;
    this.voucher.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amount[type]);
      total += amountDetail.amount[type];
    });
    return total;
  }
}
