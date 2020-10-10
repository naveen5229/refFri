import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { AccountService } from '../../services/account.service';
import {AdvanceComponent } from '../../acounts-modals/advance/advance.component';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { FuelfilingComponent } from '../../acounts-modals/fuelfiling/fuelfiling.component';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { VoucherSummaryShortComponent } from '../../accounts-modals/voucher-summary-short/voucher-summary-short.component';
import { ServiceComponent } from '../service/service.component';
import * as localforage from 'localforage';


@Component({
  selector: 'bankbooks',
  templateUrl: './bankbooks.component.html',
  styleUrls: ['./bankbooks.component.scss']
})
export class BankbooksComponent implements OnInit {
  selectedName = '';
  flag=0;
  fuelFilings=[];
  VoucherEditTime=[];
  TripEditData=[];
  pendingDataEditTme=[];
  tripExpDriver=[];
  tripExpenseVoucherTrips=[];
  bankBook = {
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
    issumrise: 'true',
    isamount: 0,
    remarks: '',
    vouchercustcode: '',
    vouchercode: '',
    frmamount: 0,
    toamount: 0,

  };
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  ledgerData = [];
  activeId = 'ledger';
  selectedRow = -1;
  allowBackspace = true;


  f2Date = 'startdate';
  lastActiveId = '';
  showDateModal = false;
  activedateid = '';

  pages = {
    count: 0,
    active: 1,
    limit: 1000,
  };
  data = [];
  jrxPageTimer: any;
  filters = [
    { name: 'Date', key: 'y_date', search: '' },
    { name: 'Particular', key: 'y_ledger', search: '' },
    { name: 'Vch Type', key: 'y_type', search: '' },
    { name: 'Vch No.', key: 'y_cust_code', search: '' },
    { name: 'Amount(DR)', key: 'y_dramunt', search: '' },
    { name: 'Amount(CR)', key: 'y_cramunt', search: '' },
  ];
  jrxTimeout: any;
  searchedData = []; 

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    // this.getVoucherTypeList();
    this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate: this.bankBook.startdate;
    this.accountService.todate = (this.accountService.todate)? this.accountService.todate: this.bankBook.enddate;
   
    this.common.refresh = this.refresh.bind(this);

    this.getBranchList();
    this.getLedgers();
    this.setFoucus('ledger');
    this.common.currentPage = 'Bank Book';

    localforage.getItem('bank_book_ledgers')
      .then((ledgers: any) => {
        if (ledgers) this.ledgerData = ledgers;
        this.getLedgers(ledgers ? false : true);
      });
    localforage.getItem('bankbook_data')
      .then((dayBookData: any) => {
        if (dayBookData) {
          this.DayData = dayBookData;
          this.filterData();
        }
      });

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  refresh() {

    this.getBranchList();
    this.getLedgers();
    this.setFoucus('ledger');
    this.getBankBook();
  }


  // getVoucherTypeList() {
  //   let params = {
  //     search: 123
  //   };
  //   this.common.loading++;
  //   this.api.post('Suggestion/GetVouchertypeList', params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Res:', res['data']);
  //       this.vouchertypedata = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log('Error: ', err);
  //       this.common.showError();
  //     });
  // }
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
  pdfFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1 + remainingstring3;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','','Bank Book From :'+this.bankBook.startdate+' To :'+this.bankBook.enddate);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getCSVFromTableIdNew('table',foname,cityaddress,'','',remainingstring3);
      // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  // getAllLedger() {
  //   let params = {
  //     search: 123
  //   };
  //   this.common.loading++;
  //   this.api.post('Suggestion/GetAllLedger', params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Res:', res['data']);
  //       this.ledgerData = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log('Error: ', err);
  //       this.common.showError();
  //     });

  // }
  getLedgers(isLoader = true) {
    //this.showSuggestions = true;
    let url = 'Suggestion/GetLedger?transactionType=' + 'credit' + '&voucherId=' + (-1) + '&search=' + 'test';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledgerData = res['data'];
        console.log('ledger data new', this.ledgerData[0].y_ledger_id);
        localforage.setItem('bank_book_ledgers', this.ledgerData);
      }, err => {
        console.error(err);
        this.common.showError();
      });
    this.setFoucus('ref-code');
  }
    getBankBook() {
    console.log('Accounts:', this.bankBook);
    this.bankBook.startdate= this.accountService.fromdate;
    this.bankBook.enddate= this.accountService.todate;
    let params = {
      startdate: this.bankBook.startdate,
      enddate: this.bankBook.enddate,
      ledger: this.bankBook.ledger.id,
      branchId: this.bankBook.branch.id,
      isamount: this.bankBook.isamount,
      remarks: this.bankBook.remarks,
      vouchercustcode: this.bankBook.vouchercustcode,
      vouchercode: this.bankBook.vouchercode,
      frmamount: this.bankBook.frmamount,
      toamount: this.bankBook.toamount,
    };

    this.common.loading++;
    this.api.post('Company/GetBankBook', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
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
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.bankBook[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.bankBook[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.bankBook[type].name = selectedData[display];
    this.bankBook[type].id = selectedData.y_ledger_id;
    console.log('Selected Data: ', selectedData, type, display);
    console.log('order User: ', this.bankBook);
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.bankBook[datestring].includes('-')) {
      dateArray = this.bankBook[datestring].split('-');
    } else if (this.bankBook[datestring].includes('/')) {
      dateArray = this.bankBook[datestring].split('/');
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
    this.bankBook[datestring] = date + separator + month + separator + year;
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
  getBookDetail(voucherId,ytype,dataItem) {
    console.log('vouher id', voucherId,'ytype',ytype);
    if((ytype.toLowerCase().includes('purchase')) || (ytype.toLowerCase().includes('sales')) || (ytype.toLowerCase().includes('debit')) || (ytype.toLowerCase().includes('credit'))){
      this.common.params = {
        invoiceid: voucherId,
        delete: 0,
        newid: 0,
        ordertype: dataItem.y_vouchertype_id,
        isModal:true
      };
      const activeModal = this.modalService.open(ServiceComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
      activeModal.result.then(data => {
        console.log('Data: invoice ', data);
          if (data.msg) {
        }
      });
      // this.common.params = {
      //   invoiceid: voucherId,
      //   delete: 0,
      //   newid:0,
      //   ordertype:dataItem.y_vouchertype_id
      // };
      // const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //    console.log('Data: invoice ', data);
      //   if (data.delete) {
      //     console.log('open succesfull');
      //   }
      // });
      // this.common.params = {
      //   invoiceid: voucherId,
      //   delete: 0,
      //   indexlg:0
      // };
      // const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //   // console.log('Data: ', data);
      //   if (data.response) {
      //     console.log('open succesfull');
  
      //     // this.addLedger(data.ledger);
      //   }
      // });
    }else if(ytype.toLowerCase().includes('fuel')){
          this.openFuelEdit(dataItem);
    }  else if(dataItem.y_type.toLowerCase().includes('trip')){
      this.openConsignmentVoucherEdit(dataItem)
    } else{

      this.common.params = {
        voucherId: voucherId,
        delete: 0,
        addvoucherid: 0,
        voucherTypeId: dataItem.y_vouchertype_id,
      };
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        console.log('Data: ', data);
        if (data.delete) {
         // this.getDayBook();
        } 
        // this.common.showToast('Voucher updated');

      });
    // this.common.params={

    //   vchid :voucherId,
    //   vchcode:vouhercode
    // }
    // const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    // activeModal.result.then(data => {
    //   // console.log('Data: ', data);
    //   if (data.response) {
    //     return;
      
    //   }
    // });
  }
  this.common.currentPage = 'Bank Book';

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
  openFuelEdit(vchData){
    console.log('vch data new ##',vchData);
    let promises = [];
    console.log('testing issue solved');
    promises.push(this.getVocherEditTime(vchData['y_voucherid']));
    promises.push(this.getDataFuelFillingsEdit(vchData['y_vehicle_id'],vchData['y_refid'],vchData['y_voucherid']));

    Promise.all(promises).then(result => {
    this.common.params = {
      vehId: vchData['y_vehicle_id'],
      lastFilling: this.bankBook.startdate,
      currentFilling: this.bankBook.enddate,
      fuelstationid: vchData['y_refid'],
      fuelData:this.fuelFilings,
      voucherId:vchData['y_voucherid'],
      voucherData:this.VoucherEditTime,
      //vehname:this.trips[0].y_vehicle_name
    };

    const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
       console.log('Data return: ', data);
      if (data.success) {
     //   this.getDayBook();
      }
    });
  }).catch(err => {
    console.log(err);
    this.common.showError('There is some technical error occured. Please Try Again!');
  })
  }
  getDataFuelFillingsEdit(vehcleID,fuelStationId,vchrID) {
    return new Promise((resolve, reject) => {
    const params = {
      vehId: vehcleID,
      lastFilling: this.bankBook.startdate,
      currentFilling:this.bankBook.enddate,
      fuelstationid: fuelStationId,
      voucherId:vchrID
    };
    this.common.loading++;
    this.api.post('Fuel/getFeulfillings', params)
      .subscribe(res => {
      //  console.log('fuel data', res['data']);
        this.common.loading--;
        if(res['data'].length){
        this.fuelFilings = res['data'];
        resolve();
        }else {
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
  // getBookDetail(voucherId,vouhercode,dataitem) {
  //   console.log('vouher id', voucherId);
  //   this.common.params={

  //     vchid :voucherId,
  //     vchcode:vouhercode
  //   }

  //   const activeModal = this.modalService.open(VoucherdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
  //   activeModal.result.then(data => {
  //     // console.log('Data: ', data);
  //     if (data.response) {
  //       return;
      
  //     }
  //   });
  // }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
    if (key == 'enter' && !this.activeId && this.DayData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.DayData[this.selectedRow].y_ledger_id,this.DayData[this.selectedRow].y_type,this.DayData[this.selectedRow]);
      return;
    }
    // if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
    //   // document.getElementById("voucher-date").focus();
    //   // this.voucher.date = '';
    //   this.lastActiveId = this.activeId;
    //   this.setFoucus('voucher-date-f2', false);
    //   this.showDateModal = true;
    //   this.f2Date = this.activeId;
    //   this.activedateid = this.lastActiveId;
    //   return;
    // }
     else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      } else if (this.activeId.includes('startdate')) {
        this.bankBook.startdate = this.common.handleDateOnEnterNew(this.bankBook.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.bankBook.enddate = this.common.handleDateOnEnterNew(this.bankBook.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
      if (this.activeId == 'startdate') this.setFoucus('ledger');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    }else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.DayData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

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

  test(e) {
    console.log('--------: ', e);
  }
  addvance(){
    this.common.params = { 'isamount':this.bankBook.isamount,'remarks':this.bankBook.remarks,'vouchercustcode':this.bankBook.vouchercustcode,'vouchercode':this.bankBook.vouchercode,'frmamount':this.bankBook.frmamount,'toamount':this.bankBook.toamount };
    const activeModal = this.modalService.open(AdvanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
       console.log('Data: ', data);
      if (data.response) {
        this.bankBook.isamount=data.ledger.isamount;
        this.bankBook.remarks=data.ledger.remarks;
        this.bankBook.vouchercustcode=data.ledger.vouchercustcode;
        this.bankBook.vouchercode=data.ledger.vouchercode;
        this.bankBook.frmamount=data.ledger.frmamount;
        this.bankBook.toamount=data.ledger.toamount;
        if(data.ledger.toamount !=0 || data.ledger.frmamount !=0 ||data.ledger.vouchercode !='' ||data.ledger.vouchercustcode !='' ||data.ledger.remarks !='' ||data.ledger.isamount !=0){
          this.flag = 1;
        }else{
          this.flag = 0;
        }
      }
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
    let permanentDelete = 0;
    let showSubmit =1;


    if (voucherData.y_vouchertype_id == -151) {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete,showSubmit };


      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
         // this.getDayBook();
        }
      });
    } else {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete,showSubmit };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
        //  this.getDayBook();
        }
      });
    }
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
}