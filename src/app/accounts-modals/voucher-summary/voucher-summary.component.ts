import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { AddFuelFillingComponent } from '../../modals/add-fuel-filling/add-fuel-filling.component';
import { AddDriverComponent } from '../../driver/add-driver/add-driver.component';
@Component({
  selector: 'voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.scss']
})
export class VoucherSummaryComponent implements OnInit {

  tripVoucher;
  trips;
  ledgers = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  VehicleId;
  VoucherId;
  FinanceVoucherId;
  DriverId;
  DriverName;
  creditLedger = 0;

  constructor(public api: ApiService, public common: CommonService, public modalService: NgbModal, private activeModal: NgbActiveModal) {
    this.getAllLedgers();
    this.trips = this.common.params.tripDetails;
    this.VehicleId = this.common.params.vehId;
    this.tripVoucher = this.common.params.tripVoucher;
    console.log(this.trips);
    console.log(this.common.params.vehId);
    console.log(this.common.params.tripVoucher);
    if (this.tripVoucher) {
      this.VoucherId = this.tripVoucher.id;
      this.FinanceVoucherId=this.tripVoucher.fi_voucher_id;
      this.checkedTrips = this.trips;
      this.trips.map(trip => trip.isChecked = true);
      this.getFuelFillings(this.tripVoucher.startdate, this.tripVoucher.enddate);
      this.getVoucherDetails(this.tripVoucher.id);
    }
  }

  ngOnInit() {
  }


  getAllLedgers() {
    const params = {
      search: ""
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.ledgers = res['data'];
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

  hanldeExpenseVoucher() {
    if (this.VoucherId) {
      this.updateTripExpenseVoucher();
    } else {
      this.InsertTripExpenseVoucher();
    }
  }

  InsertTripExpenseVoucher() {
    const params = {
      vehId: this.VehicleId,
      voucher_details: this.tripHeads
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/InsertTripExpenseVoucher', params)
      .subscribe(res => {
        console.log('Res: ', res);
        this.common.loading--;
        this.addVoucher(res['data']);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      });
  }

  updateTripExpenseVoucher() {
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
        this.addVoucher(this.VoucherId,this.FinanceVoucherId);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      });
  }

  addVoucher(tvId, xId = 0) {
    let amountDetails = [];
    let totalAmount = 0;
    this.tripHeads.map(tripHead => {
      let data = {
        transactionType: "debit",
        ledger: {
          name: '',
          id: tripHead.id
        },
        amount: tripHead.total
      };
      totalAmount += tripHead.total;
      amountDetails.push(data);
    });

    amountDetails.push({
      transactionType: "credit",
      ledger: {
        name: '',
        id: this.creditLedger
      },
      amount: totalAmount
    });

    let params = {
      customercode: this.VehicleId,
      date: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
      foid: '',
      remarks: "test",
      vouchertypeid: '-9',
      amountDetails: amountDetails,
      xid: xId,
      y_code: ''
    };
    console.log('Params: ', params);
    this.common.loading++;
    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        console.log('Res: ', res);
        this.common.loading--;
        this.updateFinanceVoucherId(res['data'][0].save_voucher, tvId);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      })

  }

  updateFinanceVoucherId(fvId, tvId) {
    this.common.loading++;
    this.api.post('TripExpenseVoucher/updateVoucherFId', { fv_id: fvId, tv_id: tvId })
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
      }, err => {
        console.log('Error:', err);
        this.common.loading--;
      });
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
  addTrip() {
    let vehId = this.VehicleId;
    this.common.params = { vehId };
    const activeModal = this.modalService.open(AddTripComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
      }
    });
  }
  addFuelFilling() {
    let vehId = this.VehicleId;
    this.common.params = { vehId };
    const activeModal = this.modalService.open(AddFuelFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        //this.addLedger(data.ledger);
      }
    });
  }
  setDriverName(driverList) {
    if (driverList.id == null) {
      console.log(driverList.empname);
    }
    this.DriverId = driverList.id;
    this.DriverName = driverList.empname;
  }
  setLedgerName(ledgerList) {
    this.DriverId = ledgerList.id;
    this.DriverName = ledgerList.name;
  }
  addDriver() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddDriverComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

}
