import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoucherSummaryComponent } from '../../accounts-modals/voucher-summary/voucher-summary.component';
import { ViewListComponent } from '../../modals/view-list/view-list.component';

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
  selectedVehicle;
  vehicles = [];
  flag = false;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.common.currentPage = 'Trip Voucher Expense';
  }

  ngOnInit() {
  }

  getVehicle(vehicle) {
    console.log('test fase',vehicle);
    this.selectedVehicle = vehicle;
    this.flag = true;
    this.getTripSummary();

  }

  getPendingTrips() {
    this.getTripExpences();
    if (this.flag == false) {
      this.common.showToast('please enter registration number !!')
    } else {
      const params = {
        vehId: this.selectedVehicle.id
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
    this.common.params = { vehId, tripDetails };
    const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
        this.common.loading--;
      }
    });
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
        this.fuelFilings = res['data'];
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
      vehId: this.selectedVehicle.id
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getTripExpenseVouchers', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.tripVouchers = res['data'];
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }



  getTripExpences() {

    const params = {
      vehId: this.selectedVehicle.id
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.tripVouchers = res['data'];
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }



  getVoucherSummary(tripVoucher) {
    console.log('trdhh-----',tripVoucher);
    const params = {
      voucherId: tripVoucher.id,
      startDate: tripVoucher.startdate,
      endDate: tripVoucher.enddate
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getTripExpenseVoucherTrips', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.showVoucherSummary(res['data'], tripVoucher);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }
  showVoucherSummary(tripDetails, tripVoucher) {
    let vehId = this.selectedVehicle.id;
    this.common.params = { vehId, tripDetails, tripVoucher };
    const activeModal = this.modalService.open(VoucherSummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
      }
    });
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


}
