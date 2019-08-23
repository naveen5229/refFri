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


@Component({
  selector: 'orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  showConfirm = false;
  deletedId = 0;
  branchdata = [];
  orderTypeData = [];
  supplier = [];
  ledgers = { all: [], suggestions: [] };
  showSuggestions = false;
  activeLedgerIndex = -1;
  totalitem = 0;
  invoiceDetail = [];
  taxDetailData = [];
  order = {
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

  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private printService: PrintService,
    public pdfService: PdfService) {
    console.log('index lg',this.common.params);

    this.getBranchList();
    this.getInvoiceTypes();
    this.getPurchaseLedgers();
    this.getSupplierLedgers();
    this.getStockItems('sales');
    this.getStockItems('purchase');
    this.getWarehouses();
   // this.setFoucus('ordertype');
    this.getInvoiceDetail();
    // this.common.currentPage = 'Invoice';
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', this.common.params.indexlg);
    // console.log("open data ",this.invoiceDetail[]);

  }

  ngOnInit() {
  }


  getInvoiceDetail() {
    let params = {
      invoiceId: this.common.params.invoiceid
    };
    console.log('vcid', this.common.params);

    this.api.post('Company/getInvoiceDetail', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log('Res:', res['data']);
        this.invoiceDetail = res['data']['invoice'];
        this.taxDetailData = res['data']['taxdetail'];
        console.log('Invoice detail', this.invoiceDetail[0]['y_biltynumber']);
        console.log('Tax Detail', this.taxDetailData);
        this.deletedId = this.common.params.delete;
        this.order.orderid = this.common.params.invoiceid;
        this.order.biltynumber = this.invoiceDetail[0].y_biltynumber;
        this.order.date = this.common.dateFormatternew(this.invoiceDetail[0].y_orderdate.split(' ')[0]);
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
                taxrate: taxdetail.y_rate,
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
    // this.showConfirm = false;
    this.activeModal.close({});
    event.preventDefault();
    return;
  }
  setInvoice() {
    return {
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
        console.log('Res:', res['data']);
        if (type == 'sales') { this.suggestions.salesstockItems = res['data']; }
        if (type == 'purchase') { this.suggestions.purchasestockItems = res['data']; }
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
   // this.common.handleModalSize('class', 'modal-lg', '1150', 'px', 1);
    this.common.params = {
      taxDetail: JSON.parse(JSON.stringify(this.order.amountDetails[i].taxDetails)),
      amount: this.order.amountDetails[i].amount
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
    console.log('new order', order.orderid);
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
      x_id: order.orderid,
      delete: order.delete,
      ledgeraddressid: order.ledgeraddressid,

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

    console.log('Active Id', this.activeId);
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
        console.log('order type', this.order.ordertype.name);
        if (this.order.ordertype.name.toLowerCase().includes('purchase')) { this.suggestions.stockItems = this.suggestions.purchasestockItems; }
        if (this.order.ordertype.name.toLowerCase().includes('sales')) { this.suggestions.stockItems = this.suggestions.salesstockItems; }

        this.setFoucus('custcode');
      } else if (this.activeId.includes('custcode')) {
        this.handleVoucherDateOnEnter();
        this.setFoucus('date');
      } else if (this.activeId.includes('biltydate')) {
        this.setFoucus('deliveryterms');
      } else if (this.activeId.includes('date')) {
        this.setFoucus('purchaseledger');
      }  else if (this.activeId.includes('ledger')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('vendorbidref');
      }else if (this.activeId.includes('purchaseledger')) {
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
     console.log('Search id ======: ', search, this.activeId);
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
      if(suggestion.address_count >1){
        this.getAddressByLedgerId(suggestion.id);
        }else{
        this.order.billingaddress = suggestion.address;
        }

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
  //  this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 1);
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
      taxsubtype: ledger.taxsubtype
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
      calculationtype: stockItem.calculationtype

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

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'ordertype') {
      this.order.ordertype.name = suggestion.name;
      this.order.ordertype.id = suggestion.id;
    } else if (activeId == 'ledger') {
      this.order.ledger.name = suggestion.name;
      this.order.ledger.id = suggestion.id;
      // this.order.billingaddress = suggestion.address;
      this.getAddressByLedgerId(suggestion.id);
    } else if (activeId == 'purchaseledger') {
      this.order.purchaseledger.name = suggestion.name;
      this.order.purchaseledger.id = suggestion.id;

    } else if (activeId.includes('stockitem')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].stockitem.name = suggestion.name;
      this.order.amountDetails[index].stockitem.id = suggestion.id;
      this.order.amountDetails[index].stockunit.name = suggestion.stockname;
      this.order.amountDetails[index].stockunit.id = suggestion.stockunit_id;


    } else if (activeId.includes('discountledger')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].discountledger.name = suggestion.name;
      this.order.amountDetails[index].discountledger.id = suggestion.id;
    } else if (activeId.includes('warehouse')) {
      const index = parseInt(activeId.split('-')[1]);
      this.order.amountDetails[index].warehouse.name = suggestion.name;
      this.order.amountDetails[index].warehouse.id = suggestion.id;
      this.getStockAvailability(suggestion.id);
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
          this.activeModal.close({ response: true, ledger: this.order });
          this.common.loading--;
        }
      });
    }
  }

  getStockAvailability(stockid) {
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
              this.activeModal.close({ response: true, ledger: this.order });
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

  getAddressByLedgerId(id){
    let params = {
      ledgerid: id
    };
    // this.common.loading++;
    this.api.post('Accounts/GetAddressByLedgerId', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log('Res ledger<<<<<<<<<<<<:', res['data']);
        if(res['data'].length>1){
          this.showAddpopup(res['data']);

        }else{
          this.order.billingaddress=res['data'][0]['address'];
        this.order.ledgeraddressid=res['data'][0]['id'];

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
   // this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 1);
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
  print(voucherdataprint, companydata) {

    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;
    let rows = [];
    let totalqty=0;
    let totalamount=0;
    let lasttotaltax=0;
    let lineamounttotal=0;

    voucherdataprint.amountDetails.map((invoiceDetail, index) => {
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
        { txt:  (index==0)?invoiceDetail.warehouse.name: (voucherdataprint.amountDetails[index-1].warehouse.id  == invoiceDetail.warehouse.id)? '':invoiceDetail.warehouse.name || '' },
        { txt: invoiceDetail.stockitem.name +'('+invoiceDetail.stockunit.name +')'+'</br>'+lasttaxrowdata || '' },
        { txt: invoiceDetail.qty || '' },
        { txt: invoiceDetail.rate || '' },
        { txt: invoiceDetail.amount || '' },
        { txt: taxTotal || 0 },
        { txt: invoiceDetail.lineamount || '' },
        { txt: invoiceDetail.remarks || '' }
      ]);
      rows.push([
        { txt: '' },
        { txt: 'Total' },
        { txt: totalqty || '' },
        { txt: '-' },
        { txt: totalamount || '' },
        { txt: lasttotaltax || 0 },
        { txt: lineamounttotal || '' },
        { txt: '' }
      ]);
      console.log('invoiceDetail.taxDetails',invoiceDetail.taxDetails);
     
      // this.order.totalamount += parseInt(invoiceDetail.y_dtl_lineamount);

    });
let invoiceJson={};
    if(voucherdataprint.ordertype.name.toLowerCase().includes('purchase') || voucherdataprint.ordertype.name.toLowerCase().includes('debit note')){
     invoiceJson = {
      headers: [
        { txt: companydata[0].foname, size: '22px', weight: 'bold' },
        { txt: companydata[0].addressline },
        { txt: cityaddress },
        { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
      ],
     
      details: [
     
        { name: 'Invoice No', value: voucherdataprint.custcode },
        { name: 'Invoice Date', value: voucherdataprint.date },
        { name: 'Purchase Ledger', value: voucherdataprint.purchaseledger.name },
        { name: 'Supplier Ledger', value: voucherdataprint.ledger.name },
        { name: 'Supplier Ref. No', value: voucherdataprint.vendorbidref },
        { name: 'P.O.No.', value: voucherdataprint.qutationrefrence },
        { name: 'Shipment Location', value: voucherdataprint.shipmentlocation },
        { name: 'Payment Terms', value: voucherdataprint.paymentterms },
        { name: 'Bilty Number', value: voucherdataprint.biltynumber },
        { name: 'Bilty Date', value: voucherdataprint.biltydate },
        { name: 'Dilivery Terms', value: voucherdataprint.deliveryterms },
        { name: 'Billing Address', value: voucherdataprint.billingaddress },
        { name: 'Invoice Remarks', value: voucherdataprint.orderremarks }
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
        center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(),'ddMMYYYY').split(' ')[0] },
        right: { name: 'Page No', value: 1 },
      }


    };
  }
  if(voucherdataprint.ordertype.name.toLowerCase().includes('wastage')){
    invoiceJson = {
     headers: [
       { txt: companydata[0].foname, size: '22px', weight: 'bold' },
       { txt: companydata[0].addressline },
       { txt: cityaddress },
       { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
     ],
    
     details: [
    
       { name: 'Invoice No', value: voucherdataprint.custcode },
       { name: 'Invoice Date', value: voucherdataprint.date },
       { name: 'Purchase Ledger', value: voucherdataprint.purchaseledger.name },
     ],
     table: {
       headings: [
         { txt: 'Ware House' },
         { txt: 'Item' },
         { txt: 'Quantity' }
     
       ],
       rows: rows
     },
     signatures: ['Accountant', 'Approved By'],
     footer: {
       left: { name: 'Powered By', value: 'Elogist Solutions' },
       center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(),'ddMMYYYY').split(' ')[0] },
       right: { name: 'Page No', value: 1 },
     }


   };
 }
  if(voucherdataprint.ordertype.name.toLowerCase().includes('sales') || voucherdataprint.ordertype.name.toLowerCase().includes('credit note')){
    invoiceJson = {
     headers: [
       { txt: companydata[0].foname, size: '22px', weight: 'bold' },
       { txt: companydata[0].addressline },
       { txt: cityaddress },
       { txt: this.order.ordertype.name, size: '20px', weight: 600, align: 'left' }
     ],
    
     details: [
    
       { name: 'Invoice No', value: voucherdataprint.custcode },
       { name: 'Invoice Date', value: voucherdataprint.date },
       { name: 'Sales Ledger', value: voucherdataprint.purchaseledger.name },
       { name: 'Party Name', value: voucherdataprint.ledger.name },
       { name: 'Order No', value: voucherdataprint.vendorbidref },
       { name: 'Other Reference', value: voucherdataprint.qutationrefrence },
       { name: 'Shipment Location', value: voucherdataprint.shipmentlocation },
       { name: 'Payment Terms', value: voucherdataprint.paymentterms },
       { name: 'Eway Bill Number', value: voucherdataprint.biltynumber },
       { name: 'Eway Bill Date', value: voucherdataprint.biltydate },
       { name: 'Dilivery Terms', value: voucherdataprint.deliveryterms },
       { name: 'Billing Address', value: voucherdataprint.billingaddress },
       { name: 'Consignee Address', value: voucherdataprint.grnremarks },
       { name: 'Invoice Remarks', value: voucherdataprint.orderremarks }
     ],
     table: {
       headings: [
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
       center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(),'ddMMYYYY').split(' ')[0] },
       right: { name: 'Page No', value: 1 },
     }


   };
 }

    console.log('JSON', invoiceJson);

    localStorage.setItem('InvoiceJSO', JSON.stringify(invoiceJson));
    this.printService.printInvoice(invoiceJson, 1);

  }
}
