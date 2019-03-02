import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
@Component({
  selector: 'voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.scss']
})
export class VoucherSummaryComponent implements OnInit {

  tripVoucher;
  trips;
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  VehicleId;
  VoucherId;
  constructor(public api: ApiService, public common: CommonService, public modalService: NgbModal, private activeModal: NgbActiveModal) {
    this.trips = this.common.params.tripDetails;
    this.VehicleId = this.common.params.vehId;
    this.tripVoucher = this.common.params.tripVoucher;
    console.log(this.trips);
    console.log(this.common.params.vehId);
    console.log(this.common.params.tripVoucher);
    if (this.tripVoucher) {
      this.VoucherId = this.tripVoucher.id;
      this.checkedTrips = this.trips;
      this.trips.map(trip => trip.isChecked = true);
      this.getFuelFillings(this.tripVoucher.startdate, this.tripVoucher.enddate);
      this.getVoucherDetails(this.tripVoucher.id);
    }
  }

  ngOnInit() {
  }
  checkedAllSelected() {
    this.checkedTrips = [];
    for (let i = this.findFirstSelectInfo('index'); i <= this.findLastSelectInfo('index'); i++) {
      this.trips[i]['isChecked'] = true;
      this.checkedTrips.push(this.trips[i]);
    }
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
  getFuelFillings(lastFilling?, currentFilling?) {
    console.log(this.findFirstSelectInfo(), this.findLastSelectInfo());
    const params = {
      vehId: this.VehicleId,
      lastFilling: lastFilling || this.findFirstSelectInfo(),
      currentFilling: currentFilling || this.findLastSelectInfo()
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.fuelFilings = res['data'];
        this.fuelFilings.map(fuelFiling => fuelFiling.isChecked = true);
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getVoucherDetails(voucherId) {
    const params = {
      voucherId: voucherId,
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getTripExpenseVoucherDetails', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.getHeads(res['data']);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getHeads(voucherDetails?) {
    console.log("voucherDetail:", voucherDetails);
    this.common.loading++;
    this.api.post('Accounts/getLedgerHeadList', {})
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.tripHeads = res['data'];
        this.handleTripHeads(voucherDetails);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  handleTripHeads(voucherDetails) {
    this.tripHeads.map(tripHead => {
      let trips = [];
      let totalRowId = -1;
      this.trips.map(trip => {
        let tripRowId = -1;

        if (trip.isChecked) {
          let amount = 0;
          if (voucherDetails) {
            voucherDetails.map(voucherDetail => {
              if (voucherDetail.trip_id == trip.id && tripHead.id == voucherDetail.ledger_id) {
                tripRowId = voucherDetail.id;
                amount = voucherDetail.amount;
                // console.log('Trip Row Id: ', tripRowId, voucherDetail);
              }

            });
          }

          trips.push({
            id: trip.id,
            rowid: tripRowId,
            amount: amount,
            start_time: trip.start_time,
            end_time: trip.end_time,
            start_name: trip.start_name,
            end_name: trip.end_name
          });
          // console.log('Trips: ', trips);
        }
      });
      tripHead.trips = trips;
      let total = 0;
      if (voucherDetails) {
        voucherDetails.map(voucherDetail => {
          if (tripHead.id == voucherDetail.ledger_id && voucherDetail.trip_id == 0) {
            totalRowId = voucherDetail.id;
            total = voucherDetail.amount;
          }
        });
      }
      tripHead.total = total;
      tripHead.rowid = totalRowId;
      let fuelFilings = [];
      this.fuelFilings.map(fuelFiling => {
        if (fuelFiling.isChecked) {
          fuelFilings.push({ id: fuelFiling.id });
        }
      });
      tripHead.fuelFilings = fuelFilings;
    });
  }

  addVoucher() {
    console.log('Trips: ', this.tripHeads);
    console.log('VoucherId: ', this.VoucherId);
    if (this.VoucherId) {
      const params = {
        vehId: this.VehicleId,
        voucher_details: this.tripHeads,
        voucherId: this.VoucherId
      };
      this.common.loading++;
      this.api.post('TripExpenseVoucher/updateTripExpenseVoucher', params)
        .subscribe(res => {
          console.log('Res: ', res);
          this.common.loading--;
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError;
        })
    } else {
      const params = {
        vehId: this.VehicleId,
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
  }

  calculateTripHeadTotal(index) {
    console.log('Index: ', index)
    this.tripHeads[index].total = 0;
    this.tripHeads[index].trips.map(trip => {
      this.tripHeads[index].total += trip.amount;
    });
    console.log('Total: ', this.tripHeads[index].total);
  }
  dismiss(status) {
    this.activeModal.close({ status: status });
  }
  addTrip(){
    let vehId=this.VehicleId; 
    this.common.params = {vehId};
    const activeModal = this.modalService.open(AddTripComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
      }
    });
  }

}
