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
import { TransferReceiptsComponent } from '../../modals/FreightRate/transfer-receipts/transfer-receipts.component';
import { EditFillingComponent } from '../../../app/modals/edit-filling/edit-filling.component';
import { PrintService } from '../../services/print/print.service';

@Component({
  selector: 'voucher-summary',
  templateUrl: './voucher-summary.component.html',
  styleUrls: ['./voucher-summary.component.scss']
})
export class VoucherSummaryComponent implements OnInit {
  firstdate = '';
  enddate = '';
  permanentDeleteId = 0;
  sizeIndex = 0;
  isReadonly = false;
  alltotal = 0;
  approve = 0;
  targetId = '';
  narration = '';
  tripVoucher;
  typeFlag = 2;
  totalRevinue=0;
  totalAdvance=0;
  totalFuel=0;
  selectedRow = -1;
  trips;
  vouchertype = -150;
  vehclename = '';
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
  totalTrip = [];
  tripFreghtDetails = [];
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
  transferData = [];
  transferHeading = [];
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
    private printService: PrintService,
    private activeModal: NgbActiveModal) {
    console.log('________________PARAMS___________', this.common.params);
    if (this.VoucherId == 0) {
      console.log('add again', this.VoucherId);
      this.trips = this.common.params.tripDetails;
    }
    if (this.common.params.sizeIndex) {
      this.sizeIndex = this.common.params.sizeIndex;
    }
    if (this.common.params.endDate) {
      this.firstdate = this.common.params.firstDate;
      this.enddate = this.common.params.endDate;
    }

    this.permanentDeleteId = (this.common.params.permanentDelete) ? this.common.params.permanentDelete : 0;
    if (this.common.params.typeFlag) { this.typeFlag = this.common.params.typeFlag; }
    this.VehicleId = this.common.params.vehId;
    this.vehclename = this.common.params.vehname
    console.log('tripsEditData', this.tripsEditData);
    console.log('trips data', this.trips);
    console.log(this.common.params.vehId);
    console.log('111 VoucherData', this.common.params.VoucherData);
    console.log('tripPendingDataSelected', this.common.params.tripPendingDataSelected);

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
      this.alltotal = parseFloat(this.tripVoucher.y_amount);
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
      this.getTripFreght();
      this.tripexpvoucherid = this.tripVoucher.y_id;
      this.VoucherData = this.common.params.VoucherData;

      this.showTransfer();
    }

    this.common.handleModalSize('class', 'modal-lg', '1150', 'px', this.sizeIndex);
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
        this.activeModal.close({ response: true, delete: 'true' });
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
            end_name: trip.end_name,
            lr_no: trip.lr_no
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

    console.log('trip head last show data', this.tripHeads);
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
      voucherArray: voucherDetailArray

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
    this.alltotal =  total;
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

    console.log('vech id first', vehId);
    this.common.params = { vehId, vehclename };
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
    let rowfilling = {
      fdate: null,
      litres: null,
      is_full: null,
      regno: null,
      rate: null,
      amount: null,
      pp: null,
      fuel_station_id: null,
      vehicle_id: null,
      id: null,
      ref_type: null,
      ref_id: null,
    };
    this.common.params = { rowfilling, title: 'Add Fuel Filling' };
    const activeModal = this.modalService.open(EditFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        // window.location.reload();
      }
      this.common.handleModalSize('class', 'modal-lg', '1150', 'px', this.sizeIndex);

    });
    // let vehId = this.VehicleId;
    // this.common.params = { vehId };
    // const activeModal = this.modalService.open(AddFuelFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   // console.log('Data: ', data);
    //   if (data.response) {
    //     //this.addLedger(data.ledger);
    //   }
    // });
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

  addTransfer() {
    // console.log("invoice", invoice);
    // this.common.params = { invoiceId:invoice._id }
    this.common.params = { refData: null };
    const activeModal = this.modalService.open(TransferReceiptsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      //this.viewTransfer();
    });
  }

  showTransfer() {
    let tripidarray = [];
    this.checkedTrips.map(tripHead => {
      tripidarray.push(tripHead.id);
    });
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

  printTripDetail() {
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
        this.print(this.trips, res['data']);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  print(trip, companydata) {

    let remainingstring1 = (companydata[0].phonenumber) ? ' Phone Number -  ' + companydata[0].phonenumber : '';
    let remainingstring2 = (companydata[0].panno) ? ', PAN No -  ' + companydata[0].panno : '';
    let remainingstring3 = (companydata[0].gstno) ? ', GST NO -  ' + companydata[0].gstno : '';

    let cityaddress = remainingstring1 + remainingstring2 + remainingstring3;
    let rows1 = [];
    let rows2 = [];
    let rows3 = [];
    let rows4 = [];
    let rows5 = [];
    console.log('trip check data', this.trips);
    this.trips.map((tripDetail, index) => {
      if (tripDetail.isChecked) {
        rows1.push([
          { txt: index + 1 },
          { txt: tripDetail.start_name + '-' + tripDetail.end_name || '' },
          { txt: tripDetail.start_time || '' },
          { txt: tripDetail.end_time || '' },
          { txt: (tripDetail.is_empty) ? 'Yes' : 'No' || '' },
          { txt: tripDetail.lr_no || '' },
          { txt: tripDetail.revenue || '' },
          { txt: tripDetail.totalAdvance || '' },
        ]);
        if(tripDetail.revenue){
        this.totalRevinue += parseFloat(tripDetail.revenue);
        }
        if(tripDetail.totalAdvance){
        this.totalAdvance += parseFloat(tripDetail.totalAdvance);
        }
      }
    });

    if (this.vouchertype == -150) {
      this.fuelFilings.map((fuelfill, index) => {
        rows2.push([
          { txt: index + 1 },
          { txt: fuelfill.name || '' },
          { txt: fuelfill.litres || '' },
          { txt: fuelfill.rate || '', align: 'left' },
          { txt: fuelfill.amount || '', align: 'left' },
          { txt: fuelfill.date || '' },
        ]);
        this.totalFuel += parseFloat(fuelfill.amount);
      });
    }

    this.tripHeads.map((tripHead, index) => {
      rows3.push([
        { txt: index + 1 },
        { txt: tripHead.name || '' },
        ...tripHead.trips.map((trip, indexSecond) => {
          if (trip.amount > 0) {
            if (this.totalTrip[indexSecond]) {
              this.totalTrip[indexSecond] = parseFloat(this.totalTrip[indexSecond]) + parseFloat(trip.amount);
            } else {
              this.totalTrip[indexSecond] = parseFloat(trip.amount);
            }
          }
          return { txt: trip.amount || '' }

        })


      ]);

    });
    console.log('test total', this.totalTrip);
    rows3.push([
      { txt: ' ' },
      { txt: 'Total - ' + this.alltotal },
      ...this.totalTrip.map((tTotal) => {
        return { txt: tTotal || '' }
      })
    ]);
    console.log('rows 3', rows3);


    // this.transferData.map((detail, index) => {
    //     console.log('first data',detail);
    //   rows4.push([
    //     ...this.transferHeading.map((headingname) => {
    //     console.log('second data',headingname);
    //      return { txt: detail[headingname] || '' }
    //     })
    //   ]);

    // });

    this.tripFreghtDetails.map((tripHead, index) => {
      rows5.push([
        { txt: index + 1 },
        { txt: tripHead.receipt_no || '' },
        { txt: tripHead.auto_amount || '' },
        { txt: tripHead.remarks || '' }



      ]);

    });
    console.log('rows4', rows4);
    let invoiceJson = {};


    if (this.vouchertype == -151) {
      invoiceJson = {
        headers: [
          { txt: companydata[0].foname, size: '22px', weight: 'bold' },
          { txt: companydata[0].addressline },
          { txt: cityaddress },
          { txt: 'Trip Detail', size: '20px', weight: 600, align: 'left' }
        ],

        details: [
          { name: 'Veh No', value: this.vehclename },
          { name: 'Ref No', value: this.custcode },
          { name: 'Date', value: this.date },
          { name: 'Ledger', value: this.creditLedger.name }
        ],
        tables: [{
          headings: [
            { txt: 'S.No' },
            { txt: 'Trip' },
            { txt: 'Start Date' },
            { txt: 'End Date' },
            { txt: 'Trip Empty' },
            { txt: 'LR No.' },
            { txt: 'Revenue Amount' },
            { txt: 'Advance' },
          ],
          rows: rows1,
          name: 'Trips Detail'
        },

        {
          headings: [
            { txt: 'S.No' },
            { txt: 'Head' },
            ...this.trips.filter(checkname => {
              console.log('__________________________________________:', checkname);
              if (checkname.isChecked) return true; return false
            }).map((checkname, index) => {
              return { txt: 'LR No :' + checkname.lr_no || 'S.No' + index + 1 }
            })
          ],
          rows: rows3,
          name: 'Trips Expence Detail'
        },
          // {
          //   headings: [
          //     { txt: 'Advise Type' },
          //     { txt: 'User Value' },
          //     { txt: 'Credit To' },
          //     { txt: 'Debit To' },
          //     { txt: 'Remarks' },
          //     { txt: 'Time' },
          //     { txt: 'Entry By' }
          //   ],
          //   rows: rows4,
          //   name: 'Advance'
          // },
          // {
          //   headings: [
          //     { txt: 'Reciept No' },
          //     { txt: 'Revenue' },
          //     { txt: 'Remarks' }
          //   ],
          //   rows: rows5,
          //   name: 'Revenue'
          // }
        ],
        signatures: ['Accountant', 'Approved By'],
        footer: {
          left: { name: 'Powered By', value: 'Elogist Solutions' },
          center: { name: 'Printed Date', value: '06-July-2019' },
          right: { name: 'Page No', value: 1 },
        },
        footertotal: [
          { name: 'total', value: this.alltotal },
          { name: 'Remarks', value: this.narration },
        ]


      };
    } else {
      invoiceJson = {
        headers: [
          { txt: companydata[0].foname, size: '22px', weight: 'bold' },
          { txt: companydata[0].addressline },
          { txt: cityaddress },
          { txt: 'Trip Detail', size: '20px', weight: 600, align: 'left' }
        ],

        details: [

          { name: 'Veh No', value: this.vehclename },
          { name: 'Ref No', value: this.custcode },
          { name: 'Date', value: this.date },
          { name: 'Ledger', value: this.creditLedger.name }
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
          name: 'Trip Details'

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
          name: 'Trip Fuel Fillings'
        },
        {
          headings: [
            { txt: 'S.No' },
            { txt: 'Head' },
            ...this.trips.filter(checkname => {
              console.log('__________________________________________:', checkname);
              if (checkname.isChecked) return true; return false
            }).map((checkname, index) => {
              return { txt: 'LR No :' + checkname.lr_no || 'S.No' + index + 1 }
            })
          ],
          rows: rows3,
          name: 'Trips Expence Detail'

        },
          // {
          //   headings: [
          //     { txt: 'Advise Type' },
          //     { txt: 'User Value' },
          //     { txt: 'Credit To' },
          //     { txt: 'Debit To' },
          //     { txt: 'Remarks' },
          //     { txt: 'Time' },
          //     { txt: 'Entry By' }
          //   ],
          //   rows: rows4,
          //   name: 'Advance'
          // },
          // {
          //   headings: [
          //     { txt: 'Reciept No' },
          //     { txt: 'Revenue' },
          //     { txt: 'Remarks' }
          //   ],
          //   rows: rows5,
          //   name: 'Revenue'
          // }
        ],
        signatures: ['Accountant', 'Approved By'],
        footer: {
          left: { name: 'Powered By', value: 'Elogist Solutions' },
          center: { name: 'Printed Date', value: this.common.dateFormatternew(new Date(), 'ddMMYYYY').split(' ')[0] },
          right: { name: 'Page No', value: 1 },
        },
        footertotal: [
          { name: 'Net Pay to Driver', value: this.alltotal -(this.totalRevinue+ this.totalAdvance) },
          { name: ' ', value: ' ' },
          { name: 'Total Revenue : ', value: this.totalRevinue - (this.alltotal + this.totalFuel) },
          { name: 'Remarks : ', value: this.narration },
        ]


      };
    }



    console.log('JSON', invoiceJson);

    localStorage.setItem('InvoiceJSO', JSON.stringify(invoiceJson));
    this.printService.printInvoice(invoiceJson, 2);

  }


}
