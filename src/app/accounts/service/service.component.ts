import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { TaxdetailComponent } from '../../acounts-modals/taxdetail/taxdetail.component';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { WareHouseModalComponent } from '../../acounts-modals/ware-house-modal/ware-house-modal.component';
import { AccountService } from '../../services/account.service';
import { LedgeraddressComponent } from '../../acounts-modals/ledgeraddress/ledgeraddress.component';
import { PrintService } from '../../services/print/print.service';
import { isNull } from 'util';
import { RecordsComponent } from '../../acounts-modals/records/records.component';
import { OtherinfoComponent } from '../../acounts-modals/otherinfo/otherinfo.component';
import { GstdataComponent} from '../../acounts-modals/gstdata/gstdata.component';
import { map } from 'd3';

@Component({
  selector: 'service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  host: {
    '(document:keydown)': 'keyHandler($event)'
  },
})
export class ServiceComponent implements OnInit {
  @ViewChild('testInput', { read: ElementRef }) input:ElementRef;
  showConfirm = false;
  stockitmeflag = true;
  suggestionname = '';
  branchdata = [];
  orderTypeData = [];
  supplier = [];
  ledgers = { all: [], suggestions: [] };
  showSuggestions = false;
  activeLedgerIndex = -1;
  totalitem = null;
  invoiceDetail = [];
  taxDetailData = [];
  mannual = false;
  freezedate = '';
  allowBackspace = true;
  ledgerbalance='';
  totalqty=0;
  totalamount=0;
  totalTaxamount=0;
  rateflag=[];
  ledgersuggestiondata=[];
  Taxdata=[];
  selectflag=1;
  otherinfoflag = 0;
  showConfirmaddmore=false;
  stateGstCode=0;
  tempdata=[];
  gstrate=[];
  branchstategstcode=0;
  order = {
    podate: this.common.dateFormatternew(new Date()).split(' ')[0],
    date: (this.accountService.voucherDate) ? this.accountService.voucherDate : this.common.dateFormatternew(new Date()).split(' ')[0],
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
    orderid: 0,
    delete: 0,
    ledgeraddressid: null,
    print: false,
    branchid: 0,
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
      id: 0
    },
    purchaseledger: {
      name: '',
      id: ''
    },
    ismanual: this.mannual,
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
      qty: null,
      discountledger: { name: '', id: '0' },
      warehouse: { name: '', id: '' },
      taxDetails: [],
      remarks: '',
      lineamount: null,
      discountate: 0,
      rate: null,
      amount: null,
      defaultcheck: true
    }]
  };

  taxdetails = [{
    taxledger: {
      name: '',
      id: '',
    },
    taxrate: 0,
    taxamount: 0,
    totalamount:0

  }];


  showDateModal = false;
  f2Date = 'date';
  activedateid = '';

  suggestions = {
    purchaseLedgers: [],
    supplierLedgers: [],
    stockItems: [],
    purchasestockItems: [],
    salesstockItems: [],
    discountLedgers: [],
    warehouses: [],
    invoiceTypes: [],
    list: [],
    invoiceList: [],
    Taxdata:[]
  };
  suggestionIndex = -1;

  activeId = 'ordertype';
  lastActiveId = '';

  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };

  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    private printService: PrintService,
    public modalService: NgbModal,
    public accountService: AccountService) {
    // this.getBranchList();
      this.order.ordertype.id = -104;
      this.order.ordertype.name = 'Service Sales Invoice';
      this.suggestionname = 'Service';
    this.getStockItems('sales');
    this.getTaxLedgers();

    // this.route.params.subscribe(params => {
    //   console.log('Params1: ', params);
      

    //   this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //   let suggestionname = params.name;
    //   if (suggestionname == 'Debit Note') {
    //     this.getInvoiceList(-2);
    //     this.suggestionname = 'purchase';
    //   }
    //   if (suggestionname == 'Credit Note') {
    //     this.getInvoiceList(-4);
    //     this.suggestionname = 'sales';
    //   }
    //   if (suggestionname == 'Purchase Assets Invoice') {
    //     // this.getInvoiceList(-4);
    //     this.suggestionname = 'inventary';
    //   }
    //   if (suggestionname == 'Purchase Invoice') {
    //     // this.getInvoiceList(-4);
    //     this.suggestionname = 'purchase';
    //   }
    //   if (suggestionname == 'Sales Invoice') {
    //     // this.getInvoiceList(-4);
    //     this.suggestionname = 'sales';
    //   }
    //   this.getStockItems(this.suggestionname);
    // });
    this.common.refresh = () => {
      this.getInvoiceTypes();
      this.getPurchaseLedgers();
      this.getSupplierLedgers();
      this.getStockItems('sales');
      // this.getStockItems('sales');
      // this.getStockItems('purchase');
      // this.getStockItems('inventary');
      this.getWarehouses();
      this.mannual = this.accountService.selected.branch.is_inv_manualapprove;
      this.order.ismanual = this.mannual;
      this.callApigstcode();
    };

    this.common.refresh();

    this.setFoucus('custcode');
    this.common.currentPage = this.order.ordertype.name;
    this.getFreeze();
    this.callApigstcode();
  }

  ngOnInit() {
  }



  setInvoice() {
    return {
      podate: this.common.dateFormatternew(new Date()).split(' ')[0],
      date: this.common.dateFormatternew(new Date()).split(' ')[0],
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
      orderid: 0,
      delete: 0,
      branchid: 0,
      ledgeraddressid: null,
      ismanual: this.mannual,
      print: false,
      // branch: {
      //   name: '',
      //   id: ''
      // },
      ordertype: {
        name: this.order.ordertype.name,
        id: this.order.ordertype.id
      },
      ledger: {
        name: '',
        id: 0
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
        qty: null,
        discountledger: { name: '', id: '' },
        warehouse: { name: '', id: '' },
        taxDetails: [],
        remarks: '',
        lineamount: null,
        discountate: 0,
        rate: null,
        amount: null,
        defaultcheck: true
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
      qty: null,
      discountledger: { name: '', id: '' },
      warehouse: { name: '', id: '' },
      taxDetails: [],
      remarks: '',
      lineamount: null,
      discountate: 0,
      rate: null,
      amount: null,
      defaultcheck: false

    });
    let index = parseInt(this.lastActiveId.split('-')[1]);
        console.log('tax detail inex',this.lastActiveId,index);
      this.showConfirmaddmore = false;
      this.setFoucus('warehouse-' + (index+1));
  }
  getTaxLedgers() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetLedgerWithRate', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.Taxdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
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
        console.log('----------------------kkk:', res['data']);
        this.suggestions.stockItems = res['data'];
        this.setAutoSuggestion();
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
  callconfirm(){
    this.showConfirm=true;
  }
  dismiss(response) {
    // console.log('Order:', this.order);
    this.showConfirm = false;
          event.preventDefault();
    if (response) {
      console.log('Order new:', this.accountService.selected.financialYear);
      // return;
      if (this.accountService.selected.branch.id == 0) {
        this.common.showError('Please select Branch');
        return;
      }
      if (this.accountService.selected.financialYear == null) {
        this.common.showError('This Select financial year ');
      } else if (this.accountService.selected.financialYear.isfrozen == true) {
        this.common.showError('This financial year is freezed. Please select currect financial year');
        return;
      }



      if (this.order.amountDetails[0].amount == 0) {
        this.common.showError('Please fill correct amount');
        return;
      } else {
        let voucherDate = this.common.dateFormatter(this.common.convertDate(this.order.date), 'y', false);
        if (voucherDate < this.accountService.selected.financialYear.startdate || voucherDate > this.accountService.selected.financialYear.enddate) {
          this.common.showError('Please Select Correct Financial Year');
          return;
        }
      }
      if (this.freezedate) {
        let rescompare = this.CompareDate(this.freezedate);
        console.log('heddlo', rescompare);
        if (rescompare == 0) {
          console.log('hello');
          this.common.showError('Please Enter Date After ' + this.freezedate);
          setTimeout(() => {
            this.setFoucus('date');
          }, 150);
        } else {
          this.addOrder(this.order);
          
          //return;
        }
      }
      else{
        this.common.showError('Please Select Correct Financial Year');
      }
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }

  modelCondition() {
    this.showConfirm = false;
    event.preventDefault();
    return;
  }
  modelConditionaddmore() {
    this.showConfirmaddmore = false;
    this.setFoucus('taxleder-0');
    event.preventDefault();
    return;
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.order[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.order[date]);
    });
  }

  TaxDetails(i) {
    if (this.order.amountDetails[i].amount == 0) {
      console.log('test hello again', this.order.amountDetails[i].amount, i);
      this.common.showError('Please fill correct amount');
      this.setFoucus('rate' + i);

    } else {
      this.common.params = {
        taxDetail: this.order.amountDetails[i].taxDetails,
        amount: this.order.amountDetails[i].amount,
        sizeIndex: 1
      }
      console.log('param common', this.common.params);

      const activeModal = this.modalService.open(TaxdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          console.log('????????', data.taxDetails);
          this.order.amountDetails[i].taxDetails = data.taxDetails;
          this.order.amountDetails[i].lineamount = null;
          console.log('###', this.order.amountDetails[i].amount);
          this.order.amountDetails[i].lineamount = (parseFloat(this.order.amountDetails[i].amount) + parseFloat(data.taxDetails[0].totalamount)).toFixed(2);
          this.totalTaxamount += data.taxDetails[0].totalamount;
          console.log('###---', this.order.amountDetails[i].lineamount, '-----||', data.taxDetails[0].totalamount);
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
    //  this.order.billingaddress = selectedData.address;
    console.log('order User: ', this.order);
  }

  addOrder(order) {
    console.log('new order', order);
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
      ledgeraddressid: order.ledgeraddressid,
      x_id: 0,
      ismannual: order.ismanual,
      branchid: order.branchid,
      taxdetail:this.taxdetails,
      taxdetailflag:1
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Company/InsertPurchaseOrder', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        if (order.print) this.printFunction();
        this.order = this.setInvoice();
        this.taxdetails =  [];
        this.taxdetails = [{
          taxledger: {
            name: '',
            id: '',
          },
          taxrate: 0,
          taxamount: 0,
          totalamount:0
      
        }];
        this.setFoucus('ordertype');
        this.common.showToast('Invoice Are Saved');
        return;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });


  }

  calculateTotal() {
    let total = null;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += parseFloat(amountDetail.amount);
    });
    this.totalamount = total;
    return total;
  }

  calculateTotalLineAmount() {
    let total = null;
    this.order.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amo  unt[type]);
      total += parseFloat(amountDetail.lineamount);
    });
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
    console.log('-------------:', event);
    this.setAutoSuggestion();
    if ((this.order.ordertype.name.toLowerCase().includes('purchase')) && this.activeId.includes('stockitem')) { this.suggestions.stockItems = this.suggestions.stockItems; }
    if ((this.order.ordertype.name.toLowerCase().includes('sales')) && this.activeId.includes('stockitem')) { this.suggestions.stockItems = this.suggestions.stockItems; }
    console.log('Active event11', event, this.order.ordertype.name, this.activeId, this.suggestions.purchasestockItems);
    if(this.showConfirmaddmore && key=='enter'){
      console.log('set command',this.lastActiveId,this.activeId);
      this.showConfirmaddmore=false;
      this.addAmountDetails();
      event.preventDefault();
      return;
      
    }if(this.showConfirmaddmore && key=='n'){
      this.showConfirmaddmore=false;
      event.preventDefault();
      return;
    }
   else if (!event.ctrlKey && (key == 'f2' && !this.showDateModal)) {
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
      //this.handleOrderDateOnEnter(this.activeId);
      this.order.date= this.common.handleVoucherDateOnEnter(this.order.date);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
      return;
    }



    // console.log('Active Id', this.activeId);
    if ((event.altKey && key === 'c') && ((this.activeId.includes('purchaseledger')) || (this.activeId.includes('discountledger')) || (this.activeId.includes('ledger')))) {
      // console.log('alt + C pressed');
      this.openledger();
      return;
    }
    if ((event.altKey && key === 'c') && (this.activeId.includes('stockitem'))) {
      // console.log('alt + C pressed');
      this.openStockItemModal();
      return;
    }
    if ((event.altKey && key === 'c') && (this.activeId.includes('warehouse'))) {
      // console.log('alt + C pressed');
      this.openwareHouseModal();
      return;
    }
    if ((event.altKey && key === 'u') && (this.activeId.includes('ledger'))) {
      // console.log('alt + C pressed');
      if(this.order.ledger.id !=0){
      this.openinvoicemodel(this.order.ledger.id,0);
      }
      return;
    }
    if (key === 'home' && (this.activeId.includes('ledger'))) {
      console.log('hello',this.activeId);
      //let ledgerindex = this.lastActiveId.split('-')[1];
      //purchaseledger,ledger,salesledger
      if(this.activeId == "ledger"){
      console.log('ledger value ------------',this.order.ledger.id);
      if(this.order.ledger.id != 0){
      this.openinvoicemodel(this.order.ledger.id);
      }else{
        this.common.showError('Please Select Correct Ledger');
      }
      }else if(this.activeId == "purchaseledger" || this.activeId == "ledgersup"){
        console.log('purchase ledger value ------------',this.order.purchaseledger.id);
        if(this.order.purchaseledger.id !=''){
          this.openinvoicemodel(this.order.purchaseledger.id);
          }
      }
    }
    if (event.ctrlKey && key === "`") {
      console.log('ctrl esacape');
      this.mouse();
      return;
    }
    if(this.activeId.includes('qty-') || this.activeId.includes('amtrate-')) {
      let index = parseInt(this.activeId.split('-')[1]);
      setTimeout(() => {
      if(((this.order.amountDetails[index].qty == 0) || (this.order.amountDetails[index].qty == null)) && ((this.order.amountDetails[index].rate == 0) || (this.order.amountDetails[index].rate == null))){
          this.rateflag[index]=1;
          if(this.activeId.includes('amtrate-')){
            this.setFoucus('amount-'+index);
          }
      }else{
        this.rateflag[index]=0;
      }
      console.log('rate flag ::',index,'index',this.rateflag[index],this.rateflag);
    }, 50);
    }
    // if(this.activeId.includes('amount-') ){
    //   let index = parseInt(this.activeId.split('-')[1]);
    //   setTimeout(() => {
    //   if(this.order.amountDetails[index].qty==0 ||  this.order.amountDetails[index].qty== null){
    //   this.order.amountDetails[index].qty= 1;
    //   this.order.amountDetails[index].lineamount=this.order.amountDetails[index].amount;
    //   this.order.amountDetails[index].rate=this.order.amountDetails[index].amount;
    //   }else{
    //     this.order.amountDetails[index].rate= this.order.amountDetails[index].lineamount/this.order.amountDetails[index].qty;
    //   }
    // }, 30);
    // }
    if (this.activeId.includes('qty-') && (this.order.ordertype.name.toLowerCase().includes('sales'))) {
      let index = parseInt(this.activeId.split('-')[1]);
      setTimeout(() => {
        console.log('available item', this.order.amountDetails[index].qty, 'second response', this.totalitem,'stockitemm',this.stockitmeflag);
        if(this.stockitmeflag){
        if ((parseInt(this.totalitem)) < (parseInt(this.order.amountDetails[index].qty))) {
          alert('Quantity is lower then available quantity');
          this.order.amountDetails[index].qty = 0;
        }
      }
      }, 300);
    }
    if((this.order.ordertype.name.toLowerCase().includes('sales') || this.order.ordertype.name.toLowerCase().includes('credit')) && (this.activeId.includes('amtrate-'))){ 
      let index = parseInt(this.activeId.split('-')[1]);
      let amount = this.order.amountDetails[index].amount;
      console.log('amount with condition',amount);
      if(((this.stockitmeflag) && (this.order.biltynumber == '')) && (amount >= 50000)){
       // this.order.amountDetails[index].rate = 0;
        this.common.showError('Please Enter vailde Eway Bill Number');
       // return
      }
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('branch')) {
        this.setFoucus('ordertype');
      } else if (this.activeId.includes('ordertype')) {
        console.log('order type', this.order.ordertype.name);
        if (this.order.ordertype.name.toLowerCase().includes('purchase')) { this.suggestions.stockItems = this.suggestions.purchasestockItems; }
        if (this.order.ordertype.name.toLowerCase().includes('sales')) { this.suggestions.stockItems = this.suggestions.salesstockItems; }

        this.setFoucus('custcode');
      } else if (this.activeId.includes('custcode')) {
        this.handleVoucherDateOnEnter();
        this.setFoucus('date');
      } else if (this.activeId.includes('biltydate')) {
        this.handleOrderDateOnEnter('biltydate');
        this.setFoucus('deliveryterms');
      } else if (this.activeId.includes('podate')) {
        this.handleOrderDateOnEnter('podate');
          this.setFoucus('qutationrefrence');
      } else if (this.activeId.includes('date')) {
        if (this.freezedate) {
          let rescompare = this.CompareDate(this.freezedate);
          console.log('heddlo', rescompare);
          if (rescompare == 0) {
            console.log('hello');
            this.common.showError('Please Enter Date After ' + this.freezedate);
            setTimeout(() => {
              this.setFoucus('date');
            }, 150);
          } else {
            if (this.order.ordertype.id == -104) {
              this.setFoucus('salesledger');
            } else {
              this.setFoucus('podate');
            }
          }
        }
      } else if (this.activeId.includes('purchaseledger') || this.activeId.includes('salesledger')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        if (this.order.ordertype.id == -108) {
          this.setFoucus('warehouse' + '-' + 0);
        }
        else {
          setTimeout(() => {
            console.log('sales ledger11111', this.order.purchaseledger.id);
            if (!(this.order.purchaseledger.id || this.order.purchaseledger.name)) {
              this.common.showError('Please Select Purchase Legder');
              this.order.purchaseledger.name = '';
              if (this.order.ordertype.id == -104) { this.setFoucus('salesledger'); }
              else {
                this.setFoucus('purchaseledger');
              }
              // return; 
            }
          }, 100);

          (this.order.ordertype.id == -108) ? this.setFoucus('ledger') : this.setFoucus('ledger');

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
      } else if (this.activeId.includes('ledger')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        setTimeout(() => {
          if (!(this.order.ledger.id || this.order.ledger.name)) {
            this.order.ledger.name = '';
            this.common.showError('Please Select Party Legder');
            this.setFoucus('ledger');
          }
        }, 100);
        this.setFoucus('OtherInfo');
      } else if (this.activeId.includes('taxleder')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('taxrate-' + index);
       
      }
      else if (this.activeId.includes('taxrate'))  {
        let index = parseInt(this.activeId.split('-')[1]);
      this.setFoucus('taxamount-' + index);
      }
      else if (this.activeId.includes('taxamount')){
       console.log('total length of text detail',this.taxdetails.length,'actv id',this.activeId);
       let totallenth =this.taxdetails.length;
       this.lastActiveId=this.activeId;
       this.setFoucus('taxdetailbutton-0');
      } else if(this.activeId.includes('taxdetailbutton-')){
        let index = parseInt(this.lastActiveId.split('-')[1]);
        console.log('tax detail inex',this.lastActiveId,index);
      this.setFoucus('taxleder-' + (index+1));
      }else if(this.activeId.includes('plustransparent')){
        let index = parseInt(this.lastActiveId.split('-')[1]);
        console.log('tax detail inex',this.lastActiveId,index);
       // this.showConfirmaddmore=true;
     // this.setFoucus('warehouse-' + (index+1));
      }
      
      // else if (this.activeId.includes('vendorbidref')) {
      //   this.setFoucus('shipmentlocation');
      // } else if (this.activeId.includes('qutationrefrence')) {
      //   if(this.order.ordertype.id == -104){
      //     this.setFoucus('salesledger');
      //       }else{
      //       if (this.freezedate) {
      //         let rescompare = this.CompareDate(this.freezedate);
      //         console.log('heddlo', rescompare);
      //         if (rescompare == 0) {
      //           console.log('hello');
      //           this.common.showError('Please Enter Date After ' + this.freezedate);
      //           setTimeout(() => {
      //             this.setFoucus('purchaseledger');
      //           }, 150);
      //         } else {
      //           this.setFoucus('purchaseledger');
      //         }
      //       }
      //     }
      // }
      //  else if (this.activeId.includes('shipmentlocation')) {
      //   this.setFoucus('paymentterms');
      // } else if (this.activeId.includes('paymentterms')) {
      //   this.setFoucus('biltynumber');
      // } else if (this.activeId.includes('biltynumber')) {
      //   this.handleVoucherBiltyDateOnEnter();
      //   this.setFoucus('biltydate');
      // } else if (this.activeId.includes('deliveryterms')) {
      //   console.log(this.order.ordertype.name);
      //   this.setFoucus('billingaddress');
      // } else if ((this.activeId.includes('billingaddress') && ((this.order.ordertype.name.toLowerCase().includes('purchase')) || (this.order.ordertype.name.toLowerCase().includes('debit')))) || this.activeId.includes('grnremarks')) {
      //   this.setFoucus('orderremarks');
      // } else if (this.activeId.includes('billingaddress') && ((this.order.ordertype.name.toLowerCase().includes('sales'))|| (this.order.ordertype.name.toLowerCase().includes('credit')))) {
      //   this.setFoucus('grnremarks');
      // } else if (this.activeId.includes('orderremarks')) {
      //   //let index = activeId.split('-')[1];
      //   // console.log('stockitem'+'-'+index);
      //   this.setFoucus('warehouse' + '-' + 0);
      // }
       else if (this.activeId.includes('stockitem')) {
        // if (this.order.ordertype.name.toLowerCase().includes('purchase')) { this.suggestions.stockItems = this.suggestions.purchasestockItems; }
        // if (this.order.ordertype.name.toLowerCase().includes('sales')) { this.suggestions.stockItems = this.suggestions.salesstockItems; }

        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        //this.order[index].qty= null;


        if (this.order.ordertype.name.toLowerCase().includes('sales') && (!(this.stockitmeflag))) {
          //this.setFoucus('rate' + '-' + index);
          setTimeout(() => {
              if(!(this.order.amountDetails[index].stockitem.id || this.order.amountDetails[index].stockitem.name)){
                this.common.showError('Please Select Warehouse');  
                this.order.purchaseledger.name ='';   
                this.setFoucus('stockitem' + '-' + index);
               // return; 
                }else{
                this.setFoucus('qty-' + index);
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
        if (this.order.ordertype.id == -108) {
          this.setFoucus('plustransparent');
        }
        else {
          this.setFoucus('amtrate' + '-' + index);
        }
      } else if (this.activeId.includes('amtrate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        let element = document.getElementById('amount-'+index);
      // element.setSelectionRange(0, this.order.amountDetails[index].amount.length);
          this.setFoucus('amount-' + index);
      } else if (this.activeId.includes('discountate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('warehouse' + '-' + index);
      } else if (this.activeId.includes('warehouse')) {
        console.log("hello", this.activeId);
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

          
      //  this.setFoucus('stockitem' + '-' + index);
      } else if (this.activeId.includes('remarks')) {
        let index = parseInt(this.activeId.split('-')[1]);
       this.lastActiveId=this.activeId;
     //  this.setFoucus('plustransparent');
        this.showConfirmaddmore=true;
      } else if (this.activeId.includes('invocelist')) {
        this.setFoucus('custcode');
      }else if (this.activeId.includes('amount-')) {
        let index = parseInt(this.activeId.split('-')[1]);
        if (this.order.amountDetails[index].amount == 0) {
          console.log('test hello', this.order.amountDetails[index].amount, index);
          this.common.showError('Please fill correct amount');
          this.setFoucus('amount-' + index);
        }

        else {
          if(!this.order.amountDetails[index].qty){
            this.order.amountDetails[index].qty = this.order.amountDetails[index].amount/this.order.amountDetails[index].rate;
          }else{
            this.order.amountDetails[index].rate = this.order.amountDetails[index].amount/this.order.amountDetails[index].qty;
          }
       // this.callgstcode(this.order.amountDetails[index].stockitem.name,this.order.amountDetails[index].amount);
          this.setFoucus('remarks' + '-' + index);
        }
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'date') this.setFoucus('custcode');
      if (this.activeId == 'podate') this.setFoucus('date');
      if (this.activeId == 'salesledger') this.setFoucus('qutationrefrence');
      if (this.activeId == 'purchaseledger') this.setFoucus('qutationrefrence');
      if (this.activeId == 'ledger') { (this.order.ordertype.name.toLowerCase().includes('sales')) ? (this.setFoucus('salesledger')) : this.setFoucus('purchaseledger'); }
      if (this.activeId == 'vendorbidref') this.setFoucus('ledger');
      if (this.activeId == 'qutationrefrence') { (this.order.ordertype.name.toLowerCase().includes('sales')) ? (this.setFoucus('date')) : this.setFoucus('podate'); }
      if (this.activeId == 'shipmentlocation') this.setFoucus('vendorbidref');
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
      if (this.activeId.includes('remarks')) {
        let index = this.activeId.split('-')[1];
        this.setFoucus('amount-' + index);
      }
      if (this.activeId.includes('amount-')) {
        let index = this.activeId.split('-')[1];
        
        this.setFoucus('amtrate-' + index);
      }
      if (this.activeId.includes('amtrate')) {
        let index = this.activeId.split('-')[1];
        if (this.order.ordertype.id == -104) {
          this.setFoucus('stockitem-' + index);
        } else {
          this.setFoucus('qty-' + index);
        }

      }
      if (this.activeId.includes('qty')) {
        let index = this.activeId.split('-')[1];
        this.setFoucus('stockitem-' + index);
      }
      if (this.activeId.includes('stockitem')) {
        let index = this.activeId.split('-')[1];
        this.setFoucus('warehouse-' + index);
      }
      if (this.activeId.includes('warehouse')) {
        let index = this.activeId.split('-')[1];
        if (parseInt(index) == 0) {
          this.setFoucus('orderremarks');
        } else {
          this.setFoucus('remarks-' + (parseInt(index) - 1));
        }
      }

    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
      if (key.includes('arrowup') || key.includes('arrowdown')) {
        this.handleArrowUpDown(key);
        event.preventDefault();
      }
    } else if ((this.activeId == 'date' || this.activeId == 'podate' || this.activeId == 'biltydate') && key !== 'backspace') {
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
      
      this.setAutoSuggestion();
    }, 100);
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
    console.log('purchase=====', this.order.ordertype.id);
    let params = {
      search: 123,
      invoicetype: ((this.order.ordertype.id == -104) || (this.order.ordertype.id == -106)) ? 'sales' : 'purchase'
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
    console.log('other============', this.order.ordertype.id);

    let params = {
      search: 123,
      invoicetype: 'other'

    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedgerForInvoice', params)
      //this.api.post('Suggestion/GetAllLedgerAddress', params)
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


  getInvoiceList(orderid) {
    let params = {
      orderid: orderid
    };
    this.common.loading++;
    this.api.post('Suggestion/GetInvoiceList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.invoiceList = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  getInvoiceDetail(invoiceid) {
    let params = {
      invoiceId: invoiceid
    };
    this.common.loading++;
    this.api.post('Company/getInvoiceDetail', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log('Res:', res['data']);
        this.invoiceDetail = res['data']['invoice'];
        this.taxDetailData = res['data']['taxdetail'];
        console.log('Invoice detail', this.invoiceDetail[0]['y_biltynumber']);
        console.log('Tax Detail', this.taxDetailData);
        //  this.deletedId = this.common.params.delete;
        // this.order.orderid = this.common.params.invoiceid;
        this.order.biltynumber = this.invoiceDetail[0].y_biltynumber;
        // this.order.date = this.common.dateFormatternew(this.invoiceDetail[0].y_orderdate.split(' ')[0]);
        this.order.biltydate = this.common.dateFormatternew(this.invoiceDetail[0].y_biltydatestamp.split(' ')[0]);
        this.order.grnremarks = this.invoiceDetail[0].y_grn_remarks;
        this.order.billingaddress = this.invoiceDetail[0].y_vendorbillingaddress;
        // this.order.ordertype.id = this.invoiceDetail[0].y_ordertype_id;
        // this.order.ordertype.name = this.invoiceDetail[0].ordertype_name;
        this.order.custcode = this.invoiceDetail[0].y_cust_code;
        this.order.vendorbidref = this.invoiceDetail[0].y_vendorbidref;
        this.order.qutationrefrence = this.invoiceDetail[0].y_cust_code;
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

        this.invoiceDetail.map((invoiceDetail, index) => {
          if (!this.order.amountDetails[index]) {
            this.addAmountDetails();
          }
          //  this.order.amountDetails[index].id = invoiceDetail.y_dtl_id;
          this.order.amountDetails[index].stockitem.id = invoiceDetail.y_dtl_stockitemid;
          this.order.amountDetails[index].stockitem.name = invoiceDetail.stockitem_name;
          this.order.amountDetails[index].stockunit.id = invoiceDetail.y_dtl_stockunitid;
          this.order.amountDetails[index].stockunit.name = invoiceDetail.stockunit_name;
          this.order.amountDetails[index].warehouse.id = invoiceDetail.y_dtl_warehouse_id;
          this.order.amountDetails[index].warehouse.name = invoiceDetail.warehouse_name;
          this.order.amountDetails[index].qty = invoiceDetail.y_dtl_qty;
          this.order.amountDetails[index].rate = invoiceDetail.y_dtl_rate;
          this.order.amountDetails[index].lineamount = invoiceDetail.y_dtl_lineamount;
          this.order.amountDetails[index].remarks = invoiceDetail.y_invoice_remarks;
          this.order.amountDetails[index].amount = invoiceDetail.y_dtl_amount;
          this.order.totalamount += parseFloat(invoiceDetail.y_dtl_lineamount);

        });

        this.taxDetailData.map((taxdetail, taxindex) => {
          this.order.amountDetails.map(amountDetails => {
            if (amountDetails.id == taxdetail.y_invoicedetails_id) {
              let data = {
                taxledger: {
                  name: taxdetail.y_ledger_name,
                  id: taxdetail.y_ledger_id,
                },
                taxrate: taxdetail.y_rate,
                taxamount: taxdetail.y_amount,
                totalamount: null
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


        this.common.loading--;
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
    this.setFoucus('ledger');

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
    let IDs = ['ordertype', 'purchaseledger', 'ledger'];
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
    } else if (this.activeId == 'ledger') {
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
    } else if (this.activeId.includes('taxleder-')) {
      if (element['value']) {
        suggestions = this.suggestions.Taxdata.filter(warehouse => warehouse.name.replace(/\./g, "").toLowerCase().includes(search));
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
      let suggestionname = suggestion.name;
      if (suggestionname == 'Debit Note') {
        this.getInvoiceList(-2);
        suggestionname = 'Purchase Invoice';
      }
      if (suggestionname == 'Credit Note') {
        this.getInvoiceList(-4);
        suggestionname = 'Sales Invoice';
      }
      this.getStockItems(suggestionname);
    } else if (this.activeId == 'ledger') {
      this.order.ledger.name = suggestion.name;
      this.order.ledger.id = suggestion.id;
      // this.order.billingaddress = suggestion.address;
      //getAddressByLedgerId(suggestion.id);
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
    } else if (this.activeId.includes('invocelist')) {
      this.getInvoiceDetail(suggestion.id);
    } else if (this.activeId.includes('taxledger-')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.taxdetails[index].taxledger.name = suggestion.name;
      this.taxdetails[index].taxledger.id = suggestion.id;
      this.taxdetails[index].taxrate = (suggestion.per_rate == null) ? 0 : suggestion.per_rate;
      this.taxdetails[index].taxamount = parseFloat(((this.taxdetails[index].taxrate  * this.totalamount)/100).toFixed(2));
  
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
      bankname: ledger.bankname,
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
        this.getSupplierLedgers();
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
      foid: 123,
      name: stockItem.name,
      code: stockItem.code,
      stocksubtypeid: stockItem.stockSubType.id,
      sales: stockItem.sales,
      purchase: stockItem.purchase,
      minlimit: stockItem.minlimit,
      maxlimit: stockItem.maxlimit,
      isactive: stockItem.isactive,
      inventary: stockItem.inventary,
      stockunit: stockItem.unit.id, gst: stockItem.gst,
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
        this.getStockItems(this.order.ordertype.name);
        //   this.getStockItems('purchase');
        this.common.showToast("Stock item Saved");
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  setAutoSuggestion() {
    console.log('-----------------------:', this.suggestions.stockItems, 'ww:', this.suggestions.warehouses);
    let activeId = document.activeElement.id;
    console.log('Last Active Id:', activeId)
    if (activeId == 'ordertype') this.autoSuggestion.data = this.suggestions.invoiceTypes;
    else if (activeId == 'purchaseledger' || activeId == 'salesledger') this.autoSuggestion.data = this.suggestions.purchaseLedgers;
    else if (activeId == 'ledger'){
       this.autoSuggestion.data = this.suggestions.supplierLedgers;
     // this.ledgersuggestiondata = this.suggestions.supplierLedgers;
    }
    else if (activeId.includes('stockitem')) this.autoSuggestion.data = this.suggestions.stockItems;
    else if (activeId.includes('taxleder-')) this.autoSuggestion.data = this.suggestions.Taxdata;
    else if (activeId.includes('discountledger')) this.autoSuggestion.data = this.suggestions.purchaseLedgers;
    else if (activeId.includes('warehouse')){
       this.autoSuggestion.data = this.suggestions.warehouses;
       if(this.suggestions.warehouses.length ==1){
       console.log('where house suggestion',this.suggestions.warehouses[0]['id'],this.suggestions.warehouses);
       let splitindex = parseInt(activeId.split('-')[1]);
       this.order.amountDetails[splitindex].warehouse.id = this.suggestions.warehouses[0]['id'];
       this.order.amountDetails[splitindex].warehouse.name = this.suggestions.warehouses[0]['name'];
       }
    }
    else if (activeId.includes('invocelist')) this.autoSuggestion.data = this.suggestions.invoiceList;


    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    if (activeId.includes('invocelist')) { this.autoSuggestion.display = 'cust_code'; } else { this.autoSuggestion.display = 'name'; }
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'ordertype') {
      this.order.ordertype.name = suggestion.name;
      this.order.ordertype.id = suggestion.id;
      let suggestionname = suggestion.name;
      if (suggestionname == 'Debit Note') {
        this.getInvoiceList(-2);
        suggestionname = 'Purchase Invoice';
      }
      if (suggestionname == 'Credit Note') {
        this.getInvoiceList(-4);
        suggestionname = 'Sales Invoice';
      }
      this.getStockItems(suggestionname);
    } else if (activeId == 'ledger') {
        if(!(suggestion)){
          this.order.ledger.name = '';
          this.order.ledger.id = 0;
        }else{
            this.order.ledger.name = suggestion.name;
            this.order.ledger.id = suggestion.id;
            this.stateGstCode=suggestion.gst_state_code;
            if (suggestion.address_count > 1) {
              this.getAddressByLedgerId(suggestion.id);
            } else {
              this.order.billingaddress = suggestion.address;
            }
            this.getLedgerView();
          }
    } else if (activeId == 'purchaseledger' || activeId == 'salesledger') {
      if(!(suggestion)){
        this.order.purchaseledger.name = '';
        this.order.purchaseledger.id = '';
      }else{
      console.log('>>>>>>>>>', suggestion);
      this.order.purchaseledger.name = suggestion.name;
      this.order.purchaseledger.id = suggestion.id;
      // this.getAddressByLedgerId(suggestion.id);
      console.log('>>>>>>>>><<<<<<<<<', this.order.purchaseledger.id);
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
          this.gstrate[index] = suggestion.gst_igst_per;
          if (this.order.ordertype.name.toLowerCase().includes('sales')) {
            this.getStockAvailability(suggestion.id,(this.order.amountDetails[index].warehouse.id));
            console.log('suggestion indexing',suggestion);
            if(suggestion.is_service){
           // this.order.amountDetails[index].qty = 0;
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
      }
      //  this.getStockAvailability(suggestion.id);
    }else if (this.activeId.includes('taxleder-')) {
      console.log('tax ledger',suggestion);
      const index = parseInt(this.activeId.split('-')[1]);
      this.taxdetails[index].taxledger.name = suggestion.name;
      this.taxdetails[index].taxledger.id = suggestion.id;
      this.taxdetails[index].taxrate = (suggestion.per_rate == null) ? 0 : suggestion.per_rate;
      this.taxdetails[index].taxamount = parseFloat(((this.taxdetails[index].taxrate  * this.totalamount)/100).toFixed(2));
  
    }
    else if (activeId.includes('invocelist')) {
      this.getInvoiceDetail(suggestion.id);
    }
  }

  findStockitem() {
    return this.totalitem;
  }



  openwareHouseModal() {
    this.common.params = null;
    const activeModal = this.modalService.open(WareHouseModalComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        this.addWareHouse(data.wareHouse);
        return;
      }
    });
  }
  addWareHouse(wareHouse) {
    console.log('wareHouse', wareHouse);
    const params = {
      name: wareHouse.name,
      foid: 123,
      parentid: wareHouse.account.id,
      primarygroupid: wareHouse.account.primarygroup_id,
      x_id: 0
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Company/InsertWarehouse', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_warehouse;
        if (result == '') {
          this.common.showToast("Add Successfull  ");
        }
        else {
          this.common.showToast(result);
        }
        this.getWarehouses();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
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
  getLedgerView() {
  //  console.log('Ledger:', this.ledger);
    
    let params = {
      startdate: this.common.dateFormatternew(new Date()).split(' ')[0],
      enddate: this.common.dateFormatternew(new Date()).split(' ')[0],
      ledger: this.order.ledger.id,
      vouchertype: 0,
    };

    this.common.loading++;
    this.api.post('Accounts/getLedgerView', params)
      .subscribe(res => {
        this.common.loading--;
        this.ledgerbalance = (res['data'][res['data'].length - 1]['y_cramunt'] != '0') ? ((res['data'][res['data'].length - 1]['y_cramunt'] != '0.00') ? parseFloat(res['data'][res['data'].length - 1]['y_cramunt']).toFixed(2) + ' Cr':'0') : ((res['data'][res['data'].length - 1]['y_dramunt']) == '0') ? '0' : (res['data'][res['data'].length - 1]['y_dramunt']) != '0.00'? parseFloat(res['data'][res['data'].length - 1]['y_dramunt']).toFixed(2) + ' Dr':'0'; 
      // console.log('Res getLedgerView:', res['data'], res['data'][res['data'].length - 1] ,this.ledgerbalance);
      
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
        console.log('Res11:', res['data'], 'this.order', this.order);
        // this.Vouchers = res['data'];
        this.print(this.order, res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  callApigstcode(){
   // console.log('call ddd',stockname,amount);
    let params = {
      partyledger:this.order.ledger.id
    };
    this.common.loading++;
    this.api.post('Accounts/GetGstCode', params)
      .subscribe(res => {
        this.common.loading--;
        
       // console.log('Res gst code:', res,res['data'][0]['gst_state_code'],this.stateGstCode,this.gstrate);

        if(res['data'][0]){
         this.branchstategstcode = res['data'][0]['gst_state_code'];
        }else{
         this.branchstategstcode = 0;

        }
        console.log('temp data',this.tempdata);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
    
  }
  callgstcode(){
      this.tempdata=[];
      this.order.amountDetails.map((mapdata,index)=>{
          let amount = mapdata.amount;
          let stockname = mapdata.stockitem.name;
          let gstamount = this.gstrate[index];
        let taxamount = (amount * gstamount)/100;
      //  console.log('Res gst code:',this.branchstategstcode,this.stateGstCode,gstamount,taxamount);

        if(this.branchstategstcode){
        if((this.branchstategstcode && this.stateGstCode) && (this.branchstategstcode == this.stateGstCode)){
          this.tempdata.push({
            'stockname' :stockname, 
            'amount':amount,
            'gstrate':gstamount,
            'igst': 0, 
            'cgst':taxamount/2, 
           'sgst':taxamount/2
          });
        }
        else{
          this.tempdata.push({
            'stockname' :stockname, 
            'amount':amount,
            'gstrate':gstamount,
            'igst':taxamount , 
            'cgst':0, 
           'sgst':0
          });
        }
      }else{
        this.tempdata.push({
          'stockname' :stockname, 
          'amount':amount,
          'gstrate':gstamount,
          'igst':taxamount , 
          'cgst':0, 
         'sgst':0
        });
      }
    });
    console.log('tmp data',this.tempdata);
    this.showgstdetail();
        
  }
  showgstdetail(){
    
    this.common.params = { tempdata: this.tempdata,partycode:this.stateGstCode ,branchcode:this.branchstategstcode};
    const activeModal = this.modalService.open(GstdataComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        // console.log('ledger data',data.ledger);
        // this.addLedger(data.ledger);
      }
    });
  }
  print(voucherdataprint, companydata) {

    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;
    let rows = [];
    let totalqty = 0;
    let totalamount = null;
    let lasttotaltax = 0;
    let lineamounttotal = 0;
    voucherdataprint.amountDetails.map((invoiceDetail, index) => {
      let taxRowData = '';
      let taxTotal = 0;
      totalqty += invoiceDetail.qty;
      totalamount += invoiceDetail.amount;
      lineamounttotal += invoiceDetail.lineamount;

      invoiceDetail.taxDetails.map((taxDetail, index) => {
        taxRowData += taxDetail.taxledger.name + ' : ' + taxDetail.taxamount + ',';
        taxTotal += taxDetail.taxamount;
      });
      let lasttaxrowdata = taxRowData.substring(0, taxRowData.length - 1);
      lasttotaltax += taxTotal;

      rows.push([
        { txt: (index == 0) ? invoiceDetail.warehouse.name : (voucherdataprint.amountDetails[index - 1].warehouse.id == invoiceDetail.warehouse.id) ? '' : invoiceDetail.warehouse.name || '' },
        { txt: invoiceDetail.stockitem.name + '(' + invoiceDetail.stockunit.name + ')' + '</br>' + lasttaxrowdata || '' },
        { txt: invoiceDetail.qty || '' },
        { txt: invoiceDetail.rate || '' },
        { txt: invoiceDetail.amount || 0 },
        { txt: taxTotal || 0 },
        { txt: invoiceDetail.lineamount || null },
        { txt: invoiceDetail.remarks || '' }
      ]);
      console.log('invoiceDetail.taxDetails', invoiceDetail.taxDetails);

      // this.order.totalamount += parseInt(invoiceDetail.y_dtl_lineamount);

    });
    rows.push([
      { txt: '' },
      { txt: 'Total' },
      { txt: totalqty || '' },
      { txt: '-' },
      { txt: totalamount || null },
      { txt: lasttotaltax || 0 },
      { txt: lineamounttotal || 0 },
      { txt: '' }
    ]);
    let invoiceJson = {};
    if (voucherdataprint.ordertype.name.toLowerCase().includes('purchase') || voucherdataprint.ordertype.name.toLowerCase().includes('debit note')) {
      invoiceJson = {
        headers: [
          { txt: companydata[0].foname, size: '22px', weight: 'bold' },
          { txt: companydata[0].addressline },
          { txt: cityaddress },
          { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
        ],

        details: [

          { name: 'Invoice Type : ', value: voucherdataprint.ordertype.name },
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
    if (voucherdataprint.ordertype.name.toLowerCase().includes('wastage')) {
      invoiceJson = {
        headers: [
          { txt: companydata[0].foname, size: '22px', weight: 'bold' },
          { txt: companydata[0].addressline },
          { txt: cityaddress },
          { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
        ],

        details: [

          { name: 'Invoice Type : ', value: voucherdataprint.ordertype.name },
          { name: 'Invoice No : ', value: voucherdataprint.custcode },
          { name: 'Invoice Date : ', value: voucherdataprint.date },
          { name: 'Purchase Ledger : ', value: voucherdataprint.purchaseledger.name },
        ],
        table: {
          headings: [
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
    if (voucherdataprint.ordertype.name.toLowerCase().includes('sales') || voucherdataprint.ordertype.name.toLowerCase().includes('credit note')) {
      invoiceJson = {
        headers: [
          { txt: companydata[0].foname, size: '22px', weight: 'bold' },
          { txt: companydata[0].addressline },
          { txt: cityaddress },
          { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
        ],

        details: [

          { name: 'Invoice Type : ', value: voucherdataprint.ordertype.name },
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
    this.order = this.setInvoice();
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


  mouse() {
    this.common.params = { vouchertype: this.order.ordertype.id };
    const activeModal = this.modalService.open(RecordsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        // console.log('ledger data',data.ledger);
        // this.addLedger(data.ledger);
      }
    });


  }


  openinvoicemodel(ledger,deletedid=2) {
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
        sizeledger:0
          }
          // this.common.params = { data, title: 'Edit Ledgers Data' };
          const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
          activeModal.result.then(data => {
            // console.log('Data: ', data);
            if (data.response) {
              // console.log('ledger data',data.ledger);
              if(deletedid==0){
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

  OtherInfo() {
    this.common.params = { podate: this.order.podate,
    biltynumber:this.order.biltynumber,
    biltydate: this.order.biltydate,
    totalamount: this.order.totalamount,
    grnremarks: this.order.grnremarks,
    billingaddress: this.order.billingaddress,
    custcode: this.order.custcode,
    vendorbidref: this.order.vendorbidref,
    qutationrefrence: this.order.qutationrefrence,
    deliveryterms: this.order.deliveryterms,
    paymentterms: this.order.paymentterms,
    orderremarks: this.order.orderremarks,
    shipmentlocation: this.order.shipmentlocation };
    const activeModal = this.modalService.open(OtherinfoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
       console.log('Data: ', data);
      if (data.response) {
        this.setFoucus('warehouse-0');
        if(data.ledger.biltydate !=0 || data.ledger.biltynumber !=0 ||data.ledger.custcode !='' ||data.ledger.deliveryterms !='' ||data.ledger.grnremarks !='' ||data.ledger.orderremarks !='' ||data.ledger.paymentterms !='' ||data.ledger.podate !='' ||data.ledger.qutationrefrence !='' ||data.ledger.shipmentlocation !='' ||data.ledger.billingaddress !='' ||data.ledger.vendorbidref !=''){
          this.otherinfoflag = 1;
        }else{
          this.otherinfoflag = 0;
        }
        // console.log('ledger data',data.ledger);
        // this.addLedger(data.ledger);
      }
    });


  }
  addTaxAmountDetails() {
    this.taxdetails.push({
      taxledger: {
        name: '',
        id: '',
      },
      taxrate: 0,
      taxamount: 0,
      totalamount:0
    });

    // const activeId = document.activeElement.id;
   // let index = parseInt(activeId.split('-')[1]) + 1;
   // console.log(index);
    // activeId.includes('taxdetailbutton');
   // this.setFoucus('taxleder-' + index);
  }

  calculateTaxTotal() {
    let total = 0;
    this.taxdetails.map(taxdetail => {
      total += parseFloat((taxdetail.taxamount).toString());
      //console.log('taxdetail Amount: ',  taxdetail.taxamount,total);

      this.taxdetails[0].totalamount=  parseFloat(total.toString());
    });
    return  parseFloat(total.toString());
  }
  calculateTaxRateTotal(){
    let total = 0;
    this.taxdetails.map(taxdetail => {
      total += parseFloat((taxdetail.taxrate).toString());
      //console.log('taxdetail Amount: ',  taxdetail.taxamount,total);

      //this.taxdetails[0].taxrate=  parseFloat(total.toString());
    });
    return  parseFloat(total.toString());
  }
  calculateTaxAmount(){
    let total = 0;
    this.taxdetails.map(taxdetail => {
      total += parseFloat((taxdetail.taxamount).toString());
      //console.log('taxdetail Amount: ',  taxdetail.taxamount,total);

     // this.taxdetails[0].totalamount=  parseFloat(total.toString());
    });
    
    this.taxdetails.map(taxdetail => {
      total += parseFloat((taxdetail.taxrate).toString());
      //console.log('taxdetail Amount: ',  taxdetail.taxamount,total);

      //this.taxdetails[0].taxrate=  parseFloat(total.toString());
    });
    return  parseFloat(total.toString());

  }
}

