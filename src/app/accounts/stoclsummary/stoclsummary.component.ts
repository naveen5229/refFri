import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { CsvService } from '../../services/csv/csv.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderdetailComponent } from '../../acounts-modals/orderdetail/orderdetail.component';
import { TripdetailComponent } from '../../acounts-modals/tripdetail/tripdetail.component';

@Component({
  selector: 'stoclsummary',
  templateUrl: './stoclsummary.component.html',
  styleUrls: ['./stoclsummary.component.scss']
})
export class StoclsummaryComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];
  summaryreport = [];
  activedateid = '';
  selectedName = '';
  outStanding = {
    Date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    stockType: {
      name: 'All',
      id: 0
    },
    stockSubType: {
      name: 'All',
      id: 0
    },
    stockItem: {
      name: 'All',
      id: 0
    },
    wherehouse: {
      name: 'All',
      id: 0
    },
  };

  active = {
    liabilities: {
      mainGroup: [],
      subGroup: [],
      branch: [],
      warehouse: [],
    }
  };

  StockTypeData = [];
  StockSubTypeData = [];
  StockIemData = [];
  StockWhereHouseData = [];
  ledgerData = [];
  voucherEntries = [];
  ledgerList = [];
  activeId = 'ledger';
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  lastActiveId = '';
  headingName = '';
  selectedRow = -1;
  viewType = 'sub';
  TripEditData = [];
  VoucherEditTime = [];
  pendingDataEditTme = [];
  tripExpDriver = [];
  tripExpenseVoucherTrips = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getStockTypeList();
    this.getWhereHouseList();
    this.setFoucus('stocktype');
    this.common.currentPage = 'Stock Summary Report';
  }

  activeGroup = [];

  ngOnInit() {
  }
  refresh() {
    this.getStockTypeList();
    this.getWhereHouseList();
    this.setFoucus('ledger');
  }

  getStockTypeList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetTypeOfStock', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockTypeData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getWhereHouseList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.get('Suggestion/GetWareHouse?search=123')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockWhereHouseData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getStockSubtype(id) {
    let params = {
      stocktype: id
    };
    this.common.loading++;
    this.api.post('Suggestion/GetSearchStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockSubTypeData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getStockItem(id) {
    let params = {
      stocksubtype: id
    };
    this.common.loading++;
    this.api.post('Suggestion/GetStockItemData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.StockIemData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getStockSummary() {
    console.log('Ledger:', this.outStanding);
    let params = {
      data: this.outStanding,

    };

    this.common.loading++;
    this.api.post('Company/GetStockSummary', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        this.generalizeData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.outStanding[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.outStanding[date]);
    });
  }

  openVoucherDetail(voucherId, vouhercode) {
    console.log('vouher id', voucherId);
    this.common.params = {

      vchid: voucherId,
      vchcode: vouhercode
    }
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
  openinvoicemodel(voucherId) {
    this.common.params = {
      invoiceid: voucherId,
      delete: 0,
      indexlg: 0
    };
    const activeModal = this.modalService.open(OrderdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        console.log('open succesfull');

        // this.addLedger(data.ledger);
      }
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
        // this.common.getPDFFromTableIdnew('table', foname, cityaddress, '', '', 'Out Standing From :' + this.outStanding.startDate + ' To :' + this.outStanding.endDate);

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
  onSelected(selectedData, type, display) {

    this.outStanding[type].name = selectedData[display];
    this.outStanding[type].id = selectedData.id;
    if (type == 'stockType') {
      this.getStockSubtype(selectedData.id);
    }
    if (type == 'stockSubType') {
      this.getStockItem(selectedData.id);
    }

    // console.log('order User: ', this.DayBook);
  }


  filterData(dayDatas) {
    let yCodes = [];
    // dayDatas.map(dayData => {
    //   if (yCodes.indexOf(dayData.y_particulars) !== -1) {
    //     dayData.y_particulars = 0;
    //   } else {
    //     yCodes.push(dayData.y_particulars);
    //   }
    // });
    return dayDatas;
  }

  generalizeData() {
    this.summaryreport = this.generateGroup(this.ledgerData, 'y_stockitem_type_name')
      .map(group => {
        group.data = this.generateGroup(group.data, 'y_stockitem_subtype_name')
          .map(group => {
            group.data = this.generateGroup(group.data, 'y_stockitem_name')
              .map(group => {
                group.data = this.generateGroup(group.data, 'y_fobranch_name')
                  .map(group => {
                    group.data = this.generateGroup(group.data, 'y_warehouse_name');
                    return group;
                  })
                return group;
              })
            return group;
          })
        return group;
      });
    console.log('summaryreport:', this.summaryreport);
    this.showAllGroups();
  }

  generateGroup(arr, groupBy) {
    let groups = _.groupBy(arr, groupBy);
    return Object.keys(groups).map(key => {
      return {
        name: key,
        data: groups[key]
      };
    });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

    if ((key == 'f2' && !this.showDateModal) && this.activeId.includes('Date')) {
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
    } else if ((key != 'enter' && this.showDateModal) && this.activeId.includes('startDate')) {
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('stocktype')) {
        this.setFoucus('stocksubtype');
      } else if (this.activeId.includes('stocksubtype')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('stockItem');
      } else if (this.activeId.includes('stockItem')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('wherehouse');
      } else if (this.activeId.includes('wherehouse')) {
        // this.outStanding.startDate = this.common.handleDateOnEnterNew(this.outStanding.startDate);
        this.setFoucus('Date');
      } else if (this.activeId.includes('endDate')) {
        // this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
        this.setFoucus('submit');
      } else if (this.activeId.includes('Date')) {
        // this.outStanding.endDate = this.common.handleDateOnEnterNew(this.outStanding.endDate);
        this.setFoucus('endDate');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'Date') this.setFoucus('wherehouse');
      if (this.activeId == 'endDate') this.setFoucus('Date');
      if (this.activeId == 'wherehouse') this.setFoucus('stockItem');
      if (this.activeId == 'stockItem') this.setFoucus('stocksubtype');
      if (this.activeId == 'stocksubtype') this.setFoucus('stocktype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.voucherEntries.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.voucherEntries.length - 1) this.selectedRow++;

    }
  }

  handleExpandation(event, index, type, section, parentIndex?) {
    console.log(index, section, parentIndex, this.active[type][section], section + index + parentIndex, this.active[type][section].indexOf(section + index + parentIndex));
    event.stopPropagation();
    if (this.active[type][section].indexOf(section + index + parentIndex) === -1) this.active[type][section].push(section + index + parentIndex)
    else {
      this.active[type][section].splice(this.active[type][section].indexOf(section + index + parentIndex), 1);
    }
  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.outStanding[datestring].includes('-')) {
      dateArray = this.outStanding[datestring].split('-');
    } else if (this.outStanding[datestring].includes('/')) {
      dateArray = this.outStanding[datestring].split('/');
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
    this.outStanding[datestring] = date + separator + month + separator + year;
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

  handleGroupView(index) {
    if (this.activeGroup.indexOf(index) !== -1) {
      this.activeGroup.splice(this.activeGroup.indexOf(index), 1);
      return;
    }
    this.activeGroup.push(index);
  }

  showAllGroups() {
    this.activeGroup = this.voucherEntries.map((voucherEntry, index) => { return index; });

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
          reject(err);
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
          reject(err);
        });
    })
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
      console.log('Error:', err);
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
    let permanentDelete = 0;


    // if (voucherData.y_vouchertype_id == -151) {
    //   let tripExpDriver = this.tripExpDriver;
    //   this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };


    //   console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
    //   const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    //   activeModal.result.then(data => {
    //     // console.log('Data: ', data);
    //     if (data.response) {
    //       //this.addLedger(data.ledger);
    //    // this.getDayBook();

    //     }
    //     // this.selectedVehicle.id =0
    //   });
    // } else
    {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver, typeFlag, permanentDelete };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(TripdetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          //this.addLedger(data.ledger);
          // this.getDayBook();
        }
      });
    }
  }
}
