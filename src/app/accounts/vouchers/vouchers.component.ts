import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockTypeComponent } from '../../acounts-modals/stock-type/stock-type.component';
// import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { isUndefined } from 'util';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { AccountService } from '../../services/account.service';
import { VouchercostcenterComponent } from '../../acounts-modals/vouchercostcenter/vouchercostcenter.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { RecordsComponent } from '../../acounts-modals/records/records.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss'],
  host: {
    '(document:keydown)': 'keyHandler($event)'

  }
})
export class VouchersComponent implements OnInit {
  Vouchers = [];
  voucherId = '';
  voucherName = '';
  voucher = null;

  ledgers = {
    credit: [],
    debit: [],
    suggestions: []
  };
  currentbalance = 0;
  balances = {};
  showConfirm = false;
  showConfirmCostCenter = false;

  showSuggestions = false;
  // ledgers = [];
  lastActiveId = '';
  allowBackspace = true;
  showDateModal = false;
  freezedate = '';
  date = this.common.dateFormatternew(new Date());

  activeLedgerIndex = -1;
  modal = null;
  mannual = false;
  ledgerbalance = [];

  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,
    public pdfService: PdfService) {
    this.common.refresh = this.refresh.bind(this);
    this.voucher = this.setVoucher();
    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.voucherId = params.id;
        this.voucherName = params.name;
        this.getVouchers();
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    this.getLedgers('debit');
    this.getLedgers('credit');
    this.voucher = this.setVoucher();
    this.common.currentPage = this.voucherName;
    this.mannual = this.accountService.selected.branch.is_inv_manualapprove;
    setTimeout(() => {
      console.log('financial year', this.accountService.selected.branch.is_constcenterallow);
    }, 4000);
    this.voucher.ismanual = this.accountService.selected.branch.is_inv_manualapprove;
    this.getFreeze();

  }

  ngOnDestroy() { }
  ngOnInit() {

  }
  refresh() {
    this.getLedgers('debit');
    this.getLedgers('credit');
    this.mannual = this.accountService.selected.branch.is_inv_manualapprove;
    this.voucher.ismanual = this.mannual;
  }

  setVoucher() {
    return {
      name: '',
      print: false,
      date: this.accountService.voucherDate || this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
      foid: '',
      user: {
        name: '',
        id: ''
      },
      vouchertypeid: '',
      amountDetails: [{
        transactionType: (this.voucherId == '-4' || this.voucherId == '-2') ? 'credit' : 'debit',
        ledger: {
          name: '',
          id: ''
        },
        amount: 0,
        details: []
      }],
      code: '',
      remarks: '',
      total: {
        debit: 0,
        credit: 0
      },
      ismanual: this.mannual
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

  getFreeze() {

    let params = {
      departmentId: 0
    };

    this.common.loading++;
    this.api.post('Voucher/getFreeze', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('freeze Res11:', res['data']);
        this.freezedate = res['data'][0]['getfreezedate'];
        // resolve(res['data']);
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

  modelCondition() {
    this.showConfirm = false;
    this.showConfirmCostCenter = false;
    event.preventDefault();
    return;
  }

  async dismiss(response) {
    console.log('DD: ', this.common.dateFormatter(this.common.convertDate(this.voucher.date), 'y', false));
    console.log('DD: ', this.accountService.selected.financialYear.startdate);
    console.log('DD: ', this.accountService.selected.financialYear.enddate);
    this.showConfirm = false;
    this.showConfirmCostCenter = false;
    if (!response) {
      this.showConfirm = false;
      return;
    }

    console.log('Voucher:', this.voucher);
    if (response && this.voucher.total.debit !== this.voucher.total.credit) {
      this.common.showError('Credit And Debit Amount Should be Same');
      return;
    } else if (response && this.voucher.total.debit == 0) {
      this.common.showError('Please Enter Amount');
      this.showConfirm = false;
      event.preventDefault();
      return;
    } else if (this.accountService.selected.financialYear.isfrozen == true) {
      this.common.showError('This financial year is freezed. Please select currect financial year');
      return;
    } else {
      let voucherDate = this.common.dateFormatter(this.common.convertDate(this.voucher.date), 'y', false);
      if (voucherDate < this.accountService.selected.financialYear.startdate || voucherDate > this.accountService.selected.financialYear.enddate) {
        this.common.showError('Please Select Correct Financial Year');
        return;
      }
    }

    // if (this.voucher) return;
    console.log('acc service', this.accountService.selected.branch, this.accountService.selected.branch.id != 0);
    if (this.accountService.selected.branch.id != 0) {
      // this.accountService.selected.branch


      if (this.freezedate) {
        let rescompare = this.CompareDate(this.freezedate);
        console.log('heddlo', rescompare);
        if (rescompare == 0) {
          console.log('hello');
          this.common.showError('Please Enter Date After ' + this.freezedate);
          setTimeout(() => {
            this.setFoucus('voucher-date');
          }, 150);
        } else {
          console.log('hello testx');
          this.addVoucher();
        }
      }

      this.showConfirm = false;
      event.preventDefault();
      return;
    } else {
      alert('Please Select Branch');
    }

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
      vouchertypeid: this.voucherId,
      y_code: '',
      ismannual: this.voucher.ismanual,
      xid: 0
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('return vouher id: ', res['data']);
        if (res['success']) {
          this.accountService.voucherDate = this.voucher.date;

          if (res['data'][0].save_voucher_v1) {
            if (this.voucher.print) {
              // this.getCompanyData();
              this.printVoucher(this.voucher, res['data']['companydata']);

            }
            this.voucher = this.setVoucher();
            this.getVouchers();
            this.common.showToast('Your Code :' + res['data'].code);
            this.setFoucus('ref-code');

          } else {
            let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
            this.common.showError(message);
          }
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }


  printVoucher(voucherdataprint, companydata) {

    console.log('print company data', companydata);
    console.log('print data voucher', voucherdataprint);
    let rowdetaildata = []; //  ['GL00184', 'By Packing Charges (Recd)', '110.0', ''],
    voucherdataprint.amountDetails.map(value => {
      if (value.transactionType == 'debit') {
        rowdetaildata.push([value.ledger.name, value.amount, ""]);
      } else {
        rowdetaildata.push([value.ledger.name, "", value.amount]);
      }

    });
    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;

    let pdfData = {
      company: companydata[0].foname,
      address: companydata[0].addressline,
      city: cityaddress,
      reportName: this.voucherName,
      details: [
        {
          name: 'Voucher Number',
          value: voucherdataprint.code
        },
        {
          name: 'Branch',
          value: companydata[0].branchname
        },
        {
          name: 'Voucher Date',
          value: voucherdataprint.date
        }
      ],
      headers: [
        // {
        //   name: 'GL Code',
        //   textAlign: 'left'
        // },
        {
          name: 'Particulars',
          textAlign: 'left'
        },
        {
          name: 'Debit Amount',
          textAlign: 'right'
        },
        {
          name: 'Credit Amount',
          textAlign: 'right'
        }
      ],
      table:
        rowdetaildata
      ,
      total: [voucherdataprint.total.credit, voucherdataprint.total.debit],
      inWords: this.pdfService.convertNumberToWords(voucherdataprint.total.debit),
      narration: voucherdataprint.remarks
    };

    console.log('print pdf data', pdfData);
    let datapdf = this.pdfService.createPdfHtml(pdfData);
    let divToPrint = datapdf.innerHTML;
    let newWindow = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    newWindow.document.open();
    newWindow.document.write(`
        <html>
        <head>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" />
          <style>
          .voucher-pdf {
            width: 210mm;
            padding: 10mm;
            padding-left: 10mm;
            padding-right: 10mm;
        }
        
      .voucher-company {
            font-size: 16px;
            font-weight: 500;
            letter-spacing: .5px;
            margin-bottom: 4px;
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
        }
        
        .voucher-pdf table {
            width: 100%;
            margin-top: 6px;
        }
        
        .table,
        .table-bordered>tbody>tr>td,
        .table-bordered>tbody>tr>th,
        .table-bordered>tfoot>tr>td,
        .table-bordered>tfoot>tr>th,
        .table-bordered>thead>tr>td,
        .table-bordered>thead>tr>th {
            border-color: #444;
        }
        
        .voucher-name {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            padding: 10px;
        }
        
        .voucher-details {
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .voucher-details strong {
            margin-right: 8px;
        }
        
        ..voucher-footer {
            margin-top: 40px;
            font-size: 15px;
            text-align: center;
        }
        
        .voucher-signature div {
            border-top: 2px solid #000;
        }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="container">${divToPrint}<div>
        </body>
        </html>
        `);
    newWindow.document.close();

  }


  onSelected(selectedData, type, display) {
    this.voucher[type].name = selectedData[display];
    this.voucher[type].id = selectedData.id;
    console.log('Accounts User: ', this.voucher);
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.voucher.date = this.common.dateFormatternew(data.date).split(' ')[0];
      //  console.log('Date:', this.date);
    });
  }

  addAmountDetails(type, amount = 0) {
    this.voucher.amountDetails.push({
      transactionType: type,
      ledger: {
        name: '',
        id: '',
        is_constcenterallow: false
      },
      amount: amount,
      details: []
    });
  }




  async keyHandler(event) {

    if (this.modal) return;
    const key = event.key.toLowerCase();

    /******* On f3 Submit Form ******* */
    if (key == 'f3') {
      this.dismiss(true);
      event.preventDefault();
      return;
    }
    // console.log(event);
    const activeId = document.activeElement.id;
    console.log('activeId:', activeId);
    let index = this.lastActiveId.split('-')[1];
    if ((event.altKey && key === 'c') && (activeId == 'ledger-' + index)) {
      // console.log('alt + C pressed');
      this.openledger();
      return;
    }
    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        this.showConfirm = false;
        event.preventDefault();
        if (this.voucher.total.debit == 0) {
          this.common.showError('Please Enter Amount');
        } else if (this.accountService.selected.branch.id == 0) {
          alert('Please Select Branch');
        } else {
          this.dismiss(true);
        }
      }
      if (key == 'n') {
        this.modelCondition();
      }
      return;
    }

    if (this.showConfirmCostCenter) {
      console.log('..........................');
      if (key == 'y' || key == 'enter') {
        this.showConfirmCostCenter = false;
        event.preventDefault();
        if (this.voucher.total.debit == 0) {
          this.showConfirmCostCenter = false;
          this.common.showError('Please Enter Amount');
        } else {
          let index = this.lastActiveId.split('-')[1];
          console.log('last hello ', this.showConfirmCostCenter, this.lastActiveId, index);
          this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
          return
        }
      } else if (key == 'n') {
        this.modelCondition();
      }
      return;
    }
    console.log('..........................', key, activeId);

    if (key === 'home' && (activeId.includes('ledger'))) {
      //console.log('hello');
      let ledgerindex = this.lastActiveId.split('-')[1];
      if (this.voucher.amountDetails[ledgerindex].ledger.id != "") {
        console.log('ledger value ------------', this.voucher.amountDetails[ledgerindex].ledger.id);
        this.openinvoicemodel(this.voucher.amountDetails[ledgerindex].ledger.id);
      } else {
        this.common.showError('Please Select Correct Ledger');
      }
    }
    if ((event.altKey && key === "u") && (activeId.includes('ledger'))) {
      let ledgerindex = this.lastActiveId.split('-')[1];
      if (this.voucher.amountDetails[ledgerindex].ledger.id != "") {
        console.log('ledger value ------------', this.voucher.amountDetails[ledgerindex].ledger.id);
        this.openinvoicemodel(this.voucher.amountDetails[ledgerindex].ledger.id, 0);
      } else {
        this.common.showError('Please Select Correct Ledger');
      }
    }
    if (event.ctrlKey && key === "`") {
      this.mouse();
    } else if (!event.ctrlKey && (key == 'f2' && !this.showDateModal)) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      return;
    } else if (key == 'enter' && this.showDateModal) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      //this.handleVoucherDateOnEnter();
      this.voucher.date = this.common.handleVoucherDateOnEnter(this.voucher.date);
      this.setFoucus(this.lastActiveId);
      return;
    } else if (key != 'enter' && this.showDateModal) {
      return;
    }

    if (key == 'enter') {
      if (document.activeElement.id.includes('amount-')) {
        let index = activeId.split('-')[1];
        console.log('test rest successfull', this.voucher.amountDetails[index].ledger.is_constcenterallow);
        if (this.voucher.amountDetails[index].ledger.is_constcenterallow == true) {
          this.showConfirmCostCenter = true;
          // console.log('test rest successfull', this.voucher.amountDetails[index].is_constcenterallow);
          let index = activeId.split('-')[1];
          console.log('Inde:', index);
          console.log('Amount:', this.voucher.amountDetails[index].amount);
          //this.setFoucus('transaction-type-' + (parseInt(index) + 1));
          // this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
        }
        this.handleAmountEnter(document.activeElement.id.split('-')[1]);
      }
      else if (document.activeElement.id == 'narration') {
        if (this.accountService.selected.branch) {
          // this.accountService.selected.branch
          this.showConfirm = true;
        } else {
          alert('Please Select Branch');
        }
      } else if (activeId.includes('ledger-')) {
        // if (!this.ledgers.length) return;
        let index = activeId.split('-')[1];
        if (this.activeLedgerIndex > this.ledgers.suggestions.length - 1) {
          this.activeLedgerIndex = 0;
        }
        //   console.log('Test: ', index, this.ledgers, this.ledgers.suggestions[0]);
        // this.selectLedger(this.ledgers.suggestions[this.activeLedgerIndex !== -1 ? this.activeLedgerIndex : 0], index);
        // console.log('hello dear', this.voucher.amountDetails[index].transactionType);
        if ((this.voucherId == '-1' || this.voucherId == '-3') && (this.voucher.amountDetails[index].transactionType == 'credit')) {
          // this.getCurrentBalance(this.voucher.amountDetails[index].ledger.id);
        }
        console.log('test rest successfull', this.voucher.amountDetails[index].is_constcenterallow);
        this.setFoucus('amount-' + index);
        //this.setFoucus('ledger-container');
        this.activeLedgerIndex = -1;
        this.getLedgerView(index);
      } else if (activeId == 'voucher-date') {

        if (this.freezedate) {



          let rescompare = this.CompareDate(this.freezedate);
          if (rescompare == 1) {
            // console.log('hello brother');
            this.handleVoucherDateOnEnter();
            this.setFoucus('transaction-type-0');
          }
          else {
            this.common.showError('Please Enter Date After ' + this.freezedate);
            setTimeout(() => {
              this.setFoucus('voucher-date');
            }, 150);
          }
        }

      } else {
        console.log('json hello0');
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
      // console.log('Selected: ', window.getSelection().toString(), this.allowBackspace);
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
      // console.log(index);
      // let transactionType = document.getElementById('trasactionn-type-' + index)['value'];
      let transactionType = this.voucher.amountDetails[index].transactionType;
    } else if ((activeId == 'voucher-date') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }
  }

  mouse() {
    this.common.params = { vouchertype: this.voucherId };
    // const keydata = event.MouseEvent.toLowerCase();
    console.log('mouse listner', event);
    this.modal = this.modalService.open(RecordsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    this.modal.result.then(data => {
      this.modal = null;
      if (data.response) {
        this.addLedger(data.ledger);
      }
    });
  }
  vouchercostcenter() {
    console.log('____', document.activeElement.id);
    console.log('___-___', this.lastActiveId);
    let index = this.lastActiveId.split('-')[1];
    // console.log('fdsfedsfdsfdsf', index,document.activeElement.id.split('-')[1]);
    this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
    this.showConfirmCostCenter = false;
    event.preventDefault();
  }

  CompareDate(freezedate) {
    let firstarr = freezedate.split('-');
    console.log('first date ', freezedate);
    let secondarr = this.voucher.date.split('-');
    //  console.log('first arr ', secondarr[2]);

    let fristyear = firstarr[0];
    let firstmonth = firstarr[1];
    let firstdate = firstarr[2];
    let endyear = secondarr[2];
    let endmonth = secondarr[1];
    let enddate = secondarr[0];

    console.log('First Date:', fristyear, firstmonth, firstdate);
    console.log('Second Date:', endyear, endmonth, enddate);
    var dateOne = new Date(fristyear, firstmonth, firstdate);
    var dateTwo = new Date(endyear, endmonth, enddate);
    //Note: 04 is month i.e. May  
    if (dateOne > dateTwo) {
      return 0;
    } else {
      return 1;
    }
  }

  handleAmountEnter(index) {
    index = parseInt(index);
    if (this.voucher.total.debit == this.voucher.total.credit && index == this.voucher.amountDetails.length - 1) {
      this.setFoucus('narration');
      return;
    } else if (this.voucher.total.debit == this.voucher.total.credit && index != this.voucher.amountDetails.length - 1) {
      this.calculateTotal();
      if (!this.voucher.amountDetails[index].ledger.is_constcenterallow) {
        this.setFoucus('transaction-type-' + (index + 1));
      }
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
    if (this.voucher.total.debit != this.voucher.total.credit) {
      console.log('amount', 'amount-' + (this.voucher.amountDetails.length - 1));
      this.setFoucus('amount-' + (this.voucher.amountDetails.length - 1));
    }
    // this.setFoucus('transaction-type-' + (parseInt(index) + 1));
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      element.focus();
      this.moveCursor(element, 0, element['value'].length);
      if (isSetLastActive) this.lastActiveId = id;
      console.log('last active id 66: ', this.lastActiveId);
    }, 100);
  }
  deleterow(i) {
    this.voucher.amountDetails.splice(i, 1);
    this.handleAmountEnter(this.voucher.amountDetails.length - 2);
    // this.setFoucus('amount-'+(this.voucher.amountDetails.length - 1));
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

  getCurrentBalance(ledgerId) {
    this.showSuggestions = true;
    let url = 'Suggestion/getCurrentBalance?branchid=' + 0 + '&fromdate=' + this.date + '&ledgerid=' + ledgerId;
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log('current balance', res['data'][0]['get_currentbalance']);
        // return res['data'][0]['get_currentbalance'];
        this.balances[ledgerId] = { main: res['data'][0]['get_currentbalance'], current: res['data'][0]['get_currentbalance'] };
        this.currentbalance = (res['data'][0]['get_currentbalance']) - this.voucher.total.credit;
        console.log('check current balance', this.currentbalance);
      }, err => {
        console.error(err);
        this.common.showError();
      });
    this.setFoucus('ref-code');
  }


  selectLedger(ledger, index?) {
    console.log('Last Active ID44:', this.lastActiveId, ledger);
    if (!index && this.lastActiveId.includes('ledger')) {
      index = this.lastActiveId.split('-')[1];
    }
    this.voucher.amountDetails[index].ledger.name = ledger.y_ledger_name;
    this.voucher.amountDetails[index].ledger.id = ledger.y_ledger_id;
    this.voucher.amountDetails[index].ledger.is_constcenterallow = ledger.is_constcenterallow;
    this.getLedgerView(index);
    // console.log('Last Active ID:', ledger.is_constcenterallow, this.voucher.amountDetails[index].ledger.is_constcenterallow);

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

    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    month = (month > 12) ? 12 : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    date = (date > 31) ? 31 : date;
    date = (((month == '04') || (month == '06') || (month == '09') || (month == '11')) && (date > 30)) ? 30 : date;
    date = ((date == 28) && (month == '02')) ? 28 : date;
    if (year % 4 == 0 && (month == '02')) {
      date = (((date > 28) && (month == '02')) && ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)))) ? 29 : date;

    }
    else if (year % 4 != 0 && (month == '02')) {
      date = 28;
    } // date  = ((date > 28) && (month == '02')) ? 28 : date ;

    console.log('Date: ', year + separator + month + separator + date);
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

  findBalance(index) {
    console.log('IndexL::::', index);
    let amount = 0;
    let allCreditAmounts = [];
    let ledgerId = this.voucher.amountDetails[index].ledger.id;
    this.voucher.amountDetails.map((amountDetail, index) => {
      if (amountDetail.transactionType == 'credit' && amountDetail.ledger.id == ledgerId) {
        allCreditAmounts.push({ index: index, amountDetail: amountDetail });
      }
    });
    const activeId = document.activeElement.id;

    let sum = 0;
    for (let i = 0; i < allCreditAmounts.length; i++) {
      if (allCreditAmounts[i].index == index) break;
      sum += allCreditAmounts[i].amountDetail.amount;
    }
    // console.log('Amount credit for voucher: ', amount);
    if (!this.balances[ledgerId]) {
      return 0;
    }
    return this.balances[ledgerId].main - sum;

  }

  calculateTotal(index?) {
    this.voucher.total.debit = 0;
    this.voucher.total.credit = 0;
    this.voucher.amountDetails.map(amountDetail => {
      console.log(amountDetail, amountDetail.transactionType, amountDetail.amount)
      if (amountDetail.transactionType == 'debit') {
        this.voucher.total.debit = parseFloat((this.voucher.total.debit + amountDetail.amount).toFixed(2));
      } else {
        this.voucher.total.credit = parseFloat((this.voucher.total.credit + amountDetail.amount).toFixed(2))
      }
    });
    if (!isUndefined(index)) {
      let ledgerId = this.voucher.amountDetails[index].ledger.id;
      console.log('total credit amount', this.voucher.total.credit);
      console.log('find balance amount', this.findBalance(index));
      if (this.findBalance(index) && this.findBalance(index) < this.voucher.total.credit) {
        console.log('check condition');
        this.voucher.amountDetails[index].amount = 0;
        alert('Please enter valid amount');
      }
      console.log('LedgerID:', ledgerId, this.balances[ledgerId]);
      if (this.balances[ledgerId]) {
        this.balances[ledgerId].current = this.balances[ledgerId].main - this.voucher.total.credit;
      }
    }

  }


  openledger(ledger?) {
    console.log('ledger123', ledger);
    if (ledger) this.common.params = ledger;
    this.modal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    this.modal.result.then(data => {
      this.modal = null;
      if (data.response) {
        this.addLedger(data.ledger);
      }
    });
  }

  addLedger(ledger) {
    console.log('ledgerdata', ledger);
    // const params ='';
    const params = {
      name: ledger.name,
      alias_name: ledger.aliasname,
      code: ledger.code,
      oid: ledger.user.id,
      per_rate: ledger.perrate,
      primarygroupid: ledger.undergroup.primarygroup_id,
      account_id: ledger.undergroup.id,
      accDetails: ledger.accDetails,
      branchname: ledger.branchname,
      branchcode: ledger.branchcode,
      accnumber: ledger.accnumber,
      creditdays: ledger.creditdays,
      openingbalance: ledger.openingbalance,
      isdr: ledger.openingisdr,
      approved: ledger.approved,
      deleteview: ledger.deleteview,
      delete: ledger.delete,
      x_id: ledger.id ? ledger.id : 0,
      bankname: ledger.bankname,
      costcenter: ledger.costcenter,
      taxtype: ledger.taxtype,
      taxsubtype: ledger.taxsubtype,
      isnon: ledger.isnon,
      hsnno: ledger.hsnno,
      hsndetail: ledger.hsndetail,
      gst: ledger.gst,
      cess: ledger.cess,
      igst: ledger.igst,
      taxability: ledger.taxability,
      calculationtype: ledger.calculationtype,
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getLedgers('debit');
        this.getLedgers('credit');
        if (res['data'][0].y_errormsg) {
          this.common.showToast(res['data'][0].y_errormsg);
        } else {
          this.common.showToast('Ledger Has been saved!');
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  handleCostCenterModal(amount, index) {
    console.log('Indes:', index);
    index = parseInt(index);
    this.common.params = { amount, details: this.voucher.amountDetails[index] };
    this.modal = this.modalService.open(VouchercostcenterComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    this.modal.result.then(data => {
      this.modal = null;
      console.log('Modal res:', data);
      if (data.response) {
        this.voucher.amountDetails[index].details = data.amountDetails;
      }
      console.log(document.getElementById('transaction-type-' + (index + 1)), index, 'transaction-type-' + (index + 1));
      setTimeout(() => {
        console.log('eeee', document.getElementById('transaction-type-' + (index + 1)));
        console.log('0000000000000000000L:', this.showConfirmCostCenter);
        this.showConfirmCostCenter = false;
      }, 200);
      this.showConfirmCostCenter = false;
      this.setFoucus('transaction-type-' + (index + 1));
      console.log('Testiong', this.voucher.amountDetails[index]);
    });


  }


  openinvoicemodel(ledger, deletedid = 2) {
    let data = [];
    console.log('ledger123', ledger);
    if (ledger) {
      let params = {
        id: ledger,
      }
      this.common.loading++;
      this.api.post('Accounts/EditLedgerdata', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res['data']);
          data = res['data'];
          this.common.params = {
            ledgerdata: res['data'],
            deleted: deletedid,
            sizeledger: 0
          }
          // this.common.params = { data, title: 'Edit Ledgers Data' };
          const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
          activeModal.result.then(data => {
            // console.log('Data: ', data);
            if (data.response) {
              if (deletedid == 0) {
                this.addLedger(data.ledger);
              }
            }
          });

        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
    }
  }


  getLedgerView(index) {
    //  console.log('Ledger:', this.ledger);

    let params = {
      startdate: this.common.dateFormatternew(new Date()).split(' ')[0],
      enddate: this.common.dateFormatternew(new Date()).split(' ')[0],
      ledger: this.voucher.amountDetails[index].ledger.id,
      vouchertype: 0,
    };

    this.common.loading++;
    this.api.post('Accounts/getLedgerView', params)
      .subscribe(res => {
        this.common.loading--;
        this.ledgerbalance[index] = (res['data'][res['data'].length - 1]['y_cramunt'] != '0') ? ((res['data'][res['data'].length - 1]['y_cramunt'] != '0.00') ? (parseFloat(res['data'][res['data'].length - 1]['y_cramunt'])).toFixed(2) + ' Cr' : '0') : ((res['data'][res['data'].length - 1]['y_dramunt']) == '0') ? '0' : (res['data'][res['data'].length - 1]['y_dramunt']) != '0.00' ? (parseFloat(res['data'][res['data'].length - 1]['y_dramunt'])).toFixed(2) + ' Dr' : '0';
        console.log('Res getLedgerView:', res['data'], res['data'][res['data'].length - 1], this.ledgerbalance);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


}
