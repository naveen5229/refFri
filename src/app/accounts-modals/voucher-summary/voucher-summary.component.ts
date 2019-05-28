import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { AddFuelFillingComponent } from '../../modals/add-fuel-filling/add-fuel-filling.component';
import { AddDriverComponent } from '../../driver/add-driver/add-driver.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.scss']
})
export class VoucherSummaryComponent implements OnInit {
  alltotal = 0;
  narration = '';
  tripVoucher;
  trips;
  ledgers = [];
  debitLedgerdata = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  VehicleId;
  VoucherId;
  FinanceVoucherId;
  DriverId;
  DriverName;
  creditLedger = {
    name: '',
    id: 0
  };
  debitLedger = {
    name: '',
    id: 0
  };

  storeids = [];
  date = this.common.dateFormatternew(new Date()).split(' ')[0];
  custcode = '';
  checkall = false;
  activeId = 'creditLedger';

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal) {
    // this.getAllLedgers();
    this.trips = this.common.params.tripDetails;
    this.VehicleId = this.common.params.vehId;
    this.tripVoucher = this.common.params.tripVoucher;
    console.log(this.trips);
    console.log(this.common.params.vehId);
    console.log(this.common.params.tripVoucher);
    if (this.tripVoucher) {
      this.VoucherId = this.tripVoucher.id;
      this.FinanceVoucherId = this.tripVoucher.fi_voucher_id;
      this.checkedTrips = this.trips;
      this.trips.map(trip => trip.isChecked = true);
      this.getFuelFillings(this.tripVoucher.startdate, this.tripVoucher.enddate);
      this.getVoucherDetails(this.tripVoucher.id);
    }
    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.getcreditLedgers('credit');
    //  this.getdebitLedgers('debit');
    // this.setFoucus('custcode');
  }

  ngOnInit() {
  }

  getcreditLedgers(transactionType) {
    //  this.showSuggestions = true;
    let voucherId = -7;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.ledgers = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
    //this.setFoucus('ref-code');
  }

  getdebitLedgers(transactionType) {
    //  this.showSuggestions = true;
    let voucherId = -7;
    let url = 'Suggestion/GetLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.debitLedgerdata = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
    //this.setFoucus('ref-code');
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

  // onSelected(selectedData, type, display) {
  //   this.creditLedger.name = selectedData[display];
  //   this.creditLedger.id = selectedData.id;
  //   console.log('Selected Data: ', selectedData, type, display);
  //   //  console.log('order User: ', this.DayBook);
  // }


  checkedAllSelected() {
    this.checkedTrips = [];
    for (let i = this.findFirstSelectInfo('index'); i <= this.findLastSelectInfo('index'); i++) {
      this.trips[i]['isChecked'] = true;
      this.checkedTrips.push(this.trips[i]);

      //  this.storeids.push(this.trips[i].);
    }


  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
  }

  onSelected(selectedData, type, display) {
    console.log('selected data', selectedData);
    this.creditLedger.name = selectedData.y_ledger_name;
    this.creditLedger.id = selectedData.y_ledger_id;
    console.log('Accounts User: ', this.creditLedger);
  }
  onDebitSelected(selectedData, type, display) {
    console.log('selected data1', selectedData);
    this.debitLedger.name = selectedData.y_ledger_name;
    this.debitLedger.id = selectedData.y_ledger_id;
    console.log('Accounts11 User: ', this.debitLedger);
  }

  checkedAll() {
    console.log('true value', this.checkall);
    let selectedAll = '';
    if (this.checkall) {
      this.trips.map(trip => trip.isChecked = true);
    } else {
      this.trips.map(trip => trip.isChecked = false);
    }
    // for (var i = 0; i < this.trips.length; i++) {
    //   this.trips[i].selected = true;
    // }
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
          this.storeids.push(fuelFiling.id);
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
        //  this.addVoucher(res['data']);
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
        // this.addVoucher(this.VoucherId, this.FinanceVoucherId);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      });
  }


  addVoucher() {


    console.log('test value', this.checkedTrips);
    // this.updateVoucherTrip(123);
    // return;
    let amountDetails = [];
    amountDetails.push({
      transactionType: 'credit',
      ledger: {
        name: this.creditLedger.name,
        id: this.creditLedger.id
      },
      amount: this.alltotal,
      details: []
    });


    let totalAmount = 0;
    this.tripHeads.map(tripHead => {
      if (tripHead.total > 0) {
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
      }
    });


    // amountDetails.push({
    //   transactionType: 'debit',
    //   ledger: {
    //     name: this.debitLedger.name,
    //     id: this.debitLedger.id
    //   },
    //   amount: this.alltotal,
    //   details: []
    // });




    //const params ='';
    const params = {
      foid: 123,
      // vouchertypeid: voucher.voucher.id,
      customercode: this.custcode,
      remarks: this.narration,
      date: this.date,
      amountDetails: amountDetails,
      vouchertypeid: -10,
      y_code: '',
      xid: 0
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('return vouher id: ', res['data']);
        if (res['success']) {

          if (res['data'][0].save_voucher_v1) {

            //  this.voucher = this.setVoucher();
            this.updateVoucherTrip(res['data'][0].save_voucher_v1);
            this.common.showToast('Your Code :' + res['data'].code);
            //   this.setFoucus('ref-code');



          } else {
            let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
            this.common.showError(message);
          }
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  updateVoucherTrip(voucherid) {
    let tripidarray = [];

    this.checkedTrips.map(tripHead => {
      tripidarray.push(tripHead.id);

    });
    console.log('trip id array ', tripidarray);
    const params = {
      vchrid: voucherid,
      // vchrid: 4925,
      tripArrayId: tripidarray,
      vehid: this.VehicleId,

    };

    this.api.post('TripExpenseVoucher/updateTripsForVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('return vouher id: ', res['data']);
        if (res['success']) {

          if (res['data']) {

            //  this.voucher = this.setVoucher();
            // this.updateVoucherTrip(res['data'][0].save_voucher_v1);
            // this.common.showToast('Your Code :' + res['data'].code);
            //   this.setFoucus('ref-code');

            this.activeModal.close({ status: status });
            this.common.loading--;
          } else {
            let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
            this.common.showError(message);
          }
        }

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  // addVoucher(tvId, xId = 0) {
  //   let amountDetails = [];
  //   let totalAmount = 0;
  //   this.tripHeads.map(tripHead => {
  //     let data = {
  //       transactionType: "debit",
  //       ledger: {
  //         name: '',
  //         id: tripHead.id
  //       },
  //       amount: tripHead.total
  //     };
  //     totalAmount += tripHead.total;
  //     amountDetails.push(data);
  //   });

  //   amountDetails.push({
  //     transactionType: "credit",
  //     ledger: {
  //       name: '',
  //       id: this.creditLedger.id
  //     },
  //     amount: totalAmount
  //   });

  //   let params = {
  //     //  customercode: this.VehicleId,
  //     customercode: this.custcode,
  //     date: this.date,
  //     foid: '',
  //     remarks: "test",
  //     vouchertypeid: '-9',
  //     amountDetails: amountDetails,
  //     xid: xId,
  //     y_code: ''
  //   };
  //   console.log('Params: ', params);
  //   this.common.loading++;
  //   this.api.post('Voucher/InsertVoucher', params)
  //     .subscribe(res => {
  //       console.log('Res: ', res);
  //       this.common.loading--;
  //       this.updateFinanceVoucherId(res['data'][0].save_voucher, tvId);
  //     }, err => {
  //       console.log(err);
  //       this.common.loading--;
  //       this.common.showError;
  //     })

  // }

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
    // console.log('Total: ', this.tripHeads[index].total);
    let total = 0;
    this.tripHeads.map(trip => {
      total += trip.total;
    });
    this.alltotal = total;
    console.log('All Total: ', this.alltotal);

  }



  dismiss(status) {
    this.activeModal.close({ status: status });
  }

  callSaveVoucher(response) {

    if (this.accountService.selected.branch.id != 0) {
      // this.accountService.selected.branch
      this.addVoucher();
      // this.showConfirm = false;
      event.preventDefault();
      return;
    } else {
      alert('Please Select Branch');
    }
  }

  addTrip() {
    let vehId = this.VehicleId;
    this.common.params = { vehId };
    const activeModal = this.modalService.open(AddTripComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
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
