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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { VoucherSummaryShortComponent } from '../../accounts-modals/voucher-summary-short/voucher-summary-short.component';
import { promise } from 'selenium-webdriver';
import { FuelfilingComponent } from '../../acounts-modals/fuelfiling/fuelfiling.component';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { ViewMVSFreightStatementComponent } from '../../modals/FreightRate/view-mvsfreight-statement/view-mvsfreight-statement.component';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'daybook',
  templateUrl: './daybook.component.html',
  styleUrls: ['./daybook.component.scss']
})
export class DaybookComponent implements OnInit {
  selectedName = '';
  activedateid = '';
  tripExpenseVoucherTrips=[];
  TripEditData=[];
  VoucherEditTime=[];
  pendingDataEditTme=[];
  tripExpDriver=[];
  fuelFilings=[];
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
    toamount: 0,

  };
  lastActiveId = '';
  showDateModal = false;
  vouchertypedata = [];
  branchdata = [];
  DayData = [];
  ledgerData = [];
  activeId = 'vouchertype';
  selectedRow = -1;
  allowBackspace = true;
  deletedId = 0;
  f2Date = 'startdate';
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal,
    public accountService: AccountService,
    public router: Router) {
    this.common.refresh = this.refresh.bind(this);
    // this.getVoucherTypeList();
    //  this.getBranchList();
    // this.getAllLedger();
    // this.setFoucus('vouchertype');
    this.common.currentPage = 'Day Book';

    console.log('Params1: ', this.common.params);
    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);
      this.DayBook = {
        enddate: this.common.params.enddate,
        startdate: this.common.params.startdate,
        ledger: {
          name: 'All',
          id: this.common.params.ledger
        },
        branch: {
          name: 'All',
          id: 0
        },
        vouchertype: {
          name: 'All',
          id: this.common.params.vouchertype
        },
        issumrise: 'true',
        isamount: 0,
        remarks: '',
        vouchercustcode: '',
        vouchercode: '',
        frmamount: 0,
        toamount: 0,
      }
      this.deletedId =this.common.params.deleteId;
      this.getDayBook();
    }
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);
  }

  ngOnInit() {
  }
  refresh() {
    this.getVoucherTypeList();
    this.getBranchList();
    this.getAllLedger();
    this.setFoucus('vouchertype');
  }

  ngAfterViewInit() {

  }

  getVoucherTypeList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetVouchertypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res-----______:', res['data']);
      
        this.vouchertypedata = res['data'];
        this.vouchertypedata.push({id:-1001,name:'Stock Received'},{id:-1002,name:'Stock Transfer'},{id:-1003,name:'Stock Issue'},{id:-1004,name:'Stock Transfer Received'});
        console.log('res type list',this.vouchertypedata);
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
  openinvoicemodel(invoiceid,ordertypeid) {
    // console.log('welcome to invoice ');
    //  this.common.params = invoiceid;
    this.common.params = {
      invoiceid: invoiceid,
      delete: this.deletedId,
      sizeIndex:1,
      ordertype:ordertypeid
    };
    const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.delete) {
        console.log('open succesfull');

        // this.addLedger(data.ledger);
      }
    });
  }

  getAllLedger() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getDayBook() {
    console.log('Accounts:', this.DayBook);
    let params = {
      startdate: this.DayBook.startdate,
      enddate: this.DayBook.enddate,
      ledger: this.DayBook.ledger.id,
      branchId: this.DayBook.branch.id,
      vouchertype: this.DayBook.vouchertype.id,
      delete: 0,
      forapproved: (this.deletedId == 1) ? 0 : 1,
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
    console.log('Active event', event, this.activeId);
    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.DayData.length) {
      /************************ Handle Table Rows Selection ********************** */
      console.log('hello',key);
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

    }
    else if (key == 'enter' && !this.activeId && this.DayData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.DayData[this.selectedRow].y_voucherid);
      return;
    }
    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.activeId;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
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
      if (this.activeId.includes('branch')) {
        this.setFoucus('vouchertype');
      } else if (this.activeId.includes('vouchertype')) {
        this.setFoucus('ledger');
      } else if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      } else if (this.activeId.includes('startdate')) {
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
      if (this.activeId == 'startdate') this.setFoucus('ledger');
      if (this.activeId == 'ledger') this.setFoucus('vouchertype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    // else if ((key.includes('arrowup') || key.includes('arrowdown')) && this.DayData.length) {
    //   /************************ Handle Table Rows Selection ********************** */
    //   console.log('hello',key);
    //   if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
    //   else if (this.selectedRow != this.DayData.length - 1) this.selectedRow++;

    // }
  }


  openVoucherEdit(voucherId, voucheradd, vchtypeid) {
    console.log('ledger123', voucherId);
    if (voucherId) {
      this.common.params = {
        voucherId: voucherId,
        delete: this.deletedId,
        sizeIndex:1,
        addvoucherid: voucheradd,
        voucherTypeId: vchtypeid,
      };
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if(data.delete)
        {
          this.getDayBook();
        }
       
        //this.common.showToast('Voucher updated');

      });
    }
  }
  // getDataFuelFillings() {
  //   console.log('params model', this.common.params);
  //   let fuelstatinid = (this.selectedVehicle) ? this.selectedVehicle.id : 0;
  //   const params = {
  //     vehId: (this.selectedVehicle) ? this.selectedVehicle.id : 0,
  //     lastFilling: this.DayBook.startdate,
  //     currentFilling:this.DayBook.enddate,
  //     fuelstationid: (this.selectedFuelFilling) ? this.selectedFuelFilling.id : 0
  //   };
  //   this.common.loading++;
  //   this.api.post('Fuel/getFeulfillings', params)
  //     .subscribe(res => {
  //       console.log('fuel data', res['data']);
  //       this.common.loading--;
  //       if(res['data'].length){
  //       return res['data'];
  //       }else {
  //         this.common.showError('please Select Correct date or vehicle');
  //       }
  //       // this.getHeads();
  //     }, err => {
  //       console.log(err);
  //       this.common.loading--;
  //       this.common.showError();
  //     });
  // }
  openFuelVoucherEdit(fueldata){
console.log('fuel data 111',fueldata);
      // this.common.params = {
      //   vehId: this.selectedVehicle.id,
      //   lastFilling: this.startdate,
      //   currentFilling: this.enddate,
      //   fuelstationid: this.selectedFuelFilling,
      //   fuelData:this.getDataFuelFillings()
      // };

      // const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //    console.log('Data return: ', data);
        
      // });  
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

  modelCondition() {
    // this.showConfirm = false;
    this.activeModal.close({ response: true });
    event.preventDefault();
    return;
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

  showVoucherSummary(tripDetails, tripVoucher, voucherData) {
    let vehId = tripVoucher.y_vehicle_id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    let typeFlag = 1;
    let permanentDelete = 0;//this.deletedId
    let sizeIndex = 1;
    

    if (voucherData.y_vouchertype_id == -151) {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete,sizeIndex };


      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
          this.getDayBook();
        }
      });
    } else {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete ,sizeIndex};
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.delete) {
          this.getDayBook();
        }
      });
    }
  }
  openFuelEdit(vchData){
    console.log('vch data new ##',vchData);
    let promises = [];
    console.log('testing issue solved');
    promises.push(this.getVocherEditTime(vchData['y_voucherid']));
    promises.push(this.getDataFuelFillingsEdit(vchData['y_vehicle_id'],vchData['y_fuel_station_id'],vchData['y_voucherid']));

    Promise.all(promises).then(result => {
    this.common.params = {
      vehId: vchData['y_vehicle_id'],
      lastFilling: this.DayBook.startdate,
      currentFilling: this.DayBook.enddate,
      fuelstationid: vchData['y_fuel_station_id'],
      fuelData:this.fuelFilings,
      voucherId:vchData['y_voucherid'],
      voucherData:this.VoucherEditTime,
      sizeIndex:1
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

  getDataFuelFillingsEdit(vehcleID,fuelStationId,vchrID) {
    return new Promise((resolve, reject) => {
    const params = {
      vehId: vehcleID,
      lastFilling: this.DayBook.startdate,
      currentFilling:this.DayBook.enddate,
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
  editTransfer(transferId?) {
    if(transferId){
    let refData = {
      transferId:transferId,
      readOnly:true
    }
    this.common.params = { refData: refData };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    //  this.viewTransfer();
    });
  }else{
    this.common.showError('Please Select another entry');
  }
}

openfreight(freightId){
  if(freightId){
  let invoice = {
    id: freightId,
  }

  this.common.params = { invoice: invoice ,freightIndex:1}
  const activeModal = this.modalService.open(ViewMVSFreightStatementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
  activeModal.result.then(data => {
    console.log('Date:', data);

  });
}else{
  this.common.showError('Please Select another Entry');
}
}

openRevenue(freightId){
  if(freightId){
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

    }else{
      this.common.showError('Please Select another Entry');
    }
}
}

