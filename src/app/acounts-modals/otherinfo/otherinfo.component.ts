import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'otherinfo',
  templateUrl: './otherinfo.component.html',
  styleUrls: ['./otherinfo.component.scss']
})
export class OtherinfoComponent implements OnInit {
  service = {
    podate: this.common.dateFormatternew(new Date()).split(' ')[0],
    biltynumber: '',
    biltydate: this.common.dateFormatternew(new Date()).split(' ')[0],
    totalamount: null,
    grnremarks: '',
    billingaddress: '',
    custcode: '',
    vendorbidref: '',
    qutationrefrence: '',
    deliveryterms: '',
    paymentterms: '',
    orderremarks: '',
    shipmentlocation: '',
  }
  activeId = '';
  showConfirm = false;
  lastActiveId = '';
  allowBackspace = false;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public accountService: AccountService) {

    if (this.common.params) {
      this.service.podate = this.common.params.podate,
        this.service.biltynumber = this.common.params.biltynumber,
        this.service.biltydate = this.common.params.biltydate,
        this.service.totalamount = this.common.params.totalamount,
        this.service.grnremarks = this.common.params.grnremarks,
        this.service.billingaddress = this.common.params.billingaddress,
        this.service.custcode = this.common.params.custcode,
        this.service.vendorbidref = this.common.params.vendorbidref,
        this.service.qutationrefrence = this.common.params.qutationrefrence,
        this.service.deliveryterms = this.common.params.deliveryterms,
        this.service.paymentterms = this.common.params.paymentterms,
        this.service.orderremarks = this.common.params.orderremarks,
        this.service.shipmentlocation = this.common.params.shipmentlocation
    }
    this.setFoucus('podate');
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 1);

  }

  ngOnInit() {
  }
  modelCondition() {
    // this.showConfirm = false;
    this.activeModal.close({});
    event.preventDefault();
    return;
  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('-------------:', event);
    if (this.activeId.includes('biltydate')) {
      this.handleOrderDateOnEnter('biltydate');
      this.setFoucus('deliveryterms');
    } else if (this.activeId.includes('podate')) {
      this.handleOrderDateOnEnter('podate');
      this.setFoucus('qutationrefrence');
    } else if (this.activeId.includes('vendorbidref')) {
      this.setFoucus('shipmentlocation');
    } else if (this.activeId.includes('qutationrefrence')) {
      this.setFoucus('paymentterms');
    } else if (this.activeId.includes('paymentterms')) {
      this.setFoucus('biltynumber');
    } else if (this.activeId.includes('biltynumber')) {
      //  this.handleOrderDateOnEnter();
      this.setFoucus('biltydate');
    } else if (this.activeId.includes('deliveryterms')) {
      this.setFoucus('billingaddress');
    } else if (this.activeId.includes('billingaddress')) {
      this.setFoucus('shipmentlocation');
    } else if (this.activeId.includes('shipmentlocation')) {
      this.setFoucus('submitother');
    }
  }

  handleOrderDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (iddate == 'date') ? 'podate' : 'biltydate';
    if (this.service[datestring].includes('-')) {
      dateArray = this.service[datestring].split('-');
    } else if (this.service[datestring].includes('/')) {
      dateArray = this.service[datestring].split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : (month >= 13) ? 12 : month;
    let finacialyear = (month > '03') ? (this.accountService.selected.financialYear['name']).split('-')[0] : (this.accountService.selected.financialYear['name']).split('-')[1];
    let year = dateArray[2];
    year = (year) ? (year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year) : finacialyear;
    this.service[datestring] = date + separator + month + separator + year;
  }
  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // if(id.toLowerCase().includes('amount-')){
      //   let index = id.split('-')[1];
      // id.select();
      // }
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);

      // this.setAutoSuggestion();
    }, 100);
  }
  dismiss(response) {
    console.log('Accounts:', this.service);
    this.activeModal.close({ response: response, ledger: this.service });
  }
}
