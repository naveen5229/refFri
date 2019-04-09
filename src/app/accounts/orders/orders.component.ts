import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { TaxdetailComponent } from '../../acounts-modals/taxdetail/taxdetail.component';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  showConfirm = false;
  branchdata = [];
  orderTypeData = [];
  supplier = [];
  ledgers = { all: [], suggestions: [] };
  showSuggestions = false;
  activeLedgerIndex = -1;
  totalitem=0;
  order = {
    date: this.common.dateFormatter(new Date()).split(' ')[0],
    biltynumber: '',
    biltydate: this.common.dateFormatter(new Date()).split(' ')[0],
    totalamount: 0,
    grnremarks: '',
    billingaddress: '',
    // branch: {
    //   name: '',
    //   id: ''
    // },
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
      discountate:0
    }]
  };

  suggestions = {
    purchaseLedgers: [],
    supplierLedgers: [],
    stockItems: [],
    purchasestockItems:[],
    salesstockItems:[],
    discountLedgers: [],
    warehouses: [],
    invoiceTypes: [],
    list: []
  };
  suggestionIndex = -1;

  activeId = '';
  lastActiveId = '';

  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getBranchList();
    this.getInvoiceTypes();
    this.getPurchaseLedgers();
    this.getSupplierLedgers();
    this.getStockItems('sales');
    this.getStockItems('purchase');
    this.getWarehouses();
    this.setFoucus('ordertype');
    this.common.currentPage = 'Invoice';
  }

  ngOnInit() {
  }



  setInvoice() {
    return {
      date: this.common.dateFormatter(new Date()).split(' ')[0],
      biltynumber: '',
      biltydate: this.common.dateFormatter(new Date()).split(' ')[0],
      totalamount: 0,
      grnremarks: '',
      billingaddress: '',
      // branch: {
      //   name: '',
      //   id: ''
      // },
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
        discountate:0
      }]
    };
  }


  addAmountDetails() {
    this.order.amountDetails.push({
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
      discountate:0

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
    this.api.get('Suggestion/GetStockItem?search=123&invoicetype='+type)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        if(type =='sales') { this.suggestions.salesstockItems = res['data']; }
        if(type =='purchase') { this.suggestions.purchasestockItems = res['data']; } 
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
    this.common.params = this.order.amountDetails[i].taxDetails;
    
    const activeModal = this.modalService.open(TaxdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass : "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        console.log(data.taxDetails);
        this.order.amountDetails[i].taxDetails = data.taxDetails;
        this.order.amountDetails[i].lineamount += data.taxDetails[0].totalamount;
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

  onSelectedaddress(selectedData, type, display) {
    this.order[type].name = selectedData[display];
    this.order[type].id = selectedData.id;
    this.order.billingaddress = selectedData.address;
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
     // branchid: order.branch.id,
      ledger: order.ledger.id,
      ordertype: order.ordertype.id,
      purchaseledgerid: order.purchaseledger.id,
      grnremarks: order.grnremarks,
      // approved: order.Approved,
      // delreview: order.delreview,
      amountDetails: order.amountDetails,
      x_id:0
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
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    this.setAutoSuggestion();

    // console.log('Active Id', this.activeId);
    if ((event.altKey && key === 'c') && ((this.activeId.includes('purchaseledger')) || (this.activeId.includes('discountledger')) || (this.activeId.includes('ledger')))) {
      // console.log('alt + C pressed');
      this.openledger();
    }
    if ((event.altKey && key === 'c') && (this.activeId.includes('stockitem'))) {
      // console.log('alt + C pressed');
      this.openStockItemModal();
    }
    if (key == 'enter') {
      if (this.activeId.includes('branch')) {
        this.setFoucus('ordertype');
      } else if (this.activeId.includes('ordertype')) {
        console.log('order type',this.order.ordertype.name);
        if(this.order.ordertype.name.toLowerCase().includes('purchase')) { this.suggestions.stockItems=this.suggestions.purchasestockItems; }
        if(this.order.ordertype.name.toLowerCase().includes('sales')) { this.suggestions.stockItems=this.suggestions.salesstockItems; }
        
        this.setFoucus('custcode');
      } else if (this.activeId.includes('custcode')) {
        this.handleVoucherDateOnEnter();
        this.setFoucus('date');
      } else if (this.activeId.includes('biltydate')) {
        this.setFoucus('deliveryterms');
      } else if (this.activeId.includes('date')) {
        this.setFoucus('purchaseledger');
      } else if (this.activeId.includes('purchaseledger')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('ledger');
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
      } else if ((this.activeId.includes('billingaddress') && (this.order.ordertype.name.toLowerCase().includes('purchase'))) || this.activeId.includes('grnremarks')) {
        this.setFoucus('orderremarks');
      } else if (this.activeId.includes('billingaddress') && (this.order.ordertype.name.toLowerCase().includes('sales'))) {
        this.setFoucus('grnremarks');
      } else if (this.activeId.includes('orderremarks')) {
        //let index = activeId.split('-')[1];
        // console.log('stockitem'+'-'+index);
        this.setFoucus('stockitem' + '-' + 0);
      } else if (this.activeId.includes('stockitem')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('qty' + '-' + index);
      } else if (this.activeId.includes('qty')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('rate' + '-' + index);
      } else if (this.activeId.includes('rate')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('warehouse' + '-' + index);
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
        this.setFoucus('remarks' + '-' + index);
      } else if (this.activeId.includes('remarks')) {
        let index = parseInt(this.activeId.split('-')[1]);
        this.setFoucus('taxDetail' + '-' + index);
      }
    } else if (key.includes('arrow')) {
      //  this.allowBackspace = false;
      if (key.includes('arrowup') || key.includes('arrowdown')) {
        this.handleArrowUpDown(key);
        event.preventDefault();
      }
    }
  }

  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
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
    let date = dateArray[2];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[0];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    // console.log('Date: ', date + separator + month + separator + year);
    this.order.biltydate = year + separator + month + separator + date;
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
    let date = dateArray[2];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[0];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    // console.log('Date: ', date + separator + month + separator + year);
    this.order.date = year + separator + month + separator + date;
  }


  getPurchaseLedgers() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
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
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedgerAddress', params)
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
    } else if (this.activeId == 'ledger') {
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
      x_id: 0
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
      stockunit: stockItem.unit.id

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
    if (activeId == 'ordertype') this.autoSuggestion.data = this.suggestions.invoiceTypes;
    else if (activeId == 'purchaseledger') this.autoSuggestion.data = this.suggestions.purchaseLedgers;
    else if (activeId == 'ledger') this.autoSuggestion.data = this.suggestions.supplierLedgers;
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

  onSelect(suggestion, activeId){
    console.log('Suggestion: ', suggestion);
    if (activeId == 'ordertype') {
      this.order.ordertype.name = suggestion.name;
      this.order.ordertype.id = suggestion.id;
    } else if (activeId == 'ledger') {
      this.order.ledger.name = suggestion.name;
      this.order.ledger.id = suggestion.id;
      this.order.billingaddress = suggestion.address;
    } else if (activeId == 'purchaseledger') {
      this.order.purchaseledger.name = suggestion.name;
      this.order.purchaseledger.id = suggestion.id;
    } else if (activeId.includes('stockitem')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].stockitem.name = suggestion.name;
      this.order.amountDetails[index].stockitem.id = suggestion.id;
      this.order.amountDetails[index].stockunit.name = suggestion.stockname;
      this.order.amountDetails[index].stockunit.id = suggestion.stockunit_id;
        this.getStockAvailability(suggestion.id);

    } else if (activeId.includes('discountledger')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].discountledger.name = suggestion.name;
      this.order.amountDetails[index].discountledger.id = suggestion.id;
    } else if (activeId.includes('warehouse')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].warehouse.name = suggestion.name;
      this.order.amountDetails[index].warehouse.id = suggestion.id;
    }
  }

  findStockitem() {
  return this.totalitem;
  }

  getStockAvailability(stockid){
    let totalitem = 0;
    let params = {
      stockid: stockid
    };
   // this.common.loading++;
    this.api.post('Suggestion/GetStockItemAvailableQty', params)
      .subscribe(res => {
       // this.common.loading--;
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


}
