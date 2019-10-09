import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { AddFuelFillingComponent } from '../../modals/add-fuel-filling/add-fuel-filling.component';
import { AddDriverComponent } from '../../driver/add-driver/add-driver.component';
import { AccountService } from '../../services/account.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { PrintService } from '../../services/print/print.service';


@Component({
  selector: 'voucher-summary-short',
  templateUrl: './voucher-summary-short.component.html',
  styleUrls: ['./voucher-summary-short.component.scss']
})
export class VoucherSummaryShortComponent implements OnInit {
  permanentDeleteId = 0;
  sizeIndex = 0;
  alltotal = 0;
  narration = '';
  tripVoucher;
  approve = 0;
  typeFlag = 2;
  trips;
  ledgers = [];
  diverledgers = [];
  debitLedgerdata = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  VehicleId;
  VoucherId = 0;
  vouchertype=-151;
  vehclename = '';
  totalRevinue=0;
  totalAdvance=0;
  FinanceVoucherId;
  DriverId;
  DriverName;
  tripFreghtDetails=[];
  creditLedger = {
    name: '',
    id: 0
  };
  debitLedger = {
    name: '',
    id: 0
  };
  tripsEditData = [];
  storeids = [];
  VoucherData = [];
  transferData = [];
  transferHeading = [];
  date = this.common.dateFormatternew(new Date()).split(' ')[0];
  custcode = '';
  checkall = false;
  activeId = 'creditLedger';
  tripexpvoucherid = 0;
  voucherDetails = null;
  driverTotal = 0;
  netTotal = 0;
  accDetails = [{
    detaildate: this.common.dateFormatternew(new Date()).split(' ')[0],
    detailamount: 0,
    detailramarks: '',
    detailLedger: {
      name: '',
      id: 0
    }

  }];
  // autoSuggestion = {
  //   data: [],
  //   targetId: '',
  //   display: ''
  // };

  targetId = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public accountService: AccountService,
    private printService: PrintService,
    private activeModal: NgbActiveModal) {
    console.log('________________PARAMS___________', Object.assign({}, this.common.params));
    if (this.VoucherId == 0) {
      console.log('add again', this.VoucherId);
      this.trips = this.common.params.tripDetails;
    }
    if (this.common.params.sizeIndex) {
      this.sizeIndex = this.common.params.sizeIndex;
    }
    if (this.common.params.typeFlag) { this.typeFlag = this.common.params.typeFlag; }
    this.permanentDeleteId = (this.common.params.permanentDelete) ? this.common.params.permanentDelete : 0;

    this.VehicleId = this.common.params.vehId;
    // console.log('tripsEditData', this.tripsEditData);
    // console.log('trips data', this.trips);
    // console.log(this.common.params.vehId);
    // console.log('111 VoucherData', this.common.params.VoucherData);
    // console.log('tripPendingDataSelected', this.common.params.tripPendingDataSelected);

    if (this.common.params.tripVoucher) {
      this.vehclename = this.common.params.tripVoucher.y_vehicle_name
      this.tripsEditData = this.common.params.tripDetails;
      this.tripVoucher = this.common.params.tripVoucher;
      this.trips = this.common.params.tripEditData;
      this.VoucherId = this.tripVoucher.y_voucher_id;
      this.FinanceVoucherId = this.tripVoucher.fi_voucher_id;
      this.checkedTrips = this.tripsEditData;
      this.custcode = this.tripVoucher.y_code;
      this.creditLedger.id = this.tripVoucher.y_ledger_id;
      this.creditLedger.name = this.tripVoucher.y_ledger_name;
      this.narration = this.tripVoucher.y_naration;
      this.date = this.common.dateFormatternew(this.tripVoucher.y_date, "DDMMYYYY", false, '-');
      this.alltotal = this.tripVoucher.y_amount;
      this.custcode = this.tripVoucher.y_code;
      this.approve = this.common.params.Approved;


      if (this.common.params.tripExpDriver.length > 0) {
        console.log('fill Array', this.common.params.tripExpDriver);
        this.accDetails = [];
        this.common.params.tripExpDriver.forEach(tripExpDriver => {
          this.accDetails.push({
            detaildate: this.common.dateFormatternew(tripExpDriver.date).split(' ')[0],
            detailamount: parseFloat(tripExpDriver.amount),
            detailramarks: tripExpDriver.remarks,
            detailLedger: {
              name: tripExpDriver.ledger_name,
              id: tripExpDriver.ledger_id
            }
          })
        });
      } else {
        console.log('Not fill Array', this.common.params.tripExpDriver);
      }

      // this.accDetails = this.common.params.tripExpDriver;

      this.trips.map(trip => {
        this.tripsEditData.map(tripedit => {
          (trip.id == tripedit.id) ? trip.isChecked = true : '';
        })
      });
      this.trips.sort((a) => {
        if (a.isChecked == true) return -1;
        else return 1;
      });
      // this.getFuelFillings(this.tripVoucher.startdate, this.tripVoucher.enddate);
      // this.getFuelFillingsEditTime(
      //   this.tripVoucher.startdate,
      //   this.tripVoucher.enddate,
      //   this.common.params.tripPendingDataSelected
      // );
      this.getVoucherDetails(this.tripVoucher.y_id);
      this.tripexpvoucherid = this.tripVoucher.y_id;
      this.VoucherData = this.common.params.VoucherData;
    }

    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', this.sizeIndex);
    this.getcreditLedgers('credit');
    this.getDriveLedgers('credit');
  }

  ngOnInit() {
  }

  getcreditLedgers(transactionType) {
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
  }
  getDriveLedgers(transactionType) {
    let voucherId = -7;
    let url = 'Suggestion/GetTripLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.diverledgers = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  approveVoucher() {
    this.approveDelete(0, 'true');
  }
  restore() {
    this.approveDelete(1, 'false');
  }
  approveDelete(type, typeans) {
    let params = {
      id: this.VoucherId,
      flagname: (type == 1) ? 'deleted' : 'forapproved',
      flagvalue: typeans
    };
    this.common.loading++;
    this.api.post('Voucher/deleteAppeooved', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.getStockItems();
        this.activeModal.close({ response: true, delete: 'true' });
        if (type == 1 && typeans == 'true') {
          this.common.showToast(" This Value Has been Deleted!");
        } else if (type == 1 && typeans == 'false') {
          this.common.showToast(" This Value Has been Restored!");
        } else {
          this.common.showToast(" This Value Has been Approved!");
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError('This Value has been used another entry!');
      });
  }

  permanentDeleteConfirm() {
    let params = {
      id: 1
    };
    if (params.id) {
      //console.log('city', tblid);
      this.common.params = {
        title: 'Delete Voucher ',
        description: `<b>&nbsp;` + 'Are you sure want to delete ? ' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        //  this.common.loading++;
        if (data.response) {
          console.log("data", data);
          // this.voucher.delete = 1;
          // this.addOrder(this.order);
          //this.dismiss(true);

          this.permanentDelete();

          // this.activeModal.close({ response: true, ledger: this.voucher });
          // this.common.loading--;
        }
      });
    }
  }

  deleteConsignment() {
    let params = {
      id: 1
    };
    if (params.id) {
      //console.log('city', tblid);
      this.common.params = {
        title: 'Delete Voucher ',
        description: `<b>&nbsp;` + 'Are you sure want to delete ? ' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        //  this.common.loading++;
        if (data.response) {
          console.log("data", data);
          // this.voucher.delete = 1;
          // this.addOrder(this.order);
          //this.dismiss(true);

          this.approveDelete(1, 'true');

          // this.activeModal.close({ response: true, ledger: this.voucher });
          // this.common.loading--;
        }
      });
    }
  }

  getdebitLedgers(transactionType) {
    let voucherId = -7;
    let url = 'Suggestion/GetTripLedger?transactionType=' + transactionType + '&voucherId=' + voucherId + '&search=' + 'name';
    console.log('URL: ', url);
    this.api.get(url)
      .subscribe(res => {
        console.log(res);
        this.debitLedgerdata = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
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
    this.checkedTrips = this.trips.filter(trip => {
      if (trip.isChecked) return true;
      return false;
    });
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

  onDebitSelectednew(selectedData, type, display, targetId) {
    console.log('selected data1', selectedData, targetId);
    let index = targetId.split('-')[1];

    this.accDetails[index].detailLedger.name = selectedData.y_ledger_name;
    this.accDetails[index].detailLedger.id = selectedData.y_ledger_id;
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
  }

  findFirstSelectInfo(type = 'startDate') {
    // let options = {
    //   startDate: '',
    //   index: -1
    // };
    // for (let i = 0; i < this.trips.length; i++) {
    //   if (this.trips[i].isChecked) {
    //     options.startDate = this.trips[i].start_time;
    //     options.index = i;
    //     break;
    //   }
    // }
    // return options[type];

    let min = this.trips.filter(ele => { return ele.isChecked }).reduce((a, b) => {
      console.log(a);
      console.log(b);
      return ((typeof a == 'string' ? a : a.start_time) > b.start_time) ? b.start_time :
        (typeof a == 'string' ? a : a.start_time);
    });
    console.log('_____________________MIN MIL GYA___________', min);
    return min['start_time'];
  }

  findLastSelectInfo(type = 'endDate') {
    // let options = {
    //   endDate: '',
    //   index: -1
    // };

    // for (let i = this.trips.length - 1; i >= 0; i--) {
    //   if (this.trips[i].isChecked) {
    //     options.endDate = this.trips[i].end_time;
    //     options.index = i;
    //     break;
    //   }
    // }
    // return options[type];
    let max = this.trips.filter(ele => { return ele.isChecked }).reduce((a, b) => {
      return (typeof a == 'string' ? a : a.end_time) < b.end_time ? b.end_time :
        (typeof a == 'string' ? a : a.end_time);
    });
    return max['end_time'];
  }

  permanentDelete() {
    //console.log('voucher id last ', voucherId)
    const params = {
      voucherId: this.VoucherId,
    };
    this.common.loading++;
    // this.api.post('TripExpenseVoucher/getTripExpenseVoucherDetails', params)
    this.api.post('Voucher/permanetDelete', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.activeModal.close({ response: true, delete: 'true' });
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }
  getFuelFillingsEditTime(lastFilling?, currentFilling?, selectedData?) {
    console.log(this.findFirstSelectInfo(), this.findLastSelectInfo());
    const params = {
      vehId: this.VehicleId,
      lastFilling: lastFilling || this.findFirstSelectInfo(),
      currentFilling: currentFilling || this.findLastSelectInfo(),
      date:this.date
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        console.log('fuelFiling Edit data', res);
        this.common.loading--;
        this.fuelFilings = res['data'];
        this.fuelFilings.map(fuelFiling => {
          selectedData.map(tripedit => {
            (fuelFiling.id == tripedit.id) ? fuelFiling.isChecked = true : '';
          });
        });
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getFuelFillings(lastFilling?, currentFilling?) {
    console.log(this.findFirstSelectInfo(), this.findLastSelectInfo());
    const params = {
      vehId: this.VehicleId,
      lastFilling: lastFilling || this.findFirstSelectInfo(),
      currentFilling: currentFilling || this.findLastSelectInfo(),
      date:this.date
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.fuelFilings = res['data'];
        this.fuelFilings.map(fuelFiling => fuelFiling.isChecked = true);
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getVoucherDetails(voucherId) {
    console.log('voucher id last ', voucherId)
    const params = {
      voucherId: voucherId,
    };
    this.common.loading++;
    // this.api.post('TripExpenseVoucher/getTripExpenseVoucherDetails', params)
    this.api.post('TripExpenseVoucher/getTripExpenseVoucherDetailsnew', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.voucherDetails = res['data'];
        this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  getHeads() {
    console.log('checkedTrips', this.checkedTrips);
    this.common.loading++;
    this.api.post('Accounts/getLedgerHeadList', {})
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.tripHeads = res['data'];
        this.handleTripHeads();
        // this.tripHeads.map((tripHead, index) => this.calculateTripHeadTotal(index));
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }

  handleTripHeads() {
    console.log('voucherDetails:', Object.assign({}, this.voucherDetails), this.VoucherData);

    this.tripHeads.map(tripHead => {
      console.log('voucherDetails:', tripHead);
      let trips = [];
      let totalRowId = -1;
      this.trips.map(trip => {
        let tripRowId = -1;

        if (trip.isChecked) {
          let amount = 0;
          if (this.voucherDetails) {
            this.voucherDetails.map(voucherDetail => {
              if (voucherDetail.trip_id == trip.id && tripHead.id == voucherDetail.ledger_id) {
                tripRowId = voucherDetail.id;
                amount = voucherDetail.amount;
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
        }
      });

      tripHead.trips = trips;
      let total = 0;

      if (this.voucherDetails) {
        this.voucherDetails.map(voucherDetail => {
          if (tripHead.id == voucherDetail.ledger_id && voucherDetail.trip_id == 0) {
            totalRowId = voucherDetail.id;
            total = parseFloat(voucherDetail.amount);
          }
        });
      }

      console.log('-----------VoucherData:', this.VoucherData);
      this.VoucherData.map(voucherData => {
        if (voucherData.y_dlt_ledger_id == tripHead.id) {
          console.log('MATched', voucherData.y_dlt_ledger_id, tripHead.id, voucherData.y_dlt_amount)
          total = parseInt(voucherData.y_dlt_amount);
        }
      });
      console.log('Total:------', total);
      tripHead.total = total;
      tripHead.rowid = totalRowId;

      // let fuelFilings = [];
      // this.fuelFilings.map(fuelFiling => {
      //   if (fuelFiling.isChecked) {
      //     fuelFilings.push({ id: fuelFiling.id });
      //     this.storeids.push(fuelFiling.id);
      //   }
      // });
      // tripHead.fuelFilings = fuelFilings;
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
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError;
      });
  }


  addVoucher() {
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

    const voucherDetailArray = {
      foid: 123,
      customercode: this.custcode,
      remarks: this.narration,
      date: this.date,
      amountDetails: amountDetails,
      vouchertypeid: -151,
      y_code: '',
      xid: this.VoucherId
    };

    console.log('params 1 : ', voucherDetailArray);
    //this.common.loading++;
    this.updateVoucherTrip(voucherDetailArray, this.tripexpvoucherid);

    // this.api.post('Voucher/InsertVoucher', params)
    //   .subscribe(res => {
    //     this.common.loading--;
    //     console.log('return vouher id: ', res['data']);
    //     if (res['success']) {
    //       if (res['data'][0].save_voucher_v1) {
    //         this.updateVoucherTrip(res['data'][0].save_voucher_v1, this.tripexpvoucherid);
    //         this.common.showToast('Your Code :' + res['data'].code);
    //       } else {
    //         let message = 'Failed: ' + res['msg'] + (res['data'].code ? ', Code: ' + res['data'].code : '');
    //         this.common.showError(message);
    //       }
    //     }

    //   }, err => {
    //     this.common.loading--;
    //     console.log('Error: ', err);
    //     this.common.showError();
    //   });
  }

  updateVoucherTrip(voucherDetailArray, tripexpvoucherid) {
    let tripidarray = [];
    this.checkedTrips.map(tripHead => {
      tripidarray.push(tripHead.id);
    });
    console.log('trip id array ', this.fuelFilings);
    const params = {
      tripArrayId: tripidarray,
      vehid: this.VehicleId,
      voucher_details: this.tripHeads,
      storeid: this.storeids,
      tripExpVoucherId: tripexpvoucherid,
      // fuelFilings: this.fuelFilings
      fuelFilings: '',
      accDetail: this.accDetails,
      voucherArray: voucherDetailArray
    };

    this.common.loading++;
    this.api.post('TripExpenseVoucher/updateTripsForShortVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('return vouher id: ', res['data']);
        if (res['success']) {
          if (res['data']) {
            this.dismiss(true);
            //   this.activeModal.close({ status: status });
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
      this.tripHeads[index].total += parseFloat(trip.amount);
    });
    let total = 0;
    this.tripHeads.map(trip => {
      total += parseFloat(trip.total);
    });
    this.alltotal = total;
    this.netTotal = (this.driverTotal - this.alltotal);
    console.log('VoucherData: ', this.VoucherData);
  }

  calculateTripAllTotal(index) {
    this.alltotal = 0;
    this.tripHeads.map(trip => {
      this.alltotal += parseFloat(trip.total);
    });
    this.netTotal = (this.driverTotal - this.alltotal);
  }

  driverSum() {
    this.driverTotal = 0;
    this.accDetails.map(detail => {
      this.driverTotal += detail.detailamount;
    });
    this.netTotal = (this.driverTotal - this.alltotal);
  }

  dismiss(status) {
    this.activeModal.close({ status: status });
  }

  addDetails() {
    this.accDetails.push({
      detaildate: this.common.dateFormatternew(new Date()).split(' ')[0],
      detailamount: 0,
      detailramarks: '',
      detailLedger: {
        name: '',
        id: 0
      }
    });
  }

  callSaveVoucher() {
    if (this.accountService.selected.branch.id != 0) {
      this.addVoucher();
      event.preventDefault();
      return;
    } else {
      alert('Please Select Branch');
    }
  }

  addTrip() {
    let vehId = this.VehicleId;
    this.common.params = { vehId };
    const activeModal = this.modalService.open(AddTripComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data) {
        this.getPendingTrips();
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
    const activeModal = this.modalService.open(AddDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }
  getPendingTrips() {
    const params = {
      vehId: this.VehicleId
    };
    this.common.loading++;
    this.api.post('VehicleTrips/getPendingVehicleTrips', params)
      // this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        // console.log(res);
        this.common.loading--;
        // this.showTripSummary(res['data']);
        //this.flag=false;
        this.trips = res['data'];

        this.refreshAddTrip();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });

  }

  refreshAddTrip() {
    this.trips.map(trip => {
      this.tripsEditData.map(tripedit => {
        (trip.id == tripedit.id) ? trip.isChecked = true : '';
      })
    });
  }
  showTransfer() {
    let tripidarray = [];
    this.checkedTrips.map(tripHead => {
      tripidarray.push(tripHead.id);
    });
    if(tripidarray.length==0){
      this.common.showError('Please Select Trip');
      return false;
    }
    const params = {
      tripIdArray: tripidarray
    };
    this.common.loading++;
    this.api.post('VehicleTrips/tripTransfer', params)
      // this.api.post('VehicleTrips/getTripExpenceVouher', params)
      .subscribe(res => {
        this.transferData = [];
        this.transferHeading = [];
        this.common.loading--;
        if (res['data']) {
        this.transferData = res['data'];
          let first_rec = this.transferData[0];
          for (var key in first_rec) {
            //console.log('kys',first_rec[key]);
            this.transferHeading.push(key);
          }
        } else {
          this.transferData = [];
        }
        //this.refreshAddTrip();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }



  addTransfer(id) {
    // console.log("invoice", invoice);
    // this.common.params = { invoiceId:invoice._id }
    let refData = {
      refType: 14,
      refId: id
    };
    this.common.params = { refData: refData }
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      //this.viewTransfer();
    });
  }

  printTripDetail(){
    console.log('print functionality');
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data'], 'this.order');
        // this.Vouchers = res['data'];
        this.print(this.trips,res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  print(trip, companydata) {
    this.totalRevinue = 0;
   this.totalAdvance = 0;
    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;
    let rows1 = [];
    let rows2 = [];
    let rows3 = [];
    let rows4 = [];
    let rows6 = [];

    this.trips.map((tripDetail, index) => {
      if (tripDetail.isChecked) {
      rows1.push([
        { txt: index+1},
        { txt: tripDetail.start_name + ' -> ' + tripDetail.end_name || '' },
        { txt: this.common.changeDateformat(tripDetail.start_time) || '' },
        { txt: this.common.changeDateformat(tripDetail.end_time) || '' },
        { txt: (tripDetail.is_empty)? 'Yes':'No' || '' },
        { txt: tripDetail.lr_no || '' },
        { txt: tripDetail.revenue || '' },
        { txt: tripDetail.advance || '' },

      ]);
      if(tripDetail.revenue){
        this.totalRevinue += parseFloat(tripDetail.revenue);
        }
        if(tripDetail.advance){
        this.totalAdvance += parseFloat(tripDetail.advance);
        }
    }
    });

    if(this.vouchertype == -150){
    this.fuelFilings.map((fuelfill, index) => {
      rows2.push([
        { txt: index+1},
        { txt: fuelfill.name || '' },
        { txt: fuelfill.litres || '' },
        { txt: fuelfill.rate || '', align: 'left' },
        { txt: fuelfill.amount || '', align: 'left' },
        { txt: fuelfill.date || '' },
      ]);
    });
  }
  if(this.vouchertype == -150){
    this.tripHeads.map((tripHead, index) => {
      rows3.push([
        { txt: index+1},
        { txt: tripHead.name || '' },
        { txt: tripHead.total || '' },
        ...tripHead.trips.map((trip, index) => {
          return { txt: trip.amount || '' }
        })
        
      
      ]);
    });
  }else{
    this.tripHeads.map((tripHead, index) => {
      rows3.push([
        { txt: index+1},
        { txt: tripHead.name || '' },
        { txt: tripHead.total || '' },
      
      
      ]);
    });
  }
  rows3.push([
    { txt: ' ' },
    { txt: 'Total : ', align: 'left' },
    { txt:  this.alltotal },
  ]);
    this.transferData.map((detail, index) => {
    
      rows4.push([
        this.transferHeading.map((headingname)=>{
        { txt: detail.headingname || ''}
      })
      ]);
   
    });
    rows6.push([
      { txt: this.totalRevinue || '' },
      { txt: this.alltotal || '' },
      { txt: this.totalRevinue - (this.alltotal) || '' },



    ]);
let invoiceJson={};
     
  
   if(this.vouchertype == -151){
    invoiceJson = {
      headers: [
        { txt: companydata[0].foname, size: '22px', weight: 'bold' },
        { txt: companydata[0].addressline },
        { txt: cityaddress },
        { txt: 'Trip Detail', size: '20px', weight: 600, align: 'left' }
      ],
     
      details: [
        { name: 'Veh No : ', value: this.vehclename },     
        { name: 'Ref No : ', value: this.custcode },
        { name: 'Date : ', value: this.date },
        { name: 'Ledger : ', value: this.creditLedger.name }       
      ],
      tables: [{
        headings: [
          { txt: 'S.No' },
          { txt: 'Trip' },
          { txt: 'Start Date' },
          { txt: 'End Date' },
          { txt: 'Trip Empty' },
          { txt: 'LR No' },
          { txt: 'Revenue Amount' },
            { txt: 'Advance' },
        ],
        rows: rows1,
        name:'Trips Detail'
      },
      
      {
        headings: [
          { txt: 'S.No' },
          { txt: 'Head' },
          { txt: 'Total' },
        
        ],
        rows: rows3,
        name:'Trips Expence Detail'
      },


      // {
      //   headings: [
      //     { txt: 'Advise Type' },
      //     { txt: 'User Value' },
      //     { txt: 'Credit To' },
      //     { txt: 'Debit To' },
      //     {txt: 'Remarks'},
      //     {txt: 'Time'},
      //     {txt: 'Entry By'}
      //   ],
      //   rows: rows4,
      //   name:'Advance'
      // },
      {
        headings: [
          { txt: 'Revenue' },
          { txt: 'Expence' },
          { txt: 'Net Revenue' },
        ],
        rows: rows6,
        name: 'Revenue'
      }],
      signatures: ['Accountant', 'Approved By'],
      footer: {
        left: { name: 'Powered By', value: 'Elogist Solutions' },
        center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(), 'ddMMYYYY').split(' ')[0] },
        right: { name: 'Page No', value: 1 },
      },
      footertotal:[
         { name: 'Net Pay to Driver : ', value: this.alltotal -(this.totalAdvance) , size: '20px', weight: 600},
          { name: ' ', value: ' ' },
          { name: ' ', value: ' ' },
          { name: ' ', value: ' ' },
          { name: 'Remarks : ', value: this.narration },
      ]


    };
   }else{
    invoiceJson = {
      headers: [
        { txt: companydata[0].foname, size: '22px', weight: 'bold' },
        { txt: companydata[0].addressline },
        { txt: cityaddress },
        { txt: 'Trip(Short) Detail', size: '20px', weight: 600, align: 'left' }
      ],
     
      details: [
     
        { name: 'Ref No', value: this.custcode },
        { name: 'Date', value: this.date },
        { name: 'Ledger', value: this.creditLedger.name }       
      ],
      tables: [{
        headings: [
          { txt: 'S.No' },
          { txt: 'Start Location' },
          { txt: 'End Location' },
          { txt: 'Start Date' },
          { txt: 'End Date' },
          { txt: 'Trip Empty' },
          { txt: 'LR No.' },
        ],
        rows: rows1,
        name:'Trip Details'

      },
      {
        headings: [
          { txt: 'S.No' },
          { txt: 'Station Name' },
          { txt: 'Quantity' },
          { txt: 'Rate' },
          { txt: 'Amount' },
          { txt: 'Date' },
        ],
        rows: rows2,
        name:'Trip Fuel Fillings'
      },
      {
        headings: [
          { txt: 'S.No' },
          { txt: 'Head' },
          { txt: 'Total' },
         ...this.checkedTrips.map((checkname)=>{
          return {txt: checkname.start_name +'-'+ checkname.end_name}
         })
        ],
        rows: rows3,
        name:'Trips Expence Detail'

      },
      {
        headings: [
          { txt: 'Advise Type' },
          { txt: 'User Value' },
          { txt: 'Credit To' },
          { txt: 'Debit To' },
          {txt: 'Remarks'},
          {txt: 'Time'},
          {txt: 'Entry By'}
        ],
        rows: rows4,
        name:'Advance'
      }],
      signatures: ['Accountant', 'Approved By'],
      footer: {
        left: { name: 'Powered By', value: 'Elogist Solutions' },
        center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(),'ddMMYYYY').split(' ')[0] },
        right: { name: 'Page No', value: 1 },
      },
      footertotal:[
        {   name:'total',value:this.alltotal},
         {  name:'Remarks',value:this.narration},
      ]


    };
   }
 
  

    console.log('JSON', invoiceJson);

    localStorage.setItem('InvoiceJSO', JSON.stringify(invoiceJson));
    this.printService.printInvoice(invoiceJson, 2);

  }
  getTripFreght() {
    // console.log('voucher id last ', voucherId)
    // const params = {
    //   voucherId: voucherId,
    // };

    let tripidarray = [];
    this.checkedTrips.map(tripHead => {
      tripidarray.push(tripHead.id);
    });
    const params = {
      voucherId: tripidarray
    };
    this.common.loading++;
    this.api.post('TripExpenseVoucher/getTripFreghtDetails', params)
      .subscribe(res => {
        console.log('trip freght exp', res);
        this.common.loading--;
        this.tripFreghtDetails = res['data'];
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
  }
}