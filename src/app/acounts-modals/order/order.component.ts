import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { TaxdetailComponent } from '../taxdetail/taxdetail.component';
import { UserService } from '../../@core/data/users.service';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { LedgeraddressComponent } from '../../acounts-modals/ledgeraddress/ledgeraddress.component';
import { PrintService } from '../../services/print/print.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { AccountService } from '../../services/account.service';





@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  showConfirm = false;
  stockitmeflag = true;
  deletedId = 0;
  branchdata = [];
  orderTypeData = [];
  supplier = [];
  sizeIndex=0;
  allowBackspace = true;
  ledgers = { all: [], suggestions: [] };
  showSuggestions = false;
  activeLedgerIndex = -1;
  totalitem = null;
  invoiceDetail = [];
  taxDetailData = [];
  mannual=false;
  approve=0;
  freezedate='';  
  ledgerbalance='';
  totalqty=0;
  totalamount=0;
  totalTaxamount=0;
  order = {
    podate:this.common.dateFormatternew(new Date()).split(' ')[0],
    date: this.common.dateFormatternew(new Date()).split(' ')[0],
    biltynumber: null,
    biltydate: this.common.dateFormatternew(new Date()).split(' ')[0],
    totalamount: 0,
    grnremarks: '',
    billingaddress: '',
    custcode: '',
    vendorbidref: '',
    qutationrefrence: '',
    deliveryterms: '',
    paymentterms: '',
    orderremarks: '',
    shipmentlocation: '',
    orderid: 0,
    delete: 0,
    ledgeraddressid: null,
    mannual :false,
    branchid:0,
    // branch: {
    //   name: '',
    //   id: ''
    // },
    ordertype: {
      name: '',
      id: 0
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
      id: -1,
      transactionType: 'debit',
      ledger: '',
      taxledger: '',
      stockitem: {
        name: '',
        id: ''
      },
      stockunit: {
        name: '',
        id: ''
      },
      qty: '',
      discountledger: { name: '', id: '0' },
      warehouse: { name: '', id: '' },
      taxDetails: [],
      remarks: '',
      lineamount: 0,
      discountate: 0,
      rate: 0,
      amount: 0
    }]
  };

  suggestions = {
    purchaseLedgers: [],
    supplierLedgers: [],
    stockItems: [],
    purchasestockItems: [],
    salesstockItems: [],
    discountLedgers: [],
    warehouses: [],
    invoiceTypes: [],
    list: []
  };
  suggestionIndex = -1;

  activeId = '';
  lastActiveId = '';
  newid =0;
  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };
  pagename = 'Edit Invoice'
  showDateModal = false;
  f2Date = 'date';
  activedateid = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private printService: PrintService,
    public pdfService: PdfService,
    public accountService: AccountService) {
      if(this.common.params.ordertype){
        this.order.ordertype.id=this.common.params.ordertype;
      }
    this.getBranchList();
    this.getInvoiceTypes();
    this.getPurchaseLedgers();
    this.getSupplierLedgers();
    this.getStockItems('sales');
    this.getStockItems('purchase');
    this.getWarehouses();
    this.setFoucus('custcode');
    this.getInvoiceDetail();
    console.log('invoise edit detail',this.common.params);
    // this.common.currentPage = 'Invoice';
    
    if(this.common.params.sizeIndex){
      this.sizeIndex=this.common.params.sizeIndex;
    }
    if(this.common.params.newid){
      this.newid=this.common.params.newid;
      this.pagename ='Add Duplicate Invoice';
    }
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', this.sizeIndex);
    // console.log("open data ",this.invoiceDetail[]);
    this.getFreeze();
  }

  ngOnInit() {
  }

  approvefunction(id) {
    this.approveCallFunction(0, 'true',id);
  }
  approveCallFunction(type, typeans,xid) {
    let params = {
      id: xid,
      flagname: (type == 1) ? 'deleted' : 'forapproved',
      flagvalue: typeans
    };
    this.common.loading++;
    this.api.post('Voucher/invoiceApprooved', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.getStockItems();
        this.activeModal.close({ response: true });
        if (type == 1 && typeans == 'true') {
          this.common.showToast(" This Value Has been Deleted!");
        } else if (type == 1 && typeans == 'false') {
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

  getInvoiceDetail() {
    let params = {
      invoiceId: this.common.params.invoiceid
    };

    this.approve= this.common.params.approveid;
    console.log('vcid', this.common.params);

    this.api.post('Company/getInvoiceDetail', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log('Res detail:', res['data']);
        this.invoiceDetail = res['data']['invoice'];
        this.taxDetailData = res['data']['taxdetail'];
        console.log('Invoice detail', this.invoiceDetail);
        console.log('Tax Detail', this.taxDetailData);
        this.deletedId = this.common.params.delete;
        this.order.orderid = this.common.params.invoiceid;
        this.order.biltynumber = this.invoiceDetail[0].y_biltynumber;
        this.order.date = this.common.dateFormatternew(this.invoiceDetail[0].y_orderdate.split(' ')[0]);
        this.order.podate = (this.invoiceDetail[0].y_refdate == null) ? '': this.common.dateFormatternew(this.invoiceDetail[0].y_refdate.split(' ')[0]);
        this.order.biltydate = this.common.dateFormatternew(this.invoiceDetail[0].y_biltydatestamp.split(' ')[0]);
        this.order.grnremarks = this.invoiceDetail[0].y_grn_remarks;
        this.order.billingaddress = this.invoiceDetail[0].y_vendorbillingaddress;
        this.order.ordertype.id = this.invoiceDetail[0].y_ordertype_id;
        this.order.ordertype.name = this.invoiceDetail[0].ordertype_name;
        this.order.custcode = this.invoiceDetail[0].y_cust_code;
        this.order.vendorbidref = this.invoiceDetail[0].y_vendorbidref;
        this.order.qutationrefrence = this.invoiceDetail[0].y_vendorquotationref;
        this.order.paymentterms = this.invoiceDetail[0].y_paymentterms;
        this.order.deliveryterms = this.invoiceDetail[0].y_deliveryterms;
        this.order.orderremarks = this.invoiceDetail[0].y_order_remarks;
        this.order.purchaseledger.name = this.invoiceDetail[0].purchaseledger_name;
        this.order.purchaseledger.id = this.invoiceDetail[0].y_purchaseledgerid;
        this.order.ledger.id = this.invoiceDetail[0].y_vendorledgerid;
        this.order.ledger.name = this.invoiceDetail[0].vendorledger_name;
        this.order.shipmentlocation = this.invoiceDetail[0].y_shipmentlocation;
        this.order.grnremarks = this.invoiceDetail[0].y_grn_remarks;
        this.order.delete = 0;
        this.order.ledgeraddressid = this.invoiceDetail[0].y_ledger_address_id;
        this.order.mannual = (this.invoiceDetail[0].y_for_approved)?false:true;
        this.order.branchid = this.invoiceDetail[0].y_fobranch_id;

        this.invoiceDetail.map((invoiceDetail, index) => {
          if (!this.order.amountDetails[index]) {
            this.addAmountDetails();
          }
          this.order.amountDetails[index].id = invoiceDetail.y_dtl_id;
          this.order.amountDetails[index].stockitem.id = invoiceDetail.y_dtl_stockitemid;
          this.order.amountDetails[index].stockitem.name = invoiceDetail.stockitem_name;
          this.order.amountDetails[index].stockunit.id = invoiceDetail.y_dtl_stockunitid;
          this.order.amountDetails[index].stockunit.name = invoiceDetail.stockunit_name;
          this.order.amountDetails[index].warehouse.id = invoiceDetail.y_dtl_warehouse_id;
          this.order.amountDetails[index].warehouse.name = invoiceDetail.warehouse_name;
          this.order.amountDetails[index].qty = invoiceDetail.y_dtl_qty;
          this.order.amountDetails[index].rate = invoiceDetail.y_dtl_rate;
          this.order.amountDetails[index].lineamount = invoiceDetail.y_dtl_lineamount;
          this.order.amountDetails[index].remarks = invoiceDetail.y_dtl_remarks;
          this.order.amountDetails[index].amount = parseFloat(invoiceDetail.y_dtl_amount);
          this.order.totalamount += parseInt(invoiceDetail.y_dtl_lineamount);

        });

        this.taxDetailData.map((taxdetail, taxindex) => {
          this.order.amountDetails.map(amountDetails => {
            if (amountDetails.id == taxdetail.y_invoicedetails_id) {
              let data = {
                taxledger: {
                  name: taxdetail.y_ledger_name,
                  id: taxdetail.y_ledger_id,
                },
                taxrate: parseFloat(taxdetail.y_rate),
                taxamount: parseFloat(taxdetail.y_amount),
                totalamount: 0
              };

              amountDetails.taxDetails.push(data);
            }
          });
        });

        this.order.amountDetails.map(amountDetails => {
          let total = 0;
          amountDetails.taxDetails.map(taxDetails => {
            total += parseInt(taxDetails.taxamount);
          });

          amountDetails.taxDetails.map(taxDetails => {
            taxDetails.totalamount = total;
          });

        });
        console.log('this.order.totalamount - this.totalamount',this.order.amountDetails);
        // amountDetails: [{
        //   transactionType: 'debit',
        //   ledger: '',
        //   taxledger: '',
        //   stockitem: {
        //     name: '',
        //     id: ''
        //   },
        //   stockunit: {
        //     name: '',
        //     id: ''
        //   },
        //   qty: '',
        //   discountledger: { name: '', id: '0' },
        //   warehouse: { name: '', id: '' },
        //   taxDetails: [],
        //   remarks: '',
        //   lineamount: 0,
        //   discountate: 0,
        //   rate: 0
        // }]



      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }


  modelCondition() {
    this.showConfirm = false;
    event.preventDefault();
    return;
  }

  modelConditionnew() {
    // this.showConfirm = false;
    this.activeModal.close({});
    event.preventDefault();
    return;
  }
  
  setInvoice() {
    return {
    podate:this.common.dateFormatternew(new Date()).split(' ')[0],
      date: this.common.dateFormatternew(new Date()).split(' ')[0],
      biltynumber: '',
      biltydate: this.common.dateFormatternew(new Date()).split(' ')[0],
      totalamount: 0,
      grnremarks: '',
      billingaddress: '',
      custcode: '',
      vendorbidref: '',
      qutationrefrence: '',
      deliveryterms: '',
      paymentterms: '',
      orderremarks: '',
      shipmentlocation: '',
      orderid: 0,
      delete: 0,
      ledgeraddressid: null,
      mannual:false,
      branchid:0,
      // branch: {
      //   name: '',
      //   id: ''
      // },
      ordertype: {
        name: '',
        id: 0
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
        id: -1,
        transactionType: 'debit',
        ledger: '',
        taxledger: '',
        stockitem: {
          name: '',
          id: ''
        },
        stockunit: {
          name: '',
          id: ''
        },
        qty: '',
        discountledger: { name: '', id: '' },
        warehouse: { name: '', id: '' },
        taxDetails: [],
        remarks: '',
        lineamount: 0,
        discountate: 0,
        rate: 0,
        amount: 0,

      }]
    };
  }


  addAmountDetails() {
    this.order.amountDetails.push({
      id: -1,
      transactionType: 'debit',
      ledger: '',
      taxledger: '',
      stockitem: { name: '', id: '' },
      stockunit: {
        name: '',
        id: ''
      },
      qty: '',
      discountledger: { name: '', id: '' },
      warehouse: { name: '', id: '' },
      taxDetails: [],
      remarks: '',
      lineamount: 0,
      discountate: 0,
      rate: 0,
      amount: 0

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

  getInvoiceTypes() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetOrderTypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.invoiceTypes = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getStockItems(type) {
    this.common.loading++;
    this.api.get('Suggestion/GetStockItem?search=123&invoicetype=' + type)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data'],type);
        if ((this.order.ordertype.id == -104) || (this.order.ordertype.id == -106)) { this.suggestions.salesstockItems = res['data']; }
        if ((this.order.ordertype.id == -102) || (this.order.ordertype.id == -107) ||(this.order.ordertype.id == -108) ) { this.suggestions.purchasestockItems = res['data']; }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getWarehouses() {
    this.common.loading++;
    this.api.get('Suggestion/GetWareHouse?search=123')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.warehouses = res['data'];
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
      if (this.freezedate) {
        let rescompare = this.CompareDate(this.freezedate);
        console.log('heddlo',rescompare);
        if (rescompare == 0) {
          console.log('hello');
          this.common.showError('Please Enter Date After '+this.freezedate);
          setTimeout(() => {
            this.setFoucus('date');
          }, 150);
        } else {
      this.addOrder(this.order);
        }
      }
      else{
        this.common.showError('Please Select Correct Financial Year');
      }
      
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }

  restore(response) {
    // console.log('Order:', this.order);
    if (response) {
      //console.log('Order new:', this.order);
      // return;
      this.order.delete = 0;
      this.addOrder(this.order);
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.order[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.order[date]);
    });
  }

  TaxDetails(i) {
    if(this.order.amountDetails[i].amount==0){
      console.log('test hello again',this.order.amountDetails[i].amount,i);
      this.common.showError('Please fill correct amount');      
      this.setFoucus('rate'+i);
      
      }else{
   // this.common.handleModalSize('class', 'modal-lg', '1150', 'px', 1);
    this.common.params = {
      taxDetail: JSON.parse(JSON.stringify(this.order.amountDetails[i].taxDetails)),
      amount: this.order.amountDetails[i].amount,
      sizelandex:1
    };
    console.log('????????',this.common.params);
    const activeModal = this.modalService.open(TaxdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      console.log('tax Detail Data new : ', data,'addidas',this.order.amountDetails[i].taxDetails);
      if (data.response) {
        console.log('{{----}}',data);
        this.order.amountDetails[i].taxDetails = data.taxDetails;
        this.order.amountDetails[i].lineamount = 0;
        this.order.amountDetails[i].lineamount = this.order.amountDetails[i].amount + data.taxDetails[0].totalamount;//this.order.amountDetails[i].amount+data.taxDetails[0].totalamount
        this.totalTaxamount += data.taxDetails[0].totalamount;
        this.setFoucus('plustransparent');
        // this.addLedger(data.ledger);
      }
    });
  }
}

  onSelected(selectedData, type, display) {
    this.order[type].name = selectedData[display];
    this.order[type].id = selectedData.id;
    console.log('order User: ', this.order);
  }

  onSelectedaddress(selectedData, type, display) {
    this.order[type].name = selectedData[display];
    this.order[type].id = selectedData.id;
    this.order.billingaddress = selectedData.address;
    console.log('order User: ', this.order);
  }

  addOrder(order) {
    console.log('new order', order.orderid);
    // const params = {};
    const params = {
      billingaddress: order.billingaddress,
      orderremarks: order.orderremarks,
      biltynumber: order.biltynumber,
      podate: order.podate,
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
      // branchid: order.branch.id,
      ledger: order.ledger.id,
      ordertype: order.ordertype.id,
      purchaseledgerid: order.purchaseledger.id,
      grnremarks: order.grnremarks,
      // approved: order.Approved,
      // delreview: order.delreview,
      amountDetails: order.amountDetails,
      x_id: (this.newid==0) ? order.orderid :0,
      delete: order.delete,
      ledgeraddressid: order.ledgeraddressid,
      ismannual :order.mannual,
      branchid :order.branchid
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Company/InsertPurchaseOrder', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        this.order = this.setInvoice();
        this.setFoucus('ordertype');
        this.common.showToast('Invoice Are Saved');
        this.activeModal.close({responce:'true', delete: 'true'});
       // return;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError(err);
      });


  }

  calculateTotal() {
    let total = null;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += (amountDetail.amount);
    });
    return total;
  }

  calculateTotalLineAmount() {
    let total = 0;
    let totalamount = 0;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += (amountDetail.lineamount);
      totalamount += (amountDetail.amount);
    });
    this.totalTaxamount = ((total) - (totalamount));
    //console.log('parseflot :', total , totalamount,this.totalTaxamount);

    return total;


  }
  calculateTotalQty() {
    let total = null;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += parseFloat(amountDetail.qty);
    });
    return total;
  }
  
  getStockAvailability(stockid,whrhouseid) {
    let totalitem = 0;
    let params = {
      stockid: stockid,
      wherehouseid: whrhouseid
    };
     this.common.loading++;
    this.api.post('Suggestion/GetStockItemAvailableQty', params)
      .subscribe(res => {
         this.common.loading--;
        console.log('Res:', res['data'][0].get_stockitemavailableqty);
        this.totalitem = res['data'][0].get_stockitemavailableqty;
        //  console.log('totalitem : -',totalitem);
        return this.totalitem;
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event new 3333', event);
    this.setAutoSuggestion();

    if ((key == 'f2' && !this.showDateModal)) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = 'date';
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      console.log('(orderactivedateid',(this.order[this.lastActiveId]),this.activeId);
      this.order.date= this.common.handleVoucherDateOnEnter(this.order.date);
      this.setFoucus(this.lastActiveId);

      return;
    }else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
        return;
      }

    if(((this.order.ordertype.id == -102) || (this.order.ordertype.id == -107) ||(this.order.ordertype.id == -108) ) && this.activeId.includes('stockitem')) { this.suggestions.stockItems = this.suggestions.purchasestockItems; }
        if (((this.order.ordertype.id == -104) || (this.order.ordertype.id == -106)) && this.activeId.includes('stockitem')) { this.suggestions.stockItems = this.suggestions.salesstockItems; }
    // console.log('Active Id', this.activeId);
    if ((event.altKey && key === 'c') && ((this.activeId.includes('purchaseledger')) || (this.activeId.includes('discountledger')) || (this.activeId.includes('ledger')) || (this.activeId.includes('ledgersup')))) {
      // console.log('alt + C pressed');
      this.openledger();
    }
    if ((event.altKey && key === 'c') && (this.activeId.includes('stockitem'))) {
      // console.log('alt + C pressed');
      this.openStockItemModal();
    }
    if (this.activeId.includes('qty-') && (this.order.ordertype.name.toLowerCase().includes('sales'))) {
      let index = parseInt(this.activeId.split('-')[1]);
      setTimeout(() => {
      console.log('available item', this.order.amountDetails[index].qty,'second response',this.totalitem);
      if(this.stockitmeflag){
        if ((parseInt(this.totalitem)) < (parseInt(this.order.amountDetails[index].qty))) {
          alert('Quantity is lower then available quantity');
          this.order.amountDetails[index].qty = null;
        }
      }
      }, 300);
      // if ((this.totalitem) < parseInt(this.order.amountDetails[index].qty)) {
      //   console.log('Quantity is lower then available quantity');
      //   // this.order.amountDetails[index].qty = 0;
      // }
    }
    if (key === 'home' && (this.activeId.includes('ledger'))) {
      console.log('hello',this.activeId);
      //let ledgerindex = this.lastActiveId.split('-')[1];
      //purchaseledger,ledger,salesledger
      if(this.activeId == "ledger" || this.activeId == "ledgersup"){
      console.log('ledger value ------------',this.order.ledger.id);
      if(this.order.ledger.id != ''){
      this.openinvoicemodel(this.order.ledger.id);
      }
      }else if(this.activeId == "purchaseledger"){
        console.log('purchase ledger value ------------',this.order.purchaseledger.id);
        if(this.order.purchaseledger.id !=''){
          this.openinvoicemodel(this.order.purchaseledger.id);
          }
      }
    }
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('branch')) {
        this.setFoucus('ordertype');
      } else if (this.activeId.includes('ordertype')) {
        console.log('order type', this.order.ordertype.name);
        

        this.setFoucus('custcode');
      } else if (this.activeId.includes('custcode')) {
        this.handleVoucherDateOnEnter();
        this.setFoucus('date');
        
      } else if (this.activeId.includes('biltydate')) {
        this.handleOrderDateOnEnter('biltydate');
        this.setFoucus('deliveryterms');
      } else if (this.activeId.includes('podate')) {
        console.log('order type', this.order.ordertype);
        this.handleOrderDateOnEnter('podate');
        if(this.order.ordertype.id == -106){
          this.setFoucus('purchaseledger');
        }else{
        if (this.freezedate) {
          let rescompare = this.CompareDate(this.freezedate);
          console.log('heddlo',rescompare);
          if (rescompare == 0) {
            console.log('hello');
            this.common.showError('Please Enter Date After '+this.freezedate);
            setTimeout(() => {
              this.setFoucus('date');
            }, 150);
          } else {
          this.setFoucus('purchaseledger');
      }
    }}
   } else if((this.order.ordertype.name.toLowerCase().includes('sales') || this.order.ordertype.name.toLowerCase().includes('credit')) && (this.activeId.includes('rate-'))){ 
    let index = parseInt(this.activeId.split('-')[1]);
    let amount = this.order.amountDetails[index].amount;
    console.log('amount with condition',amount);
    if(((this.stockitmeflag) && (this.order.biltynumber == '')) && (amount >= 50000)){
      //this.order.amountDetails[index].rate = 0;
      this.common.showError('Please Enter vailde Eway Bill Number');
     // return
    }
  } else if (this.activeId.includes('date')) {
        if (this.freezedate) {
          let rescompare = this.CompareDate(this.freezedate);
          console.log('heddlo',rescompare);
          if (rescompare == 0) {
            console.log('hello');
            this.common.showError('Please Enter Date After '+this.freezedate);
            setTimeout(() => {
              this.setFoucus('date');
            }, 150);
          } else {
            (this.order.ordertype.name.toLowerCase().includes('sales')) ? (this.setFoucus('purchaseledger')) : this.setFoucus('podate');
          }
        }
      } else if (this.activeId.includes('purchaseledger')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        console.log('order type print',this.order.ordertype);
        if(this.order.ordertype.id != -108){
          setTimeout(() => {
            if(!(this.order.purchaseledger.id || this.order.purchaseledger.name)){
              this.common.showError('Please Select Purchase Legder');  
              this.order.purchaseledger.name ='';   
              this.setFoucus('purchaseledger');
             // return; 
              }
          }, 100);
          if(this.order.ordertype.id == -104 || this.order.ordertype.id == -106) { this.setFoucus('ledger'); }else { 
      //  console.log('leddger data print',this.purchaseledger.ledger);
        this.setFoucus('ledgersup'); }
        }else{
          setTimeout(() => {
            if(!(this.order.purchaseledger.id)){
              this.common.showError('Please Select Purchase Legder');  
              this.order.purchaseledger.name ='';   
              this.setFoucus('purchaseledger');
             // return; 
              }
          }, 100);
        console.log('leddger data print',this.order.purchaseledger);
        this.setFoucus('ledger');
        }
      } else if (this.activeId.includes('discountledger')) {
        console.log('0000000000000000000000000000000');
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('discountate' + '-' + index);
      } else if (this.activeId.includes('ledger') || this.activeId.includes('ledgersup')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        setTimeout(() => {
          console.log('this.order.ordertype.id ',(!(this.order.ledger.id)));
          if((this.order.ledger.id) == '' || (this.order.ledger.name) == ''){
            this.order.ledger.name ='';   
              this.common.showError('Please Select Supplier Legder'); 
             if(this.order.ordertype.id == -102){
              console.log('correct condition111');
                this.setFoucus('ledgersup');
               } else { 
            console.log('correct condition');
                 this.setFoucus('ledger'); 
                }
              }
        }, 50);
        console.log('leddger data print',this.order.ledger);
        this.setFoucus('vendorbidref');
      } else if (this.activeId.includes('vendorbidref')) {
        this.setFoucus('qutationrefrence');
      } else if (this.activeId.includes('qutationrefrence')) {
        this.setFoucus('shipmentlocation');
      } else if (this.activeId.includes('shipmentlocation')) {
        this.setFoucus('paymentterms');
      } else if (this.activeId.includes('paymentterms')) {
        this.setFoucus('biltynumber');
      } else if (this.activeId.includes('biltynumber')) {
        this.handleVoucherBiltyDateOnEnter();
        this.setFoucus('biltydate');
      } else if (this.activeId.includes('deliveryterms')) {
        console.log(this.order.ordertype.name);
        this.setFoucus('billingaddress');
      } else if ((this.activeId.includes('billingaddress') && ((this.order.ordertype.name.toLowerCase().includes('purchase')) || (this.order.ordertype.name.toLowerCase().includes('debit'))))  || this.activeId.includes('grnremarks')) {
        this.setFoucus('orderremarks');
      } else if (this.activeId.includes('billingaddress') &&((this.order.ordertype.name.toLowerCase().includes('sales'))|| (this.order.ordertype.name.toLowerCase().includes('credit')))) {
        this.setFoucus('grnremarks');
      } else if (this.activeId.includes('orderremarks')) {
        //let index = activeId.split('-')[1];
        // console.log('stockitem'+'-'+index);
        this.setFoucus('warehouse' + '-' + 0);
      } else if (this.activeId.includes('stockitem')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
       // this.setFoucus('qty' + '-' + index);
       if (this.order.ordertype.name.toLowerCase().includes('sales') && (!(this.stockitmeflag))) {
        //this.setFoucus('rate' + '-' + index);
        setTimeout(() => {
            if(!(this.order.amountDetails[index].stockitem.id || this.order.amountDetails[index].stockitem.name)){
              this.common.showError('Please Select Warehouse');  
              this.order.purchaseledger.name ='';   
              this.setFoucus('stockitem' + '-' + index);
             // return; 
              }else{
              this.setFoucus('rate' + '-' + index);
              }
          }, 100);
        } else {
          setTimeout(() => {
            if(!(this.order.amountDetails[index].stockitem.id || this.order.amountDetails[index].stockitem.name)){
              this.common.showError('Please Select Warehouse');  
              this.order.purchaseledger.name ='';   
              this.setFoucus('stockitem' + '-' + index);
            // return; 
              }else{
              this.setFoucus('qty' + '-' + index);
              }
          }, 100);
        // this.setFoucus('qty' + '-' + index);
        }
      } else if (this.activeId.includes('qty')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('rate' + '-' + index);
      } else if (this.activeId.includes('rate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('remarks' + '-' + index);
      } else if (this.activeId.includes('discountate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('warehouse' + '-' + index);
      } else if (this.activeId.includes('warehouse')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        setTimeout(() => {
        console.log('suggetion data',this.order.amountDetails[index].warehouse.id );

          if(!(this.order.amountDetails[index].warehouse.id || this.order.amountDetails[index].warehouse.name)){
            this.common.showError('Please Select Warehouse');  
            this.order.purchaseledger.name ='';   
            this.setFoucus('warehouse' + '-' + index);
           // return; 
            }else{
            this.setFoucus('stockitem' + '-' + index);
            }
        }, 100);

      // this.setFoucus('stockitem' + '-' + index);
      } else if (this.activeId.includes('remarks')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('taxDetail' + '-' + index);
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1 23123', this.activeId ,this.order.ordertype.id);
      if (this.activeId == 'date') this.setFoucus('custcode');
      if (this.activeId == 'purchaseledger') {
        if(this.order.ordertype.id == -102){
          this.setFoucus('podate'); 
        } 
        else {
      this.setFoucus('date');
     } 
    }
      if (this.activeId == 'podate') this.setFoucus('date');
      if (this.activeId == 'ledger' || this.activeId=='ledgersup') {
         (this.order.ordertype.id == -102) ?  this.setFoucus('podate') : this.setFoucus('purchaseledger'); 
        }
      //this.setFoucus('purchaseledger');
      if (this.activeId == 'vendorbidref') { 
              if(this.order.ordertype.id != -108) {
                    if(this.order.ordertype.id == -102){
                      this.setFoucus('ledgersup');
                    }
                    else{ 
                      this.setFoucus('ledger')
                    }
              }
              else{ 
                this.setFoucus('ledger');
               }
        }
      if (this.activeId == 'qutationrefrence') this.setFoucus('vendorbidref');
      if (this.activeId == 'shipmentlocation') this.setFoucus('qutationrefrence');
      if (this.activeId == 'paymentterms') this.setFoucus('shipmentlocation');
      if (this.activeId == 'biltynumber') this.setFoucus('paymentterms');
      if (this.activeId == 'biltydate') this.setFoucus('biltynumber');
      if (this.activeId == 'deliveryterms') this.setFoucus('biltydate');
      if (this.activeId == 'billingaddress') this.setFoucus('deliveryterms');
      if (this.activeId == 'grnremarks') this.setFoucus('billingaddress');
      if (this.activeId.includes('orderremarks') && ((this.order.ordertype.name.toLowerCase().includes('sales')) || (this.order.ordertype.name.toLowerCase().includes('credit')))) {
        this.setFoucus('grnremarks');
      }
      if (this.activeId.includes('orderremarks') && ((this.order.ordertype.name.toLowerCase().includes('purchase')) || (this.order.ordertype.name.toLowerCase().includes('debit')))) {
        this.setFoucus('billingaddress');
      }
      if (this.activeId.includes('remarks')){
        let index = this.activeId.split('-')[1];
        this.setFoucus('rate-'+index);
      } 
      if (this.activeId.includes('rate')){
        let index = this.activeId.split('-')[1];
        this.setFoucus('qty-'+index);
      } 
      if (this.activeId.includes('qty')){
        let index = this.activeId.split('-')[1];
        this.setFoucus('stockitem-'+index);
      } 
      if (this.activeId.includes('stockitem')){
        let index = this.activeId.split('-')[1];
        this.setFoucus('warehouse-'+index);
      } 
      if (this.activeId.includes('warehouse')){
        let index = this.activeId.split('-')[1];
        if(parseInt(index)==0){
          this.setFoucus('orderremarks');
        }else{
          this.setFoucus('remarks-'+(parseInt(index)-1));
        }
      } 

    } else if (key.includes('arrow')) {
        this.allowBackspace = false;
      if (key.includes('arrowup') || key.includes('arrowdown')) {
        this.handleArrowUpDown(key);
        event.preventDefault();
      }
    }else if ((this.activeId == 'date' || this.activeId == 'biltydate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }
    else if (key != 'backspace') {
      this.allowBackspace = false;
    }
  }

  setFoucus(id, isSetLastActive = true) {
    console.log('Id1111: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
      this.setAutoSuggestion();
    }, 100);
  }
  handleOrderDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (iddate == 'date') ? 'podate' : 'biltydate';
    if (this.order[datestring].includes('-')) {
      dateArray = this.order[datestring].split('-');
    } else if (this.order[datestring].includes('/')) {
      dateArray = this.order[datestring].split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : (month >= 13) ? 12 : month;
    let finacialyear = (month > '03')? (this.accountService.selected.financialYear['name']).split('-')[0] :(this.accountService.selected.financialYear['name']).split('-')[1];
    let year = dateArray[2];
    year = (year) ? (year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year):finacialyear;
    this.order[datestring] = date + separator + month + separator + year;
  }
  handleVoucherBiltyDateOnEnter() {
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
    // console.log('Date: ', date + separator + month + separator + year);
    this.order.biltydate = date + separator + month + separator + year;
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
    // console.log('Date: ', date + separator + month + separator + year);
    this.order.date = date + separator + month + separator + year;
  }


  getPurchaseLedgers() {
    let params = {
      search: 123,
      invoicetype: ((this.order.ordertype.id==-104) || (this.order.ordertype.id==-106 )) ? 'sales':'purchase'
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedgerForInvoice', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.purchaseLedgers = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getSupplierLedgers() {
    let params = {
      search: 123,
      invoicetype: 'other'
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedgerForInvoice', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.supplierLedgers = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  selectLedger(ledger) {
    //  console.log('Last Active ID:', this.lastActiveId);
    /*  if (!index && this.lastActiveId.includes('ledger')) {
        index = this.lastActiveId.split('-')[1];
      } */
    console.log('LEDGER: ', ledger);
    this.order.purchaseledger.name = ledger.name;
    this.order.purchaseledger.id = ledger.id;
   // this.setFoucus('ledger');
    (this.order.ordertype.id != -108) ? this.setFoucus('ledgersup') : this.setFoucus('ledger');

  }

  handleArrowUpDown(key) {
    const suggestionIDs = this.generateIDs();
    console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
    if (suggestionIDs.indexOf(this.activeId) == -1) return;

    if (key == 'arrowdown') {
      if (this.suggestionIndex != this.suggestions.list.length - 1) this.suggestionIndex++;
      else this.suggestionIndex = 0;
    } else {
      if (this.suggestionIndex != 0) this.suggestionIndex--;
      else this.suggestionIndex = this.suggestions.list.length - 1;
    }

    // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
    // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  }

  generateIDs() {
    let IDs = ['ordertype', 'purchaseledger', 'ledger','ledgersup'];
    this.order.amountDetails.map((amountDetails, index) => {
      IDs.push('stockitem-' + index);
      IDs.push('discountledger-' + index);
      IDs.push('warehouse-' + index);
    });
    return IDs;
  }

  getSuggestions() {
    const element = document.getElementById(this.activeId);
    const search = element ? element['value'] ? element['value'].toLowerCase() : '' : '';
    // console.log('Search: ', search, this.activeId);
    let suggestions = [];
    if (this.activeId == 'ordertype') {
      if (element['value']) {
        suggestions = this.suggestions.invoiceTypes.filter(invoiceType => invoiceType.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    } else if (this.activeId == 'purchaseledger') {
      if (element['value']) {
        suggestions = this.suggestions.purchaseLedgers.filter(purchaseLedger => purchaseLedger.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    } else if (this.activeId == 'ledger' || this.activeId == 'ledgersup') {
      if (element['value']) {
        suggestions = this.suggestions.supplierLedgers.filter(supplierLedger => supplierLedger.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    } else if (this.activeId.includes('stockitem')) {
      if (element['value']) {
        suggestions = this.suggestions.stockItems.filter(stockItem => stockItem.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    } else if (this.activeId.includes('discountledger')) {
      if (element['value']) {
        suggestions = this.suggestions.purchaseLedgers.filter(purchaseLedger => purchaseLedger.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    } else if (this.activeId.includes('warehouse')) {
      if (element['value']) {
        suggestions = this.suggestions.warehouses.filter(warehouse => warehouse.name.replace(/\./g, "").toLowerCase().includes(search));
        suggestions.splice(10, suggestions.length - 1)
      }
    }
    // purchaseledger stockitem-
    this.suggestions.list = suggestions;
    return this.suggestions.list;

  }

  selectSuggestion(suggestion, id?) {
    console.log('Suggestion: ', suggestion);
    if (this.activeId == 'ordertype') {
      this.order.ordertype.name = suggestion.name;
      this.order.ordertype.id = suggestion.id;
    } else if (this.activeId == 'ledger' || this.activeId == 'ledgersup') {
      this.order.ledger.name = suggestion.name;
      this.order.ledger.id = suggestion.id;
      this.order.billingaddress = suggestion.address;
    } else if (this.activeId == 'purchaseledger') {
      this.order.purchaseledger.name = suggestion.name;
      this.order.purchaseledger.id = suggestion.id;
    } else if (this.activeId.includes('stockitem')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.order.amountDetails[index].stockitem.name = suggestion.name;
      this.order.amountDetails[index].stockitem.id = suggestion.id;
      this.order.amountDetails[index].stockunit.name = suggestion.stockname;
      this.order.amountDetails[index].stockunit.id = suggestion.stockunit_id;
    } else if (this.activeId.includes('discountledger')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.order.amountDetails[index].discountledger.name = suggestion.name;
      this.order.amountDetails[index].discountledger.id = suggestion.id;
    } else if (this.activeId.includes('warehouse')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.order.amountDetails[index].warehouse.name = suggestion.name;
      this.order.amountDetails[index].warehouse.id = suggestion.id;
    }

  }

  openledger(ledger?) {
    console.log('ledger123', ledger);
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 1);
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
      primarygroupid: ledger.account.primarygroup_id,
      account_id: ledger.account.id,
      accDetails: ledger.accDetails,
      x_id: 0,
      branchname: ledger.branchname,
      branchcode: ledger.branchcode,
      accnumber: ledger.accnumber,
      creditdays: ledger.creditdays,
      openingbalance: ledger.openingbalance,
      isdr: ledger.openingisdr,
      approved: ledger.approved,
      deleteview: ledger.deleteview,
      delete: ledger.delete,
      costcenter: ledger.costcenter,
      taxtype: ledger.taxtype,
      taxsubtype: ledger.taxsubtype,
      isnon:ledger.isnon,
      hsnno:ledger.hsnno,
      hsndetail:ledger.hsndetail,
      gst:ledger.gst,
      cess:ledger.cess,
      igst:ledger.igst,
      taxability:ledger.taxability,
      calculationtype:ledger.calculationtype,
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getPurchaseLedgers();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }



  openStockItemModal(stockitem?) {
    console.log('stockitem', stockitem);
    if (stockitem) {
      this.common.params = stockitem;
    }
    // else {
    //   this.common.params = { stockType: { name: 'Tyre', id: -1 } };
    // }
    const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        if (stockitem) {
          // this.updateStockItem(stockitem.id, data.stockitem);
          return;
        }
        this.addStockItem(data.stockItem);
      }
    });
  }

  addStockItem(stockItem) {
    console.log(stockItem);
    // const params ='';
    const params = {
      //foid: stockItem.user.id,
      name: stockItem.name,
      code: stockItem.code,
      stocksubtypeid: stockItem.stockSubType.id,
      sales: stockItem.sales,
      purchase: stockItem.purchase,
      minlimit: stockItem.minlimit,
      maxlimit: stockItem.maxlimit,
      isactive: stockItem.isactive,
      inventary: stockItem.inventary,
      stockunit: stockItem.unit.id,
      gst: stockItem.gst,
      details: stockItem.hsndetail,
      hsnno: stockItem.hsnno,
      isnon: stockItem.isnon,
      cess: stockItem.cess,
      igst: stockItem.igst,
      taxability: stockItem.taxability,
      calculationtype: stockItem.calculationtype,
      openinngbal:stockItem.openingbal,
     openingqty:stockItem.openingqty

    };

    console.log('params: ', params);
    this.common.loading++;

    this.api.post('Stock/InsertStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.getStockItems('sales');
        this.getStockItems('purchase');
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  setAutoSuggestion() {
    let activeId = document.activeElement.id;
    console.log('set autosuggestion',activeId,this.suggestions.stockItems);
    if (activeId == 'ordertype') this.autoSuggestion.data = this.suggestions.invoiceTypes;
    else if (activeId == 'purchaseledger') this.autoSuggestion.data = this.suggestions.purchaseLedgers;
    else if (activeId == 'ledger' || activeId =='ledgersup') this.autoSuggestion.data = this.suggestions.supplierLedgers;
    else if (activeId.includes('stockitem')) this.autoSuggestion.data = this.suggestions.stockItems;
    else if (activeId.includes('discountledger')) this.autoSuggestion.data = this.suggestions.purchaseLedgers;
    else if (activeId.includes('warehouse')) this.autoSuggestion.data = this.suggestions.warehouses;
    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
  }
  callconfirm(){
    this.showConfirm=true;
  }
  onSelect(suggestion, activeId) {
    console.log('Suggestion new implement: ', suggestion);
    if (activeId == 'ordertype') {
      this.order.ordertype.name = suggestion.name;
      this.order.ordertype.id = suggestion.id;
    } else if (activeId == 'ledger' || activeId == 'ledgersup') {
      if(!(suggestion)){
        this.order.ledger.name = '';
        this.order.ledger.id = '';
      }else{
        this.order.ledger.name = suggestion.name;
      this.order.ledger.id = suggestion.id;
      if(suggestion.address_count >1){
        this.getAddressByLedgerId(suggestion.id);
        }else{
        this.order.billingaddress = suggestion.address;
        }
      }
      this.getLedgerView();
    } else if (activeId == 'purchaseledger') {
      if(!(suggestion)){
        this.order.purchaseledger.name = '';
        this.order.purchaseledger.id = '';
      }else{
      this.order.purchaseledger.name = suggestion.name;
      this.order.purchaseledger.id = suggestion.id;
      }
    } else if (activeId.includes('stockitem')) {
      const index = parseInt(activeId.split('-')[1]);
      if(!(suggestion)){
        this.order.amountDetails[index].stockitem.name = '';
        this.order.amountDetails[index].stockitem.id = '';
      }else{
      this.order.amountDetails[index].stockitem.name = suggestion.name;
      this.order.amountDetails[index].stockitem.id = suggestion.id;
      this.order.amountDetails[index].stockunit.name = suggestion.stockname;
      this.order.amountDetails[index].stockunit.id = suggestion.stockunit_id;
      if (this.order.ordertype.name.toLowerCase().includes('sales')) {
        this.getStockAvailability(suggestion.id,this.order.amountDetails[index].warehouse.id);
        console.log('suggestion indexing',suggestion);
        if(suggestion.is_service){
       // this.order.amountDetails[index].qty = 1;
        this.stockitmeflag = false;
        }
      }
      }

    } else if (activeId.includes('discountledger')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].discountledger.name = suggestion.name;
      this.order.amountDetails[index].discountledger.id = suggestion.id;
    } else if (activeId.includes('warehouse')) {
      const index = parseInt(activeId.split('-')[1]);
      if(!(suggestion)){
        this.order.amountDetails[index].warehouse.name = '';
        this.order.amountDetails[index].warehouse.id = '';
      }else{
      this.order.amountDetails[index].warehouse.name = suggestion.name;
      this.order.amountDetails[index].warehouse.id = suggestion.id;
      this.getStockAvailability(this.order.amountDetails[index].stockitem.id,suggestion.id);
      }
    }
  }

  findStockitem() {
    return this.totalitem;
  }

  delete(tblid) {
    let params = {
      id: tblid
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete Ledger ',
        description: `<b>&nbsp;` + 'Are you sure want to delete ? ' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        this.common.loading++;
        if (data.response) {
          console.log("data", data);
          this.order.delete = 1;
          this.addOrder(this.order);
          this.activeModal.close({ response: true,  delete: 'true' });
          this.common.loading--;
        }
      });
    }
  }



  permantdelete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'invoice'
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
              this.activeModal.close({ response: true, delete: 'true' });
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

  getAddressByLedgerId(id) {
    let params = {
      ledgerid: id
    };
    // this.common.loading++;
    this.api.post('Accounts/GetAddressByLedgerId', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log('Res ledger<<<<<<<<<<<<:', res['data']);
        if (res['data'].length > 1) {
          this.showAddpopup(res['data']);

        } else {
          this.order.billingaddress = res['data'][0]['address'];
          this.order.ledgeraddressid = res['data'][0]['id'];
        }
        // this.totalitem = res['data'][0].get_stockitemavailableqty;
        //  console.log('totalitem : -',totalitem);
        //   return this.totalitem;
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  showAddpopup(address) {
    console.log('data salutaion :: ??', address);
    this.common.params = {
      addressdata: address
    };
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 1);
    const activeModal = this.modalService.open(LedgeraddressComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        console.log('data order responce', data);
        this.order.billingaddress = data.adddata;
        this.order.ledgeraddressid = data.addressid;
        return;
      }
    });
  }

  printFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', this.order);
        // this.Vouchers = res['data'];
        this.print(this.order, res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  print(voucherdataprint, companydata) {

    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;
   
let invoiceJson={};
    if(voucherdataprint.ordertype.name.toLowerCase().includes('purchase') || voucherdataprint.ordertype.name.toLowerCase().includes('debit note')){
      let rows = [];
      let totalqty=0;
      let totalamount=0;
      let lasttotaltax=0;
      let lineamounttotal=0;
      voucherdataprint.amountDetails.map((invoiceDetail, index) => {
        console.log('invoice tax detail data =========',invoiceDetail);
        let taxRowData='';
        let taxTotal=0;
        totalqty+= parseFloat(invoiceDetail.qty);
        totalamount+= parseFloat(invoiceDetail.amount);
        lineamounttotal+= parseFloat(invoiceDetail.lineamount);

        invoiceDetail.taxDetails.map((taxDetail, index) => {
          taxRowData +=  taxDetail.taxledger.name +' : '+taxDetail.taxamount+',';
          taxTotal += parseFloat(taxDetail.taxamount); 
        });
        let lasttaxrowdata= taxRowData.substring(0, taxRowData.length - 1);
        lasttotaltax+=taxTotal;

        rows.push([
          { txt: index+1 },
          { txt: (index==0)?invoiceDetail.warehouse.name: (voucherdataprint.amountDetails[index-1].warehouse.id  == invoiceDetail.warehouse.id)? '':invoiceDetail.warehouse.name || '' },
          { txt: invoiceDetail.stockitem.name +'('+invoiceDetail.stockunit.name +')'+'</br>'+lasttaxrowdata || '' },
          { txt: invoiceDetail.qty || '' },
          { txt: invoiceDetail.rate || '' },
          { txt: invoiceDetail.amount || '' },
        { txt: taxTotal || 0 },
          { txt: invoiceDetail.lineamount || '' },
          { txt: invoiceDetail.remarks || '' }
        ]);
        console.log('invoiceDetail.taxDetails',invoiceDetail.taxDetails);
      
    
      });
      rows.push([
        { txt: '' },
        { txt: '' },
        { txt: 'Total' },
        { txt: totalqty || '' },
        { txt: '-' },
        { txt: totalamount || '' },
        { txt: lasttotaltax || 0 },
        { txt: lineamounttotal || '' },
        { txt: '' }
      ]);
     invoiceJson = {
      headers: [
        { txt: companydata[0].foname, size: '22px', weight: 'bold' },
        { txt: companydata[0].addressline },
        { txt: cityaddress },
        { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
      ],
     
      details: [
     
        { name: 'Invoice No : ', value: voucherdataprint.custcode },
        { name: 'Invoice Date : ', value: voucherdataprint.date },
        { name: 'Purchase Ledger : ', value: voucherdataprint.purchaseledger.name },
        { name: 'Supplier Ledger : ', value: voucherdataprint.ledger.name },
        { name: 'Supplier Ref. No : ', value: voucherdataprint.vendorbidref },
        { name: 'P.O.No. : ', value: voucherdataprint.qutationrefrence },
        { name: 'Shipment Location : ', value: voucherdataprint.shipmentlocation },
        { name: 'Payment Terms : ', value: voucherdataprint.paymentterms },
        { name: 'Bilty Number : ', value: voucherdataprint.biltynumber },
        { name: 'Bilty Date : ', value: voucherdataprint.biltydate },
        { name: 'Dilivery Terms : ', value: voucherdataprint.deliveryterms },
        { name: 'Billing Address : ', value: voucherdataprint.billingaddress },
        { name: 'Invoice Remarks : ', value: voucherdataprint.orderremarks }
      ],
      table: {
        headings: [
          { txt: 'S.No' },
          { txt: 'Ware House' },
          { txt: 'Item' },
          { txt: 'Quantity' },
          { txt: 'Rate' },
          { txt: 'Amount' },
          { txt: 'Tax Amount' },
          { txt: 'Total Amount' },
          { txt: 'Remarks' }
        ],
        rows: rows
      },
      signatures: ['Accountant', 'Approved By'],
      footer: {
        left: { name: 'Powered By', value: 'Elogist Solutions' },
        center: { name: 'Printed Date', value: '06-July-2019' },
        right: { name: 'Page No', value: 1 },
      }


    };
  }
  if(voucherdataprint.ordertype.name.toLowerCase().includes('wastage')){
    let rows = [];

    voucherdataprint.amountDetails.map((invoiceDetail, index) => {
      rows.push([
        { txt: index+1 },
        { txt: invoiceDetail.warehouse.name || '' },
        { txt: invoiceDetail.stockitem.name +'('+ invoiceDetail.stockunit.name + ')' || '' },
        { txt: invoiceDetail.qty || '' },
       
      ]);
      // this.order.totalamount += parseInt(invoiceDetail.y_dtl_lineamount);

    });
    invoiceJson = {
     headers: [
       { txt: companydata[0].foname, size: '22px', weight: 'bold' },
       { txt: companydata[0].addressline },
       { txt: cityaddress },
       { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
     ],
    
     details: [
    
       { name: 'Invoice No : ', value: voucherdataprint.custcode },
       { name: 'Invoice Date : ', value: voucherdataprint.date },
       { name: 'Purchase Ledger : ', value: voucherdataprint.purchaseledger.name },
     ],
     table: {
       headings: [
        { txt: 'S.No' },
         { txt: 'Ware House' },
         { txt: 'Item' },
         { txt: 'Qty' }
     
       ],
       rows: rows
     },
     signatures: ['Accountant', 'Approved By'],
     footer: {
       left: { name: 'Powered By', value: 'Elogist Solutions' },
       center: { name: 'Printed Date', value: '06-July-2019' },
       right: { name: 'Page No', value: 1 },
     }


   };
 }
  if(voucherdataprint.ordertype.name.toLowerCase().includes('sales') || voucherdataprint.ordertype.name.toLowerCase().includes('credit note')){
    let rows = [];

    voucherdataprint.amountDetails.map((invoiceDetail, index) => {
      rows.push([
        { txt: index+1 },
        { txt: invoiceDetail.warehouse.name || '' },
        { txt: invoiceDetail.stockitem.name+'('+invoiceDetail.stockunit.name +')' || '' },
        { txt: invoiceDetail.qty || '' },
        { txt: invoiceDetail.rate || '' },
        { txt: invoiceDetail.amount || '' },
        { txt: invoiceDetail.lineamount || '' },
        { txt: invoiceDetail.remarks || '' }
      ]);
      invoiceDetail.taxDetails.map((taxDetail, index) => {
        rows.push([
          { txt: taxDetail.taxledger.name  || '' ,'colspan':3,align:'right'},
          { txt: parseFloat(taxDetail.taxamount) || '','colspan':3 ,align:'right'},
          { txt:  '' },
          { txt:  '' }
        ]);
    });
      // this.order.totalamount += parseInt(invoiceDetail.y_dtl_lineamount);

    });
    invoiceJson = {
     headers: [
       { txt: companydata[0].foname, size: '22px', weight: 'bold' },
       { txt: companydata[0].addressline },
       { txt: cityaddress },
       { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
     ],
    
     details: [
    
       { name: 'Invoice No : ', value: voucherdataprint.custcode },
       { name: 'Invoice Date : ', value: voucherdataprint.date },
       { name: 'Sales Ledger : ', value: voucherdataprint.purchaseledger.name },
       { name: 'Party Name : ', value: voucherdataprint.ledger.name },
       { name: 'Order No : ', value: voucherdataprint.vendorbidref },
       { name: 'Other Reference : ', value: voucherdataprint.qutationrefrence },
       { name: 'Shipment Location : ', value: voucherdataprint.shipmentlocation },
       { name: 'Payment Terms : ', value: voucherdataprint.paymentterms },
       { name: 'Eway Bill Number : ', value: voucherdataprint.biltynumber },
       { name: 'Eway Bill Date : ', value: voucherdataprint.biltydate },
       { name: 'Dilivery Terms : ', value: voucherdataprint.deliveryterms },
       { name: 'Billing Address : ', value: voucherdataprint.billingaddress },
       { name: 'Consignee Address : ', value: voucherdataprint.grnremarks },
       { name: 'Invoice Remarks : ', value: voucherdataprint.orderremarks }
     ],
     table: {
       headings: [
        { txt: 'S.No' },
         { txt: 'Ware House' },
         { txt: 'Item' },
         { txt: 'Qty' },
         { txt: 'Rate' },
         { txt: 'Amount' },
         { txt: 'Tax Amount' },
         { txt: 'Total Amount' },
         { txt: 'Remarks' }
       ],
       rows: rows
     },
     signatures: ['Accountant', 'Approved By'],
     footer: {
       left: { name: 'Powered By', value: 'Elogist Solutions' },
       center: { name: 'Printed Date', value: '06-July-2019' },
       right: { name: 'Page No', value: 1 },
     }


   };
 }

    console.log('JSON', invoiceJson);

    localStorage.setItem('InvoiceJSO', JSON.stringify(invoiceJson));
    this.printService.printInvoice(invoiceJson, 1);

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
CompareDate(freezedate) {
  let firstarr = freezedate.split('-');
   console.log('first date ', firstarr);
  let secondarr = this.order.date.split('-'); 
  console.log('second arr ', secondarr[2]);

  let fristyear = firstarr[0];
  let firstmonth = firstarr[1];
  let firstdate = firstarr[2];
  let endyear = parseInt(secondarr[2]);
  let endmonth = parseInt(secondarr[1]);
  let enddate = parseInt(secondarr[0]);

  console.log('First Date:', fristyear, firstmonth, firstdate);
  console.log('Second Date:', endyear, endmonth, enddate);
  var dateOne = new Date(fristyear, firstmonth, firstdate);
 // var dateTwo = new Date(endyear, endmonth, enddate);
  var dateTwo = new Date(endyear, endmonth, enddate);
  
  if (dateOne > dateTwo) {
    return 0;
  } else {
    return 1;
  }
}
openinvoicemodel(ledger) {
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
          deleted: 2,
      sizeledger:1
        }
        // this.common.params = { data, title: 'Edit Ledgers Data' };
        const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
        activeModal.result.then(data => {
          // console.log('Data: ', data);
          if (data.response) {
         
          }
        });

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
}

getLedgerView() {
  //  console.log('Ledger:', this.ledger);
    
    let params = {
      startdate: this.common.dateFormatternew(new Date()).split(' ')[0],
      enddate: this.common.dateFormatternew(new Date()).split(' ')[0],
      ledger: this.order.ledger.id,
      vouchertype: -104,
    };

    this.common.loading++;
    this.api.post('Accounts/getLedgerView', params)
      .subscribe(res => {
        this.common.loading--;
        this.ledgerbalance = (res['data'][res['data'].length - 1]['y_cramunt'] != '0') ? ((res['data'][res['data'].length - 1]['y_cramunt'] != '0.00') ? res['data'][res['data'].length - 1]['y_cramunt'] + ' Cr':'0') : ((res['data'][res['data'].length - 1]['y_dramunt']) == '0') ? '0' : (res['data'][res['data'].length - 1]['y_dramunt']) != '0.00'? res['data'][res['data'].length - 1]['y_dramunt'] + ' Dr':'0'; 
       console.log('Res getLedgerView:', res['data'], res['data'][res['data'].length - 1] ,this.ledgerbalance);
      
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  
}
}
