import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { VoucherSummaryShortComponent } from '../../accounts-modals/voucher-summary-short/voucher-summary-short.component';
import { StorerequisitionComponent } from '../../acounts-modals/storerequisition/storerequisition.component';
import { FuelfilingComponent } from '../../acounts-modals/fuelfiling/fuelfiling.component';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { ViewMVSFreightStatementComponent } from '../../modals/FreightRate/view-mvsfreight-statement/view-mvsfreight-statement.component';
import { AccountService } from '../../services/account.service';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { AdvanceComponent } from '../../acounts-modals/advance/advance.component';
import { ServiceComponent } from '../service/service.component';
import * as localforage from 'localforage';

@Component({
  selector: 'daybooks',
  templateUrl: './daybooks.component.html',
  styleUrls: ['./daybooks.component.scss']
})
export class DaybooksComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }
  selectedName = '';
  activedateid = '';
  fuelFilings = [];
  flag = 0;

  DayBook = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    branch: {
      name: 'All',
      id: 0
    },
    vouchertype: {
      name: 'All',
      id: 0
    },
    issumrise: 'true',
    isamount: 0,
    remarks: '',
    vouchercustcode: '',
    vouchercode: '',
    frmamount: 0,
    toamount: 0
  };

  lastActiveId = '';
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  ledgerData = [];
  activeId = 'vouchertype';
  selectedRow = -1;
  allowBackspace = true;
  deletedId = 0;
  f2Date = 'startdate';
  TripEditData = [];
  pendingDataEditTme = [];
  VoucherEditTime = [];
  tripExpDriver = [];
  tripExpenseVoucherTrips = [];

  pages = {
    count: 0,
    active: 1,
    limit: 1000,
  };
  data = [];
  jrxPageTimer: any;
  filters = [
    { name: 'Date', key: 'y_date', search: '' },
    { name: 'Particular', key: 'y_particulars', search: '' },
    { name: 'Vch Type', key: 'y_type', search: '' },
    { name: 'Vch No.', key: 'y_cust_code', search: '' },
    { name: 'Amount(Debit)', key: 'y_dramunt', search: '' },
    { name: 'Amount(Credit)', key: 'y_cramunt', search: '' },
  ];
  jrxTimeout: any;
  searchedData = [];

  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal,
    public accountService: AccountService, public router: Router) {
    this.pages.limit = this.accountService.perPage;
    this.common.refresh = this.refresh.bind(this);
    this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate : this.DayBook.startdate;
    this.accountService.todate = (this.accountService.todate) ? this.accountService.todate : this.DayBook.enddate;

    localforage.getItem('day_book_vouchers')
      .then((vouchers: any) => {
        if (vouchers) this.vouchertypedata = vouchers;
        this.getVoucherTypeList(vouchers ? false : true);
      });

    localforage.getItem('day_book_ledgers')
      .then((ledgers: any) => {
        if (ledgers) this.ledgerData = ledgers;
        this.getAllLedger(ledgers ? false : true);
      });

    localforage.getItem('daybook_data')
      .then((dayBookData: any) => {
        if (dayBookData) {
          this.DayData = dayBookData;
          this.filterData();
        }
      });

    this.setFoucus('vouchertype');

    this.route.params.subscribe(params => {
      if (params.id) {
        this.deletedId = parseInt(params.id);
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    this.common.currentPage = (this.deletedId == 0) ? 'Day Book' : 'Voucher & Invoice Deleted';
  }

  ngOnInit() {
  }

  refresh() {
    this.getVoucherTypeList();
    this.getBranchList();
    this.getAllLedger();
    this.setFoucus('vouchertype');
    this.getDayBook();
  }

  ngAfterViewInit() {
  }

  getVoucherTypeList(isLoader = true) {
    let params = {
      search: 123
    };
    isLoader && this.common.loading++;
    this.api.post('Suggestion/GetVouchertypeList', params)
      .subscribe(res => {
        isLoader && this.common.loading--;
        console.log('Res======:', res['data']);
        this.vouchertypedata = res['data'];
        this.vouchertypedata.push({ id: -1001, name: 'Stock Received' }, { id: -1002, name: 'Stock Transfer' }, { id: -1003, name: 'Stock Issue' }, { id: -1004, name: 'Stock Transfer Received' });
        localforage.setItem('day_book_vouchers', this.vouchertypedata);
      }, err => {
        isLoader && this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  openStoreQuestionEdit(editData) {
    this.common.params = {
      storeRequestId: (editData.y_vouchertype_id == -2) ? -3 : editData.y_vouchertype_id,
      stockQuestionId: editData.y_voucherid,
      stockQuestionBranchid: editData.y_fobranchid,
      pendingid: (editData.y_vouchertype_id == -2) ? 0 : 1,
    };
    const activeModal = this.modalService.open(StorerequisitionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      console.log('responce data return', data);
      if (data.response) {
        // this.getStoreQuestion();
      }
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
  openinvoicemodel(dataItem, invoiceid, ordertypeid, create = 0,) {
    console.log("DayBOOKS", dataItem);

    // console.log('welcome to invoice ');
    //  this.common.params = invoiceid;
    this.common.params = {
      invoiceid: invoiceid,
      delete: this.deletedId,
      newid: create,
      ordertype: ordertypeid
    };
    const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    //const activeModal = this.modalService.open(ServiceComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
    activeModal.result.then(data => {
      console.log('Data: invoice ', data);
      if (data.delete) {
        console.log('open succesfull');
        this.getDayBook();
        // this.addLedger(data.ledger);
      }
    });
  }

  openServiceSalesInvoicemodel(dataItem, invoiceid, ordertypeid, create = 0,) {
    this.common.params = {
      invoiceid: invoiceid,
      delete: this.deletedId,
      newid: create,
      ordertype: ordertypeid,
      isModal: true
    };
    const activeModal = this.modalService.open(ServiceComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
    activeModal.result.then(data => {
      if (data && data.msg) {
        this.getDayBook();
      }
    });
  }

  getAllLedger(isLoader = true) {
    let params = {
      search: 123
    };
    isLoader && this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        isLoader && this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        localforage.setItem('day_book_ledgers', this.ledgerData);
      }, err => {
        isLoader && this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getDayBook() {
    this.searchedData = [];
    this.DayBook.startdate = this.accountService.fromdate;
    this.DayBook.enddate = this.accountService.todate;
    let params = {
      startdate: this.DayBook.startdate,
      enddate: this.DayBook.enddate,
      ledger: this.DayBook.ledger.id,
      branchId: this.DayBook.branch.id,
      vouchertype: this.DayBook.vouchertype.id,
      delete: this.deletedId,
      forapproved: (this.deletedId == 1) ? -1 : 1,
      isamount: this.DayBook.isamount,
      remarks: this.DayBook.remarks,
      vouchercustcode: this.DayBook.vouchercustcode,
      vouchercode: this.DayBook.vouchercode,
      frmamount: this.DayBook.frmamount,
      toamount: this.DayBook.toamount,
    };

    this.common.loading++;
    this.api.post('Company/GetDayBook', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: length :', res['data'], res['data'].length);
        this.DayData = res['data'];
        this.filterData();
        if (this.DayData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  pdfFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1 + remainingstring3;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        this.common.getPDFFromTableIdnew('table', foname, cityaddress, '', '', 'Day Book From :' + this.DayBook.startdate + ' To :' + this.DayBook.enddate);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = (res['data'][0]) ? res['data'][0].addressline + '\n' : '';
        let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1;
        let foname = (res['data'][0]) ? res['data'][0].foname : '';
        this.common.getCSVFromTableIdNew('table', foname, cityaddress, '', '', remainingstring3);
        // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }


  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.DayBook[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.DayBook[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.DayBook[type].name = selectedData[display];
    this.DayBook[type].id = selectedData.id;
    console.log('Selected Data: ', selectedData, type, display);
    console.log('order User: ', this.DayBook);
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.DayBook[datestring].includes('-')) {
      dateArray = this.DayBook[datestring].split('-');
    } else if (this.DayBook[datestring].includes('/')) {
      dateArray = this.DayBook[datestring].split('/');
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
    this.DayBook[datestring] = date + separator + month + separator + year;
  }

  filterData() {
    let yCodes = [];
    this.DayData.map(dayData => {
      if (yCodes.indexOf(dayData.y_code) !== -1) {
        dayData.y_code = ' ';
        dayData.y_date = 0;
      }
    });

    this.pages.count = Math.floor(this.DayData.length / this.pages.limit);
    if (this.DayData.length % this.pages.limit) {
      this.pages.count++;
    }

    localforage.setItem('daybook_data', this.DayData);
    this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
  }

  getBookDetail(voucherId) {
    console.log('vouher id', voucherId);
    this.common.params = voucherId;

    const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;
        //   if (stocksubType) {

        //     this.updateStockSubType(stocksubType.id, data.stockSubType);
        //     return;
        //   }
        //  this.addStockSubType(data.stockSubType)
      }
    });
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;

    if (key === 'home' && (this.activeId.includes('ledgerdaybook'))) {
      let ledgerindex = this.lastActiveId.split('-')[1];
      if (this.DayBook.ledger.id != 0) {
        console.log('ledger value ------------', this.DayBook.ledger.id);
        this.openinvoicedetailmodel(this.DayBook.ledger.id);
      } else {
        this.common.showError('Please Select Correct Ledger');
      }

    }

    if ((event.ctrlKey && key === 'd') && (!this.activeId && this.DayData.length && this.selectedRow != -1)) {
      console.log('ctrl + d pressed');
      ((this.DayData[this.selectedRow].y_type.toLowerCase().includes('voucher')) ? (this.DayData[this.selectedRow].y_type.toLowerCase().includes('trip')) ? '' : this.openVoucherEdit(this.DayData[this.selectedRow].y_voucherid, 6, this.DayData[this.selectedRow].y_vouchertype_id) : (this.DayData[this.selectedRow].y_type.toLowerCase().includes('invoice')) ? this.openinvoicemodel(this.DayData[this.selectedRow].y_voucherid, this.DayData[this.selectedRow].y_vouchertype_id, 1) : '')
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('branch')) {
        this.setFoucus('vouchertype');
      } else if (this.activeId.includes('vouchertype')) {
        this.setFoucus('ledgerdaybook');
      } else if (this.activeId == 'ledgerdaybook') {
        this.setFoucus('startdate');
      } else if (this.activeId.includes('startdate')) {
        this.DayBook.startdate = this.common.handleDateOnEnterNew(this.DayBook.startdate);
        this.checkDate(this.DayBook.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.DayBook.enddate = this.common.handleDateOnEnterNew(this.DayBook.enddate);
        this.setFoucus('submit');
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
      if (this.activeId == 'startdate') this.setFoucus('ledgerdaybook');
      if (this.activeId == 'ledgerdaybook') this.setFoucus('vouchertype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }

    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.DayData.length) {
      // console.log('-Jai rana---');
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

    }
  }
  openinvoicedetailmodel(ledger) {
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
            sizeledger: 0
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
  checkDate(date) {
    // const dateSendingToServer = new DatePipe('en-US').transform(date, 'dd-MM-yyyy')
    // console.log(dateSendingToServer);
  }
  openVoucherEdit(voucherId, voucheradd, vchtypeid) {
    if (voucherId) {
      this.common.params = {
        voucherId: voucherId,
        delete: this.deletedId,
        addvoucherid: voucheradd,
        voucherTypeId: vchtypeid,
      };
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        console.log('Data: ', data);
        if (data.delete) {
          this.getDayBook();
        }
      });
    }
  }


  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      //element.target.select();    
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  test(e) {
    console.log('--------: ', e);
  }

  imageOpen(dataItem) {
    let images = [];
    console.log("dataItem:", dataItem);
    let params = {
      voucherid: dataItem.y_voucherid
    };
    this.common.loading++;
    this.api.post('Accounts/getvoucherdocs', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        let images = res['data'];

        this.common.params = { images, title: 'Image' };
        const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  openConsignmentVoucherEdit(voucherData) {
    const params = {
      vehId: 0,
      voucherid: voucherData.y_voucherid,
      isdate: 0
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        console.log('trip expence', res);
        this.common.loading--;
        this.getVoucherSummary(res['data'][0], voucherData);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getVoucherSummary(tripVoucher, voucherData) {
    let promises = [];
    promises.push(this.getPendingOnEditTrips(tripVoucher.y_vehicle_id));
    promises.push(this.getVocherEditTime(tripVoucher.y_voucher_id));
    promises.push(this.getPendingTripsEditTime(tripVoucher.y_id, tripVoucher.y_vehicle_id));

    if (voucherData.y_vouchertype_id == -151) {
      promises.push(this.getTripsExpDriver(tripVoucher.y_id));
    }

    promises.push(this.getTripExpenseVoucherTripsData(tripVoucher));

    Promise.all(promises).then(result => {
      this.showVoucherSummary(this.tripExpenseVoucherTrips, tripVoucher, voucherData);
    }).catch(err => {
      console.log(err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    });

  }

  getTripExpenseVoucherTripsData(tripVoucher) {
    return new Promise((resolve, reject) => {
      const params = {
        voucherId: tripVoucher.y_voucher_id,
        voucherDetail: tripVoucher
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripExpenseVoucherTripsData', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpenseVoucherTrips = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }


  showVoucherSummary(tripDetails, tripVoucher, voucherData) {
    let vehId = tripVoucher.y_vehicle_id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    let typeFlag = 1;
    let permanentDelete = this.deletedId;


    if (voucherData.y_vouchertype_id == -151) {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };


      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
          this.getDayBook();
        }
      });
    } else {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
          this.getDayBook();
        }
      });
    }
  }

  getPendingTripsEditTime(voucherid, vhicleId) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vhicleId,
        vchrid: voucherid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTripsEdit', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.pendingDataEditTme = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  getPendingOnEditTrips(vehicleid) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vehicleid
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTrips', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.TripEditData = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject(err);
        });
    });

  }

  getVocherEditTime(VoucherID) {
    return new Promise((resolve, reject) => {
      const params = {
        vchId: VoucherID
      };
      this.common.loading++;
      this.api.post('Voucher/getVoucherDetail', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.VoucherEditTime = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }

  getTripsExpDriver(tripvoucherid) {
    return new Promise((resolve, reject) => {
      const params = {
        tripVchrId: tripvoucherid
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/getTripsExpDriver', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.tripExpDriver = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }
  openFuelEdit(vchData) {
    console.log('vch data new ##', vchData);
    let promises = [];
    console.log('testing issue solved');
    promises.push(this.getVocherEditTime(vchData['y_voucherid']));
    promises.push(this.getDataFuelFillingsEdit(vchData['y_vehicle_id'], vchData['y_fuel_station_id'], vchData['y_voucherid']));

    Promise.all(promises).then(result => {
      this.common.params = {
        vehId: vchData['y_vehicle_id'],
        lastFilling: this.DayBook.startdate,
        currentFilling: this.DayBook.enddate,
        fuelstationid: vchData['y_fuel_station_id'],
        fuelData: this.fuelFilings,
        voucherId: vchData['y_voucherid'],
        voucherData: this.VoucherEditTime,
        //vehname:this.trips[0].y_vehicle_name
      };

      const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log('Data return: ', data);
        if (data.success) {
          this.getDayBook();
        }
      });
    }).catch(err => {
      console.log(err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    })
  }

  getDataFuelFillingsEdit(vehcleID, fuelStationId, vchrID) {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: vehcleID,
        lastFilling: this.DayBook.startdate,
        currentFilling: this.DayBook.enddate,
        fuelstationid: fuelStationId,
        voucherId: vchrID
      };
      this.common.loading++;
      this.api.post('Fuel/getFeulfillings', params)
        .subscribe(res => {
          //  console.log('fuel data', res['data']);
          this.common.loading--;
          if (res['data'].length) {
            this.fuelFilings = res['data'];
            resolve();
          } else {
            this.common.showError('please Select Correct date');
          }
          // this.getHeads();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })

  }
  editTransfer(transferId?) {
    if (transferId) {
      let refData = {
        transferId: transferId,
        readOnly: true
      }
      this.common.params = { refData: refData };
      const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
      activeModal.result.then(data => {
        console.log('Date:', data);
        //  this.viewTransfer();
      });
    } else {
      this.common.showError('Please Select another entry');
    }
  }

  openfreight(freightId) {
    if (freightId) {
      let invoice = {
        id: freightId,
      }
      this.common.params = { invoice: invoice }
      const activeModal = this.modalService.open(ViewMVSFreightStatementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
      activeModal.result.then(data => {
        console.log('Date:', data);

      });
    } else {
      this.common.showError('Please Select another Entry');
    }
  }

  openRevenue(freightId) {
    if (freightId) {
      let previewData = {
        title: 'Invoice',
        previewId: null,
        refId: freightId,
        refType: "FRINV"
      }
      this.common.params = { previewData };

      // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
      const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

      activeModal.result.then(data => {
        console.log('Date:', data);
      });

    } else {
      this.common.showError('Please Select another Entry');
    }
  }

  addvance() {
    this.common.params = { 'isamount': this.DayBook.isamount, 'remarks': this.DayBook.remarks, 'vouchercustcode': this.DayBook.vouchercustcode, 'vouchercode': this.DayBook.vouchercode, 'frmamount': this.DayBook.frmamount, 'toamount': this.DayBook.toamount };
    const activeModal = this.modalService.open(AdvanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data: ', data);
      if (data.response) {
        this.DayBook.isamount = data.ledger.isamount;
        this.DayBook.remarks = data.ledger.remarks;
        this.DayBook.vouchercustcode = data.ledger.vouchercustcode;
        this.DayBook.vouchercode = data.ledger.vouchercode;
        this.DayBook.frmamount = data.ledger.frmamount;
        this.DayBook.toamount = data.ledger.toamount;
        if (data.ledger.toamount != 0 || data.ledger.frmamount != 0 || data.ledger.vouchercode != '' || data.ledger.vouchercustcode != '' || data.ledger.remarks != '' || data.ledger.isamount != 0) {
          this.flag = 1;
        } else {
          this.flag = 0;
        }
      }
    });
  }

  jrxPagination(page, data?) {
    this.pages.active = page;
    let startIndex = this.pages.limit * (this.pages.active - 1);
    let lastIndex = (this.pages.limit * this.pages.active);
    this.data = data ? data.slice(startIndex, lastIndex) : this.searchedData.length ? this.searchedData.slice(startIndex, lastIndex) : this.DayData.slice(startIndex, lastIndex);
  }

  jrxPageLimitReset() {
    this.jrxPageTimer = setTimeout(() => {
      if (typeof this.pages.limit === 'string') {
        this.pages.limit = parseInt(this.pages.limit) || 0;
      }

      if (!this.pages.limit || this.pages.limit < 100) {
        this.pages.limit = this.accountService.perPage;
        this.common.showError('Minimum per page limit 100');
        return;
      }

      this.pages.count = Math.floor(this.DayData.length / this.pages.limit);
      if (this.DayData.length % this.pages.limit) {
        this.pages.count++;
      }

      this.accountService.perPage = this.pages.limit;
      localStorage.setItem('per_page', this.accountService.perPage.toString());
      this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
    }, 500);
  }

  jrxSearch(filter) {
    clearTimeout(this.jrxTimeout);
    this.jrxTimeout = setTimeout(() => {
      this.searchedData = [];
      if (filter.search) {
        for (let i = 0; i < this.DayData.length; i++) {
          if (this.DayData[i][filter.key]) {
            if ((filter.key === 'y_date' && this.common.changeDateformat(this.DayData[i][filter.key], 'dd-MMM-yy').toLowerCase().includes(filter.search.toLowerCase())) || this.DayData[i][filter.key].toLowerCase().includes(filter.search.toLowerCase())) {
              this.searchedData.push(this.DayData[i]);
            }
          }
        }

        this.pages.count = Math.floor(this.searchedData.length / this.pages.limit);
        if (this.DayData.length % this.pages.limit) this.pages.count++;
        this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count, this.searchedData);

      } else {
        this.searchedData = [];
        this.pages.count = Math.floor(this.DayData.length / this.pages.limit);
        if (this.DayData.length % this.pages.limit) this.pages.count++;
        this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
      }

    }, 500);
  }

  jrxDblClick(dataItem) {
    if (dataItem.y_type.toLowerCase().includes('voucher')) {
      if (dataItem.y_type.toLowerCase().includes('trip')) {
        this.openConsignmentVoucherEdit(dataItem);
      } else if (dataItem.y_type.toLowerCase().includes('fuel')) {
        this.openFuelEdit(dataItem)
      } else if (dataItem.y_type.toLowerCase().includes('lr')) {
        this.editTransfer(dataItem['y_transferid'])
      } else {
        this.openVoucherEdit(dataItem.y_voucherid, 0, dataItem.y_vouchertype_id)
      }
    } else if (dataItem.y_type.toLowerCase().includes('freight')) {
      if (dataItem.y_type.toLowerCase().includes('expense')) {
        this.openfreight(dataItem['y_transferid'])
      } else {
        this.openRevenue(dataItem['y_transferid'])
      }
    } else if (dataItem.y_type.toLowerCase().includes('stock')) {
      this.openStoreQuestionEdit(dataItem)
    } else if (dataItem.y_type.toLowerCase().includes('wastage')) {
      this.openinvoicemodel(dataItem, dataItem.y_voucherid, dataItem.y_vouchertype_id)
    } else {
      this.openServiceSalesInvoicemodel(dataItem, dataItem.y_voucherid, dataItem.y_vouchertype_id)
    }
    this.common.currentPage = (this.deletedId == 0) ? 'Day Book' : 'Voucher & Invoice Deleted';
    // (dataItem.y_type.toLowerCase().includes('voucher'))
    //   ? (dataItem.y_type.toLowerCase().includes('trip'))
    //     ? this.openConsignmentVoucherEdit(dataItem)
    //     : (dataItem.y_type.toLowerCase().includes('fuel'))
    //       ? this.openFuelEdit(dataItem)
    //       : (dataItem.y_type.toLowerCase().includes('lr'))
    //         ? this.editTransfer(dataItem['y_transferid'])
    //         : this.openVoucherEdit(dataItem.y_voucherid, 0, dataItem.y_vouchertype_id)
    //   : (dataItem.y_type.toLowerCase().includes('freight'))
    //     ? (dataItem.y_type.toLowerCase().includes('expense'))
    //       ? this.openfreight(dataItem['y_transferid'])
    //       : this.openRevenue(dataItem['y_transferid'])
    //     : (dataItem.y_type.toLowerCase().includes('stock'))
    //       ? this.openStoreQuestionEdit(dataItem)
    //       : (dataItem.y_type.toLowerCase().includes('wastage'))
    //         ? this.openinvoicemodel(dataItem, dataItem.y_voucherid, dataItem.y_vouchertype_id)
    //         : this.openServiceSalesInvoicemodel(dataItem, dataItem.y_voucherid, dataItem.y_vouchertype_id)
  }
}
