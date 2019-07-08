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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { VouchercostcenterComponent } from '../vouchercostcenter/vouchercostcenter.component';
import { PdfService } from '../../services/pdf/pdf.service';


@Component({
  selector: 'voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  Vouchers = [];
  voucherId = '';
  voucherName = '';
  voucher = null;
  vchId = 0;
  deleteId = 0;
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
  date = this.common.dateFormatternew(new Date());

  activeLedgerIndex = -1;

  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal,
    public pdfService: PdfService) {
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
    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.voucherEditDetail();
  }

  ngOnInit() {

  }

  setVoucher() {
    return {
      name: '',
      print: false,
      date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
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
      Y_code: '',
      xId: 0,
      delete: 0
    };
  }


  voucherEditDetail() {
    let params = {
      vchId: this.common.params.voucherId
    };
    console.log('vcid', this.common.params);
    this.deleteId = this.common.params.delete;
    this.api.post('Voucher/getVoucherDetail', params)
      .subscribe(res => {

        console.log('Voucher Edit Details:', res);
        this.voucherId = res['data'][0].y_vouchertype_id;
        this.voucher = {
          code: res['data'][0].y_cust_code,
          date: this.common.dateFormatternew(res['data'][0].y_date, 'ddMMYYYY', false, '-'),
          vouchertypeid: res['data'][0].y_vouchertype_id,
          amountDetails: [],
          remarks: res['data'][0].y_remarks,
          xId: res['data'][0].y_id,
          total: {
            debit: 0,
            credit: 0
          },
          y_code: res['data'][0].y_code
        }

        res['data'].map(voucher => {
          let costCenterDetails = [];
          if (voucher.y_cc_details) {
            let costStr = voucher.y_cc_details.replace(/'/g, '"');
            costStr = ("[" + costStr.substring(1, costStr.length - 1) + "]").replace(/{/g, '[').replace(/}/g, ']').replace(/""/g, '"');
            console.log('Cost STR:', costStr);
            console.log('Cost Array:', JSON.parse(costStr));
            let costArray = JSON.parse(costStr);
            costArray.map(cost => {
              costCenterDetails.push({
                ledger: {
                  id: cost[0],
                  name: cost[1],
                },
                amount: parseFloat(cost[2]),
              })
            })
          }

          this.voucher.amountDetails.push({
            transactionType: voucher.y_dlt_iscr ? 'credit' : 'debit',
            ledger: {
              name: voucher.y_ledgername,
              id: voucher.y_dlt_ledger_id
            },
            amount: parseFloat(voucher.y_dlt_amount),
            details: costCenterDetails
          });

          if (voucher.y_dlt_iscr) {
            this.voucher.total.credit += parseFloat(voucher.y_dlt_amount);
          } else {
            this.voucher.total.debit += parseFloat(voucher.y_dlt_amount);
          }
        });

        console.log('Voucher Details: ', this.voucher);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  modelCondition() {
    console.log('gess');
    this.showConfirm = false;
  //  this.activeModal.close();
  this.dismiss(false);
  }
  modelConditionsure() {
    this.showConfirm = false;
    event.preventDefault();
    return;
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
    console.log('Voucher:', this.voucher,'test response',response);
    if (response && this.voucher.total.debit !== this.voucher.total.credit) {
      this.common.showError('Credit And Debit Amount Should be Same');
      return;
    } else if (response && this.voucher.total.debit == 0) {
      this.common.showError('Please Enter Amount');
      this.showConfirm = false;
      event.preventDefault();
      return;
    }
    console.log('acc service', this.accountService.selected.branch, this.accountService.selected.branch.id != 0);
    if (this.accountService.selected.branch.id != 0) {
      // this.accountService.selected.branch
      this.addVoucher();
      this.showConfirm = false;
      event.preventDefault();
      return;
    } else if(response==false){
     // this.activeModal.close();
      this.activeModal.close({ data: false });
    }
    else {
      alert('Please Select Branch');
    }

    //  this.activeModal.close({ response: response, Voucher: this.voucher });
  }

  addVoucher() {
    console.log('voucher 1 :', this.voucher);
    //const params ='';
    const params = {
      foid: 123,
      // vouchertypeid: voucher.voucher.id,
      customercode: this.voucher.code,
      remarks: this.voucher.remarks,
      date: this.voucher.date,
      amountDetails: this.voucher.amountDetails,
      vouchertypeid: this.voucher.vouchertypeid,
      y_code: this.voucher.y_code,
      xid: this.voucher.xId,
      delete: this.voucher.delete
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'].code);
        if (res['success']) {
        
          //  this.common.showToast('Your Code :' + res['data'].code);
          //  this.common.showToast('Voucher Updated Succesfully');
         // this.setFoucus('ref-code');
          

          if (res['data'][0].save_voucher_v1) {
            if (this.voucher.print) {
              // this.getCompanyData();
              this.printVoucher(this.voucher, res['data']['companydata']);
              this.voucher = this.setVoucher();
              this.getVouchers();
            }
            this.voucher.date = params.date;
            this.activeModal.close();
            this.voucher = this.setVoucher();
            this.getVouchers();
            this.common.showToast('Your Code :' + res['data'].code);
            this.setFoucus('ref-code');

          } else {
            let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
            this.common.showError(message);
          }

        } else {
          let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
          this.common.showError(message);
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  printFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
        this.printVoucher(this.voucher, res['data']);

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

    //console.log('print pdf data', pdfData);
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
      amount: amount
    });
  }




  keyHandler(event) {
    const key = event.key.toLowerCase();
    // console.log(event);
    const activeId = document.activeElement.id;
    if (event.altKey && key === 'c') {
      // console.log('alt + C pressed');
      console.log('--------------------ALT+C-----------------:Voucher');
      this.openledger();
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
          this.addVoucher();
        }
      }if (key == 'n'){
          this.modelConditionsure();
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
          console.log('last hello ', this.showConfirmCostCenter, this.lastActiveId, 'index last', index);
          this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
          return
        }
      }
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
        console.log('Test: ', index, this.ledgers, this.ledgers.suggestions[0]);
        this.selectLedger(this.ledgers.suggestions[this.activeLedgerIndex !== -1 ? this.activeLedgerIndex : 0], index);
        console.log('hello dear', this.voucher.amountDetails[index].transactionType);
        if ((this.voucherId == '-1' || this.voucherId == '-3') && (this.voucher.amountDetails[index].transactionType == 'credit')) {
          this.getCurrentBalance(this.voucher.amountDetails[index].ledger.id);
        }
        this.setFoucus('amount-' + index);
        //this.setFoucus('ledger-container');
        this.activeLedgerIndex = -1;
        return;
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
    }
  }
  vouchercostcenter() {
    let index = document.activeElement.id.split('-')[1];
    console.log('fdsfedsfdsfdsf', this.lastActiveId);
    this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
    this.showConfirmCostCenter = false;
    event.preventDefault();
  }
  handleAmountEnter(index) {
    index = parseInt(index);
    if (this.voucher.amountDetails[index].ledger.is_constcenterallow) {
      this.showConfirmCostCenter = true;
      console.log('last one hello ggg', this.showConfirmCostCenter, this.lastActiveId, 'index last', index);

      // this.handleCostCenterModal(this.voucher.amountDetails[index].amount, index);
    }
    if (this.voucher.total.debit == this.voucher.total.credit && index == this.voucher.amountDetails.length - 1) {
      if (this.showConfirmCostCenter) return;
      this.setFoucus('narration');
      return;
    } else if (this.voucher.total.debit == this.voucher.total.credit && index != this.voucher.amountDetails.length - 1) {
      this.calculateTotal();
      console.log('console eror 2');
      // this.setFoucus('transaction-type-' + (index + 1));
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
    // this.setFoucus('transaction-type-' + (parseInt(index) + 1));
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
    console.log('Last Active ID:', this.lastActiveId, ledger);
    if (!index && this.lastActiveId.includes('ledger')) {
      index = this.lastActiveId.split('-')[1];
    }
    this.voucher.amountDetails[index].ledger.name = ledger.y_ledger_name;
    this.voucher.amountDetails[index].ledger.id = ledger.y_ledger_id;
    this.voucher.amountDetails[index].ledger.is_constcenterallow = ledger.is_constcenterallow;
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
    // console.log('IndexL::::', index);
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
        this.voucher.total.debit += amountDetail.amount;
      } else {
        this.voucher.total.credit += amountDetail.amount;
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
    const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        // console.log('ledger data',data.ledger);
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
      foid: ledger.user.id,
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
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getLedgers('debit');
        this.getLedgers('credit');
        this.common.showToast('Ledger Are Saved');
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }



  delete(tblid) {
    let params = {
      id: tblid
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete Voucher ',
        description: `<b>&nbsp;` + 'Are you sure want to delete ? ' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        //  this.common.loading++;
        if (data.response) {
          console.log("data", data);
          this.voucher.delete = 1;
          // this.addOrder(this.order);
          //this.dismiss(true);
          
          this.deleteFunction(1,'true');
          
          // this.activeModal.close({ response: true, ledger: this.voucher });
          // this.common.loading--;
        }
      });
    }
  }
  restore(){
    this.deleteFunction(1,'false');
  }
  approve(ID){
    this.deleteFunction(0,'true');
  }
  deleteFunction(type,typeans){
    let params = {
      id: this.voucher.xId,
      flagname: (type==1) ? 'deleted':'forapproved',
      flagvalue: typeans
    };
    this.common.loading++;
    this.api.post('Voucher/deleteAppeooved', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.getStockItems();
        this.activeModal.close({ response: true, ledger: this.voucher });
        if(type==1 && typeans=='true'){
        this.common.showToast(" This Value Has been Deleted!");
        }else  if(type==1 && typeans=='false'){
        this.common.showToast(" This Value Has been Restored!");
        } else {
        this.common.showToast(" This Value Has been Approved!");
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError('This Value has been used another entry!');
      });
  }
  permantdelete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'voucher'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete City ',
        description: `<b>&nbsp;` + 'Are you sure want to delete permanently ?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Stock/deletetable', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              //this.getStockItems();
              this.activeModal.close({ response: true, ledger: this.voucher });
              this.common.showToast(" This Value Has been Deleted!");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('This Value has been used another entry!');
            });
        }
      });
    }
  }

  handleCostCenterModal(amount, index) {
    console.log('Indes:', index);
    index = parseInt(index);
    this.common.params = { amount, details: this.voucher.amountDetails[index].details };
    const activeModal = this.modalService.open(VouchercostcenterComponent, { size: 'lg' });
    activeModal.result.then(data => {
      console.log('Modal res:', data);
      if (data.response) {
        this.voucher.amountDetails[index].details = data.amountDetails;
      }
      if (document.getElementById('transaction-type-' + (index + 1))) {
        console.log('console eror 1');
        this.setFoucus('transaction-type-' + (index + 1));
      } else {
        this.setFoucus('narration');
      }

      setTimeout(() => {
        console.log('eeee', document.getElementById('transaction-type-' + (index + 1)));
        console.log('0000000000000000000L:', this.showConfirmCostCenter);
        this.showConfirmCostCenter = false;
      }, 200);

      console.log('Testiong', this.voucher.amountDetails[index]);
    });

  }

}
