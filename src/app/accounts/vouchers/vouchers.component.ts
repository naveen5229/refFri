import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockTypeComponent } from '../../acounts-modals/stock-type/stock-type.component';
// import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute } from '@angular/router';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
@Component({
  selector: 'vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {
  Vouchers = [];
  voucherId = '';
  voucherName = '';
  voucher = {
    name: '',
    date: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    foid: '',
    user: {
      name: '',
      id: ''
    },
    vouchertypeid: '',
    amountDetails: [{
      transactionType: 'debit',
      ledger: {
        name: '',
        id: ''
      },
      amount: 0
    }],
    code: '',
    remarks: '',
    total: {
      debit: 0,
      credit: 0
    }
  };

  showSuggestions = false;
  ledgers = [];
  lastActiveId = '';
  allowBackspace = true;

  date = this.common.dateFormatter(new Date());
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal) {
    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.voucherId = params.id;
        this.voucherName = params.name;
        this.getVouchers();
      }
    });

  }

  ngOnInit() {
  }

  getVouchers() {
    let params = {
      voucherId: this.voucherId
    };

    this.common.loading++;
    this.api.post('Voucher/GetVouchersData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        this.Vouchers = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openVoucherModal(voucher?) {
    // console.log('voucher 0: ', voucher);
    // this.common.params = { voucher, voucherId: this.voucherId, voucherName: this.voucherName };
    // const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   if (data.response) {
    //     console.log('data voucher test',data.Voucher);
    //     if (voucher) {
    //       //  this.updateStockItem(voucher.id, data.stockitem);
    //       //  return;
    //     }
    //     this.addVoucher(data.Voucher);

    //   }
    // });
  }

  dismiss(response) {
    console.log('Voucher:', this.voucher);
    if (response && this.voucher.total.debit !== this.voucher.total.credit) {
      this.common.showToast('Credit And Debit Amount Should be Same');
      return;
    }
    this.addVoucher(this.voucher);
    //  this.activeModal.close({ response: response, Voucher: this.voucher });
  }

  addVoucher(voucher) {
    console.log('voucher 1 :', voucher);
    //const params ='';
    const params = {
      foid: voucher.user.id,
      // vouchertypeid: voucher.voucher.id,
      customercode: voucher.code,
      remarks: voucher.remarks,
      date: voucher.date,
      amountDetails: voucher.amountDetails,
      vouchertypeid: this.voucherId
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        // console.log('res: ', res['data'].code);

        this.getVouchers();
        this.common.showToast('Your Code :' + res['data'].code);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

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

  addAmountDetails(type, amount = 0) {
    this.voucher.amountDetails.push({
      transactionType: type,
      ledger: {
        name: '',
        id: ''
      },
      amount: amount
    });
  }

  calculateTotal() {
    this.voucher.total.debit = 0;
    this.voucher.total.credit = 0;
    this.voucher.amountDetails.map(amountDetail => {
      console.log(amountDetail, amountDetail.transactionType, amountDetail.amount)
      if (amountDetail.transactionType == 'debit') {
        this.voucher.total.debit += amountDetail.amount;
      } else {
        this.voucher.total.credit += amountDetail.amount;
      }
    });
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    console.log(event);
    if (event.key.toLowerCase() == 'f2') {
      document.getElementById("voucher-date").focus();
      this.voucher.date = '';
      //  this.moveCursor(document.getElementById("voucher-date"));
    }

    // amountDetail.transactionType = $event.key.toLowerCase() == 'c' ? 'credit' : $event.key.toLowerCase() == 'd' ? 'debit'

    // console.log('Active Element: ', document.activeElement);
    // if (event.key.toLowerCase() == 'enter' && document.activeElement.id == 'ref-code') {
    //   document.getElementById("voucher-date").focus();
    // } else if (event.key.toLowerCase() == 'backspace' && document.activeElement.id == 'voucher-date') {
    //   document.getElementById("ref-code").focus();
    // }
    // let elementsIDs = ['ref-code', 'voucher-date'];
    const activeId = document.activeElement.id;
    if (key == 'enter') {
      if (document.activeElement.id.includes('amount-')) this.handleAmountEnter(document.activeElement.id.split('-')[1])
      else if (document.activeElement.id == 'narration') {
        confirm('Yes or No');
      } else if (activeId.includes('ledger-')) {
        if (!this.ledgers.length) return;
        let index = activeId.split('-')[1];
        console.log('Test: ', index, this.ledgers, this.ledgers[0]);
        this.selectLedger(this.ledgers[0], index);
        this.setFoucus('amount-' + index);
      } else {
        let index = this.getElementsIDs().indexOf(document.activeElement.id);
        this.setFoucus(this.getElementsIDs()[index + 1]);
        if (this.getElementsIDs()[index + 1] == 'voucher-date') this.moveCursor(document.getElementById('voucher-date'));
      }
      this.allowBackspace = true;
    } else if ((key == 'c' || key == 'd') && document.activeElement.id.includes('transaction-type-')) {
      let index = document.activeElement.id.split('-')[2];
      if (key == 'c') this.voucher.amountDetails[index].transactionType = 'credit';
      else this.voucher.amountDetails[index].transactionType = 'debit';
      this.calculateTotal();
    } else if (key == 'backspace') {
      console.log('Selected: ', window.getSelection().toString(), this.allowBackspace);
      if (activeId == 'ref-code' || !this.allowBackspace) return;
      event.preventDefault();
      let index = this.getElementsIDs().indexOf(document.activeElement.id);
      this.setFoucus(this.getElementsIDs()[index - 1]);
    } else if (key == 'escape') {
      this.allowBackspace = true;
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    }

  }

  handleAmountEnter(index) {
    if (this.voucher.total.debit == this.voucher.total.credit && index == this.voucher.amountDetails.length - 1) {
      this.setFoucus('narration');
      return;
    }
    if (this.voucher.total.debit > this.voucher.total.credit) {
      this.addAmountDetails('credit', this.voucher.total.debit - this.voucher.total.credit);
    } else if (this.voucher.total.debit < this.voucher.total.credit) {
      this.addAmountDetails('debit', this.voucher.total.credit - this.voucher.total.debit);
    }

    this.setFoucus('transaction-type-' + (parseInt(index) + 1));
    this.calculateTotal();
  }

  setFoucus(id) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      this.moveCursor(element, 0, element['value'].length);
      this.lastActiveId = id;
      console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  getElementsIDs() {
    let elementIDs = ['ref-code', 'voucher-date'];
    this.voucher.amountDetails.map((amountDetail, index) => {
      elementIDs.push('transaction-type-' + index);
      elementIDs.push('ledger-' + index);
      elementIDs.push('amount-' + index);
    });
    elementIDs.push('narration');
    return elementIDs;
  }

  moveCursor(ele, startIndex = 0, endIndex = 0) {
    if (ele.select)
      ele.select();
    // ele.setSelectionRange(startIndex, endIndex);
  }

  getSuggestions(transactionType, name) {
    this.showSuggestions = true;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + this.voucherId + '&search=' + name;
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledgers = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectLedger(ledger, index?) {
    console.log('Last Active ID:', this.lastActiveId);
    if (!index && this.lastActiveId.includes('ledger')) {
      index = this.lastActiveId.split('-')[1];
    }
    this.voucher.amountDetails[index].ledger.name = ledger.y_ledger_name;
    this.voucher.amountDetails[index].ledger.id = ledger.y_ledger_id;
  }


}
