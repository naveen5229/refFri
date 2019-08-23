import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTripComponent } from '../../modals/add-trip/add-trip.component';
import { AddFuelFillingComponent } from '../../modals/add-fuel-filling/add-fuel-filling.component';
import { AddDriverComponent } from '../../driver/add-driver/add-driver.component';
import { AccountService } from '../../services/account.service';
import { DateService } from '../../services/date.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';


@Component({
  selector: 'voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.scss']
})
export class VoucherSummaryComponent implements OnInit {
  permanentDeleteId = 0;
  sizeIndex=0;
  isReadonly = false;
  alltotal = 0;
  approve = 0;
  targetId = '';
  narration = '';
  tripVoucher;
  typeFlag = 2;
  selectedRow = -1;
  trips;
  vehclename='';
  ledgers = [];
  debitLedgerdata = [];
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  VehicleId;
  VoucherId = 0;
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
  tripsEditData = [];
  storeids = [];
  VoucherData = [];
  date = this.common.dateFormatternew(new Date()).split(' ')[0];
  custcode = '';
  checkall = false;
  activeId = 'creditLedger';
  tripexpvoucherid = 0;
  voucherDetails = null;
  driverTotal = 0;
  netTotal = 0;
  diverledgers = [];
  accDetails = [{
    detaildate: this.common.dateFormatternew(new Date()).split(' ')[0],
    detailamount: 0,
    detailramarks: '',
    detailLedger: {
      name: '',
      id: 0
    }

  }];
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public accountService: AccountService,
    private activeModal: NgbActiveModal) {
    console.log('________________PARAMS___________', this.common.params);
    if (this.VoucherId == 0) {
      console.log('add again', this.VoucherId);
      this.trips = this.common.params.tripDetails;
    }
    if(this.common.params.sizeIndex) {
      this.sizeIndex=this.common.params.sizeIndex;
    }
    this.permanentDeleteId = (this.common.params.permanentDelete) ? this.common.params.permanentDelete : 0;
    if (this.common.params.typeFlag) { this.typeFlag = this.common.params.typeFlag; }
    this.VehicleId = this.common.params.vehId;
   this.vehclename =this.common.params.vehname
    console.log('tripsEditData', this.tripsEditData);
    console.log('trips data', this.trips);
    console.log(this.common.params.vehId);
    console.log('111 VoucherData', this.common.params.VoucherData);
    console.log('tripPendingDataSelected', this.common.params.tripPendingDataSelected);

    if (this.common.params.tripVoucher) {
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
      this.getFuelFillingsEditTime(
        this.tripVoucher.startdate,
        this.tripVoucher.enddate,
        this.common.params.tripPendingDataSelected
      );
      this.getVoucherDetails(this.tripVoucher.y_id);
      this.tripexpvoucherid = this.tripVoucher.y_id;
      this.VoucherData = this.common.params.VoucherData;
    }

    this.common.handleModalSize('class', 'modal-lg', '1150','px',this.sizeIndex);
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
        this.common.showToast(" This Value Has been Deleted!");
        this.common.loading--;
        this.activeModal.close({ response: true });
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
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
   
    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.trips.length) {
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.trips.length - 1) this.selectedRow++;
    //  event.preventDefault();
      event.stopPropagation();
    }
  }

  onSelected(selectedData, type, display) {
    console.log('selected data', selectedData);
    this.creditLedger.name = selectedData.y_ledger_name;
    this.creditLedger.id = selectedData.y_ledger_id;
    console.log('Accounts User: ', this.creditLedger);
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
        this.activeModal.close({ response: true });
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


  getFuelFillingsEditTime(lastFilling?, currentFilling?, selectedData?) {
    console.log(this.findFirstSelectInfo(), this.findLastSelectInfo());
    const params = {
      vehId: this.VehicleId,
      lastFilling: lastFilling || this.findFirstSelectInfo(),
      currentFilling: currentFilling || this.findLastSelectInfo()
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        console.log('fuelFiling Edit data', res);
        this.common.loading--;
        this.fuelFilings = res['data'] || [];
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
      currentFilling: currentFilling || this.findLastSelectInfo()
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

      this.VoucherData.map(voucherData => {
        if (voucherData.y_dlt_ledger_id == tripHead.id) {
          total = parseInt(voucherData.y_dlt_amount);
        }
      });

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
      vouchertypeid: -150,
      y_code: '',
      xid: this.VoucherId
    };

    console.log('params 1 : ', voucherDetailArray);
   // this.common.loading++;
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
      fuelFilings: this.fuelFilings,
      accDetail: this.accDetails,
      voucherArray:voucherDetailArray

    };

    this.common.loading++;
    this.api.post('TripExpenseVoucher/updateTripsForVoucher', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('return vouher id: ', res['data']);
        if (res['data']) {
          if (res['data'][0]['save_tripexp_voucher_v1']) {
            this.common.showToast(res['data']['code']);
            this.dismiss(true);
           // this.activeModal.close({ status: true });
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
    let flag = 0;
    let totalflag = 0;
    this.tripHeads[index].trips.map(trip => {
      this.tripHeads[index].total += parseFloat(trip.amount);
      totalflag++;
      if (trip.amount != 0) {
        flag++;
      }
    });

    if (totalflag == flag) {
      // this.isReadonly+'-'+index = 'true'
    }

    let total = 0;
    this.tripHeads.map(trip => {
      total += parseFloat(trip.total);
    });
    this.alltotal = total;
    console.log('VoucherData: ', this.VoucherData);
  }

  calculateTripAllTotal(index) {
    this.alltotal = 0;
    this.tripHeads.map(trip => {
      this.alltotal += parseFloat(trip.total);
    });
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
    let vehclename = this.vehclename;
   
    console.log('vech id first',vehId);
    this.common.params = { vehId , vehclename};
    const activeModal = this.modalService.open(AddTripComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data5555555: ', data);
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
    this.selectedRow = 0;
  }

  isItReadOnly(tripHead, id) {
    let amount = tripHead.trips.reduce((total, trip) => {
      //console.log('TYPE:', typeof trip.amount);
      let amount = trip.amount;
      if (typeof amount == 'string') {
        amount = parseFloat(amount);
      }
      return total + amount;
    }, 0);

   // console.log('Amount:', amount);
    if (document.activeElement.id == id) {
      return false;
    } else if (amount == 0) {
      return false;
    }
    return true;
  }

}
