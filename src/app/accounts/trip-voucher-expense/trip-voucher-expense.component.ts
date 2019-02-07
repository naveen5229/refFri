import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'trip-voucher-expense',
  templateUrl: './trip-voucher-expense.component.html',
  styleUrls: ['./trip-voucher-expense.component.scss']
})
export class TripVoucherExpenseComponent implements OnInit {

  trips = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  selectedVehicle;
  constructor(public api: ApiService, public common: CommonService) {

  }

  ngOnInit() {
  }

  getPendingTrips(vehicle) {
    this.selectedVehicle = vehicle;
    console.log(vehicle);
    const params = {
      vehId: vehicle.id
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getPendingVehicleTrips', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.trips = res['data'];
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
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
              trips.push({ id: trip.id, amount: 0});
            }
          });
          tripHead.trips = trips;
        });

      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }



}
