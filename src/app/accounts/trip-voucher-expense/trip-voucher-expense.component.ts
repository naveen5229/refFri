import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherSummaryShortComponent } from '../../accounts-modals/voucher-summary-short/voucher-summary-short.component';



@Component({
  selector: 'trip-voucher-expense',
  templateUrl: './trip-voucher-expense.component.html',
  styleUrls: ['./trip-voucher-expense.component.scss']
})
export class TripVoucherExpenseComponent implements OnInit {
  enddate = this.common.dateFormatternew(new Date()).split(' ')[0];
  startdate = this.common.dateFormatternew(new Date()).split(' ')[0];
  trips = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  tripVouchers = [];
  showtripvoucher = [];
  selectedVehicle = {
    id: 0,
    regno:''
  };
  vehicles = [];
  flag = false;
  TripEditData = [];
  pendingDataEditTme = [];
  VoucherEditTime = [];
  routId = 0;
  tripExpDriver = [];
  vchdt = 1;
  selectedRow = -1;
  tripExpenseVoucherTrips = [];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }
  constructor(
    public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.currentPage = 'Trip Voucher Expense';
    // this.getTripExpences();
    this.common.refresh = this.refresh.bind(this);
    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.routId = params.id;
      }
    });

  }

  ngOnInit() {
  }

  refresh() {
    // this.getVoucherTypeList();
    // this.getLedgerList();
    this.getTripExpences();
  }

  getVehicle(vehicle) {
    this.selectedVehicle = vehicle;
    this.flag = true;
    console.log('test fase', this.selectedVehicle);

    // this.getTripSummary();

    // this.selectedVehicle.id =0
    // this.getTripExpences();
  }

  getPendingTripsEditTime(voucherid) {
    return new Promise((resolve, reject) => {
      if (this.selectedVehicle.id == 0) {
        this.common.showToast('please enter registration number !!');
        reject();
      } else {
        const params = {
          vehId: this.selectedVehicle.id,
          vchrid: voucherid
        };
        this.common.loading++;
        this.api.post('VehicleTrips/getPendingVehicleTripsEdit', params)
          .subscribe(res => {
            console.log(res);
            this.common.loading--;
            this.pendingDataEditTme = res['data'];
            this.trips = res['data'];
            resolve();
          }, err => {
            console.log(err);
            this.common.loading--;
            this.common.showError();
            reject();
          });
      }
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
    });
  }


  getPendingTrips() {
    if (this.selectedVehicle.id == 0) {
      this.common.showToast('please enter registration number !!')
    } else if (this.accountService.selected.branch.id == 0) {
      this.common.showError('please Select Branch !!')
    } else {
      this.getTripExpences();
      console.log('this.selectedVehicle.id',this.selectedVehicle.regno);
      const params = {
        vehId: this.selectedVehicle.id,
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getPendingVehicleTrips', params)
        // this.api.post('VehicleTrips/getTripExpenceVouher', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.showTripSummary(res['data']);
          //this.flag=false;
          this.trips = res['data'];
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
        });
    }
  }
  showTripSummary(tripDetails) {
    let vehId = this.selectedVehicle.id;
   let vehname= this.selectedVehicle.regno;
   let firstDate = this.startdate;
   let endDate = this.enddate;
    
    this.common.params = { vehId, tripDetails,vehname,firstDate,endDate };

    if (this.routId == 1) {
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log('Data123: ', data.status);
        if (data.status) {
        console.log('response Data123: ', data.status);

          //this.addLedger(data.ledger);
          // this.common.loading--;
          this.selectedVehicle.id = 0
          this.getTripExpences();
        } else {

        }

      });
    } else {
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log('Data321: ', data.status);
        if (data.status) {
        console.log('response Data1234: ', data.status);

          //this.addLedger(data.ledger);
          // this.common.loading--;
          this.selectedVehicle.id = 0
          this.getTripExpences();
        } else {

        }

      });
    }



  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    let activeId = document.activeElement.id;
    console.log('Active event', event);
    if ((key == 'backspace' || key == 'delete') && activeId == 'suggestion') {
      /***************************** Handle Row Enter ******************* */
      this.selectedVehicle.id = 0;
    }
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !activeId && this.showtripvoucher.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.showtripvoucher.length - 1) this.selectedRow++;

    }
  }
  checkedAllSelected() {
    this.checkedTrips = [];
    for (let i = this.findFirstSelectInfo('index'); i <= this.findLastSelectInfo('index'); i++) {
      this.trips[i]['isChecked'] = true;
      this.checkedTrips.push(this.trips[i]);
    }
  }

  getFuelFillings() {
    console.log(this.findFirstSelectInfo(), this.findLastSelectInfo());
    const params = {
      vehId: this.selectedVehicle.id,
      lastFilling: this.findFirstSelectInfo(),
      currentFilling: this.findLastSelectInfo()
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.fuelFilings = res['data'] || [];
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  findFirstSelectInfo(type = 'startDate') {
    let options = {
      startDate: '',
      index: -1
    };
    for (let i = 0; i < this.trips.length; i++) {
      if (this.trips[i].isChecked) {
        options.startDate = this.trips[i].start_time;
        options.index = i;
        break;
      }
    }

    return options[type];
  }

  findLastSelectInfo(type = 'endDate') {
    let options = {
      endDate: '',
      index: -1
    };

    for (let i = this.trips.length - 1; i >= 0; i--) {
      if (this.trips[i].isChecked) {
        options.endDate = this.trips[i].end_time;
        options.index = i;
        break;
      }
    }
    return options[type];
  }

  getHeads() {

    this.common.loading++;
    this.api.post('Accounts/getLedgerHeadList', {})
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.tripHeads = res['data'];
        this.tripHeads.map(tripHead => {
          let trips = [];
          this.trips.map(trip => {
            if (trip.isChecked) {
              trips.push({ id: trip.id, amount: 0, start_time: trip.start_time, end_time: trip.end_time, start_name: trip.start_name, end_name: trip.end_name });
            }
          });
          tripHead.trips = trips;
          tripHead.total = 0;
          let fuelFilings = [];
          this.fuelFilings.map(fuelFiling => {
            if (fuelFiling.isChecked) {
              fuelFilings.push({ id: fuelFiling.id });
            }
          });
          tripHead.fuelFilings = fuelFilings;
        });

      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  addVoucher() {
    console.log('Trips: ', this.tripHeads);
    const params = {
      vehId: this.selectedVehicle.id,
      voucher_details: this.tripHeads
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/InsertTripExpenseVoucher', params)
      .subscribe(res => {
        console.log('Res: ', res);
        this.common.loading--;
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      })
  }

  calculateTripHeadTotal(index) {
    console.log('Index: ', index)
    this.tripHeads[index].total = 0;
    this.tripHeads[index].trips.map(trip => {
      this.tripHeads[index].total += trip.amount;
    });
    console.log('Total: ', this.tripHeads[index].total);
  }
  getTripSummary() {

    const params = {
      vehId: (this.selectedVehicle.id) ? this.selectedVehicle.id : 0
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getTripExpenseVouchers', params)
      .subscribe(res => {
        console.log('trip expence 11', res);
        this.common.loading--;
        this.tripVouchers = res['data'];
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }


  getPendingOnEditTrips() {
    return new Promise((resolve, reject) => {
      if (this.selectedVehicle.id == 0) {
        this.common.showToast('please enter registration number !!');
        reject();
      } else {
        const params = {
          vehId: this.selectedVehicle.id
        };
        this.common.loading++;
        this.api.post('VehicleTrips/getPendingVehicleTrips', params)
          .subscribe(res => {
            console.log(res);
            this.common.loading--;
            this.TripEditData = res['data'];
            this.trips = res['data'];
            resolve();
          }, err => {
            console.log(err);
            this.common.loading--;
            this.common.showError();
            reject();
          });
      }
    });
  }

  getTripExpences() {
    return new Promise((resolve, reject) => {
      const params = {
        vehId: (this.selectedVehicle.id) ? this.selectedVehicle.id : 0,
        startdate: this.startdate,
        enddate: this.enddate,
        isdate: this.vchdt
      };
      this.common.loading++;
      this.api.post('VehicleTrips/getTripExpenceFilterVoucher', params)
        .subscribe(res => {
          console.log('trip expence 22', res);
          this.common.loading--;
          this.tripVouchers = res['data'];
          resolve();
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    })
  }

  getSearchTripExpences() {

    const params = {
      vehId: (this.selectedVehicle.id) ? this.selectedVehicle.id : 0,
      startdate: this.startdate,
      enddate: this.enddate,
      isdate: this.vchdt,
      routid:this.routId
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceFilterVoucher', params)
      .subscribe(res => {
        console.log('trip expence 33', res);
        this.common.loading--;
        this.showtripvoucher = this.tripVouchers = res['data'];
        this.selectedRow = 0;
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getVoucherSummary(tripVoucher) {
    if (this.accountService.selected.branch.id != 0) {
    let promises = [];
    this.selectedVehicle.id = tripVoucher.y_vehicle_id;
    promises.push(this.getTripExpences());
    promises.push(this.getPendingOnEditTrips());
    promises.push(this.getPendingTripsEditTime(tripVoucher.y_id));
    promises.push(this.getVocherEditTime(tripVoucher.y_voucher_id));
    promises.push(this.getTripsExpDriver(tripVoucher.y_id));
    promises.push(this.getTripExpenseVoucherTripsData(tripVoucher));

    Promise.all(promises).then(result => {
      this.showVoucherSummary(this.tripExpenseVoucherTrips, tripVoucher);
    }).catch(err => {
      console.log(err);
      this.common.showError('There is some technical error occured. Please Try Again!');
    })
  }
  else{
    this.common.showError('Please Select Branch');
  }
}

  getTripExpenseVoucherTripsData(tripVoucher) {
    return new Promise((resolve, reject) => {
      const params = {
        voucherId: tripVoucher.y_voucher_id,
        voucherDetail: tripVoucher,
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
          reject(err);
        });
    });

  }

  showVoucherSummary(tripDetails, tripVoucher) {
    let vehId = this.selectedVehicle.id;
    let tripEditData = this.TripEditData;
    let tripPendingDataSelected = this.pendingDataEditTme;
    let VoucherData = this.VoucherEditTime;
    console.log('type id', tripVoucher.y_vouchertype_id);


    if (tripVoucher.y_vouchertype_id == -151) {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryShortComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log('Data active element: ', data);
        if (data.status) {

          //this.addLedger(data.ledger);
          this.selectedVehicle.id = 0
          this.getSearchTripExpences();
        }
        this.selectedVehicle.id = 0
      });
    } else {
      let tripExpDriver = this.tripExpDriver;
      this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected, VoucherData, tripExpDriver };
      // this.common.params = { vehId, tripDetails, tripVoucher, tripEditData, tripPendingDataSelected,VoucherData };
      console.log('tripPendingDataSelected', tripPendingDataSelected, 'this.common.params', this.common.params)
      const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        console.log('Data active element 2: ', data);
        if (data.status) {
          //this.addLedger(data.ledger);
          this.selectedVehicle.id = 0
          this.getSearchTripExpences();
        }
        this.selectedVehicle.id = 0

      });
    }
  }



  deleteVoucherEntry(tripVoucher) {
    let params = {
      voucherId: tripVoucher.id
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('TripExpenseVoucher/deleteTripExpenseVouchers', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['success']) {
          this.common.showToast('Success!!')
          this.getTripSummary();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
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
        this.common.getPDFFromTableIdnew('table', foname, cityaddress, '', '', 'Trip Voucher Expence :' + this.startdate + ' To :' + this.enddate);

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
}
