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
  voucher = this.setVoucher();

  ledgers = {
    credit: [],
    debit: [],
    suggestions: []
  };

  showConfirm = false;

  showSuggestions = false;
  // ledgers = [];
  lastActiveId = '';
  allowBackspace = true;
  showDateModal = false;
  date = this.common.dateFormatter(new Date());

  activeLedgerIndex = -1;

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
    this.getLedgers('debit');
    this.getLedgers('credit');
   

  }

  ngOnInit() {
  }

  setVoucher() {
    return {
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
    this.addVoucher();
    //  this.activeModal.close({ response: response, Voucher: this.voucher });
  }

  addVoucher() {
    console.log('voucher 1 :', this.voucher);
    //const params ='';
    const params = {
      foid: this.voucher.user.id,
      // vouchertypeid: voucher.voucher.id,
      customercode: this.voucher.code,
      remarks: this.voucher.remarks,
      date: this.voucher.date,
      amountDetails: this.voucher.amountDetails,
      vouchertypeid: this.voucherId
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'].code);
        if (res['success']) {
          this.voucher = this.setVoucher();
          this.getVouchers();
          this.common.showToast('Your Code :' + res['data'].code);
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
      this.setFoucus('ref-code');
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
    const activeId = document.activeElement.id;
    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        this.addVoucher();
        this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }
    if (key == 'f2' && !this.showDateModal) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      return;
    } else if (key == 'enter' && this.showDateModal) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter();
      this.setFoucus(this.lastActiveId);
      return;
    } else if (key != 'enter' && this.showDateModal) {
      return;
    }

    if (key == 'enter') {
      if (document.activeElement.id.includes('amount-')) this.handleAmountEnter(document.activeElement.id.split('-')[1])
      else if (document.activeElement.id == 'narration') {
        this.showConfirm = true;
      } else if (activeId.includes('ledger-')) {
        // if (!this.ledgers.length) return;
        let index = activeId.split('-')[1];
        if (this.activeLedgerIndex > this.ledgers.suggestions.length - 1) {
          this.activeLedgerIndex = 0;
        }
        console.log('Test: ', index, this.ledgers, this.ledgers.suggestions[0]);
        this.selectLedger(this.ledgers.suggestions[this.activeLedgerIndex !== -1 ? this.activeLedgerIndex : 0], index);
        this.setFoucus('amount-' + index);
        //this.setFoucus('ledger-container');
        this.activeLedgerIndex = -1;
      } else if (activeId == 'voucher-date') {
        this.handleVoucherDateOnEnter();
        this.setFoucus('transaction-type-0');
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
      if ((key.includes('arrowup') || key.includes('arrowdown')) && activeId.includes('ledger-')) {
        this.handleArrowUpDown(key, activeId);
        event.preventDefault();
      }
      //console.log('helo',document.activeElement.id);
    } else if (activeId.includes('ledger-')) {
      let index = activeId.split('-')[1];
      let transactionType = document.getElementById('transaction-type-' + index)['value'];

    }
  }

  handleAmountEnter(index) {
    index = parseInt(index);
    if (this.voucher.total.debit == this.voucher.total.credit && index == this.voucher.amountDetails.length - 1) {
      this.setFoucus('narration');
      return;
    } else if (this.voucher.total.debit == this.voucher.total.credit && index != this.voucher.amountDetails.length - 1) {
      this.calculateTotal();
      this.setFoucus('transaction-type-' + (index + 1));
      return;
    }

    let total = {
      debit: 0,
      credit: 0
    };

    for (let i = 0; i <= index; i++) {
      if (this.voucher.amountDetails[i].transactionType == 'debit') {
        total.debit += this.voucher.amountDetails[i].amount;
      } else {
        total.credit += this.voucher.amountDetails[i].amount;
      }
    }
    console.log('Total:', total.debit, total.credit);
    if (total.debit == total.credit) {
      console.log('Index', index + 1)
      this.voucher.amountDetails.splice(index + 1, this.voucher.amountDetails.length - index - 1);
      this.setFoucus('narration');
      this.calculateTotal();
      return;
    }

    if (index == this.voucher.amountDetails.length - 1 && this.voucher.total.debit > this.voucher.total.credit) {
      this.addAmountDetails('credit', this.voucher.total.debit - this.voucher.total.credit);
    } else if (index == this.voucher.amountDetails.length - 1 && this.voucher.total.debit < this.voucher.total.credit) {
      this.addAmountDetails('debit', this.voucher.total.credit - this.voucher.total.debit);
    }

    this.calculateTotal();
    this.setFoucus('transaction-type-' + (parseInt(index) + 1));
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      this.moveCursor(element, 0, element['value'].length);
      if (isSetLastActive) this.lastActiveId = id;
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

  getLedgers(transactionType, name?) {
    this.showSuggestions = true;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + this.voucherId + '&search=' + name;
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledgers[transactionType] = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
      this.setFoucus('ref-code');
  }

  selectLedger(ledger, index?) {
    console.log('Last Active ID:', this.lastActiveId, ledger);
    if (!index && this.lastActiveId.includes('ledger')) {
      index = this.lastActiveId.split('-')[1];
    }
    this.voucher.amountDetails[index].ledger.name = ledger.y_ledger_name;
    this.voucher.amountDetails[index].ledger.id = ledger.y_ledger_id;
  }

  handleVoucherDateOnEnter() {
    let dateArray = [];
    let separator = '-';
    if (this.voucher.date.includes('-')) {
      dateArray = this.voucher.date.split('-');
    } else if (this.voucher.date.includes('/')) {
      dateArray = this.voucher.date.split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    this.voucher.date = date + separator + month + separator + year;
  }

  handleArrowUpDown(key, activeId) {
    let index = parseInt(activeId.split('-')[1]);
    if (key == 'arrowdown') {
      if (this.activeLedgerIndex != this.ledgers.suggestions.length - 1) {
        this.activeLedgerIndex++;
      }
    } else {
      if (this.activeLedgerIndex != 0) {
        this.activeLedgerIndex--;
      }
    }

    // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
    // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  }

  getActiveLedgerType(ledgers) {
    if (!this.lastActiveId || !this.lastActiveId.includes('ledger-')) return [];
    let index = parseInt(this.lastActiveId.split('-')[1]);
    let transactionType = document.getElementById('transaction-type-' + index) ? document.getElementById('transaction-type-' + index)['value'] : '';
    if (transactionType) {
      let suggestions = ledgers[transactionType];
      // console.log(document.getElementById(this.lastActiveId)['value']);
      if (document.getElementById(this.lastActiveId) && document.getElementById(this.lastActiveId)['value']) {
        let search = document.getElementById(this.lastActiveId)['value'].toLowerCase();
        suggestions = ledgers[transactionType].filter(ledger => ledger.y_ledger_name.toLowerCase().includes(search));
      }
      this.ledgers.suggestions = suggestions;
      return suggestions;
    }
    return [];


  }





}
