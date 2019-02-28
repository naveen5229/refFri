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

  order = {
    date: '',
    biltynumber: '',
    biltydate: '',
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
    public modalService: NgbModal) { }

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


}
