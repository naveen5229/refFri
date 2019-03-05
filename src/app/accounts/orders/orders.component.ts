import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { TaxdetailComponent } from '../../acounts-modals/taxdetail/taxdetail.component';


@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  branchdata=[];
  orderTypeData=[];
  order = {
    date: this.common.dateFormatter(new Date()).split(' ')[0],
    biltynumber: '',
    biltydate: this.common.dateFormatter(new Date()).split(' ')[0],
    totalamount:0,
    grnremarks:'',
    branch: {
      name: '',
      id: ''
    },
    ordertype: {
      name: '',
      id: ''
    },
    ledger: {
      name: '',
      id: ''
    },
    purchaseledger: {
      name: '',
      id: ''
    },
    amountDetails: [{
      transactionType: 'debit',
      ledger: '',
      taxledger: '',
      stockitem: '',
      stockunit: {
      name:'',
      id:''
      },
      qty: '',
      discountledger: '',
      warehouse: '',
      taxDetails: '',
      remarks:'',
      lineamount:0
    }]
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      this.getBranchList();
      this.getOrderList();
     }

  ngOnInit() {
  }
  /*
  openModal (order?) {
    console.log('ledger123',order);
      if (order) this.common.params = order;
      const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static',windowClass : "myCustomModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
        // this.addLedger(data.ledger);
        }
      });
  } */


  

  addAmountDetails() {
    this.order.amountDetails.push({
      transactionType: 'debit',
      ledger: '',
      taxledger: '',
      stockitem: '',
      stockunit: {
        name:'',
        id:''
        },
      qty: '',
      discountledger: '',
      warehouse: '',
      taxDetails: '',
      remarks:'',
      lineamount:0

    });
  }
  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }
  getOrderList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetOrderTypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.orderTypeData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }
  dismiss(response) {
    // console.log('Order:', this.order);
    if (response) {
      //console.log('Order new:', this.order);
      // return;
      this.addOrder(this.order);
    }
   // this.activeModal.close({ response: response, Voucher: this.order });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.order[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log(this.order[date]);
    });
  }
  
  

  

  TaxDetails(i) {
    const activeModal = this.modalService.open(TaxdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        console.log(data.taxDetails);
        this.order.amountDetails[i].taxDetails = data.taxDetails;
        this.setFoucus('plustransparent');
        // this.addLedger(data.ledger);
      }
    });
  }

  onSelected(selectedData, type, display) {
    this.order[type].name = selectedData[display];
    this.order[type].id = selectedData.id;
    console.log('order User: ', this.order);
  }

  addOrder(order) {
    console.log('new order', order);
    // const params = {};
    const params = {
      billingaddress: order.billingaddress,
      orderremarks: order.orderremarks,
      biltynumber: order.biltynumber,
     // code: order.code,
      biltydatestamp: order.biltydate,
      custcode: order.custcode,
      orderdata: order.date,
      deliveryterms: order.deliveryterms,
      paymentterms: order.paymentterms,
      vendorquotationref: order.qutationrefrence,
      review: order.review,
      shipmentlocation: order.shipmentlocation,
      vendorbidref: order.vendorbidref,
      branchid: order.branch.id,
      ledger: order.ledger.id,
      ordertype: order.ordertype.id,
      purchaseledgerid: order.purchaseledger.id,
      grnremarks: order.grnremarks,
     // approved: order.Approved,
     // delreview: order.delreview,
      amountDetails: order.amountDetails
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Company/InsertPurchaseOrder', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        this.common.showToast('Invoice Are Saved');
      return;
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });


  }

 calculateTotal() {
    let total = 0;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
        total += amountDetail.lineamount;
    });
    return total;
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);

    if (key == 'enter') {
    //  this.allowBackspace = true;
      // console.log('active', activeId);
      if (activeId.includes('branch')) {
        this.setFoucus('ordertype');
      } else  if (activeId.includes('ordertype')) {
        this.setFoucus('custcode');
      }else  if (activeId.includes('custcode')) {
        this.handleVoucherDateOnEnter();
        this.setFoucus('date');
      } else  if (activeId.includes('biltydate')) {
        this.setFoucus('deliveryterms');
      } else  if (activeId.includes('date')) {
        this.setFoucus('purchaseledger');
      } else  if (activeId.includes('discountledger')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('discountate'+'-'+index);
      }else  if (activeId.includes('purchaseledger')) {
         this.setFoucus('ledger');
      }  else  if (activeId.includes('ledger')) {
        this.setFoucus('vendorbidref');
      } else  if (activeId.includes('vendorbidref')) {
        this.setFoucus('qutationrefrence');
      } else  if (activeId.includes('qutationrefrence')) {
        this.setFoucus('shipmentlocation');
      } else  if (activeId.includes('shipmentlocation')) {
        this.setFoucus('paymentterms');
      } else  if (activeId.includes('paymentterms')) {
        this.setFoucus('biltynumber');
      } else  if (activeId.includes('biltynumber')) {
        this.setFoucus('biltydate');
      }  else  if (activeId.includes('deliveryterms')) {
        console.log(this.order.ordertype.name);
        this.setFoucus('billingaddress');
      } else  if ((activeId.includes('billingaddress') && (this.order.ordertype.name.toLowerCase().includes('purchase'))) || activeId.includes('grnremarks')) {
         this.setFoucus('orderremarks');
      }  else if (activeId.includes('billingaddress') && (this.order.ordertype.name.toLowerCase().includes('sales'))) {
        this.setFoucus('grnremarks');
     } else  if (activeId.includes('orderremarks')) {
        //let index = activeId.split('-')[1];
       // console.log('stockitem'+'-'+index);
        this.setFoucus('stockitem'+'-'+0);
      } else  if (activeId.includes('stockitem')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('qty'+'-'+index);
      } else  if (activeId.includes('qty')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('rate'+'-'+index);
      } else  if (activeId.includes('rate')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('discountledger'+'-'+index);
      }  else  if (activeId.includes('discountate')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('warehouse'+'-'+index);
      } else  if (activeId.includes('warehouse')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('remarks'+'-'+index);
      } else  if (activeId.includes('remarks')) {
        let index = parseInt(activeId.split('-')[1]);
        this.setFoucus('taxDetail'+'-'+index);
      } 
    }
  }

  
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
  
  handleVoucherDateOnEnter() {
    let dateArray = [];
    let separator = '-';
    if (this.order.date.includes('-')) {
      dateArray = this.order.date.split('-');
    } else if (this.order.date.includes('/')) {
      dateArray = this.order.date.split('/');
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
    this.order.date = date + separator + month + separator + year;
  }

}
