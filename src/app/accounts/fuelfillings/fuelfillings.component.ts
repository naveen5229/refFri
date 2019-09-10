import { Component, OnInit ,HostListener} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewListComponent } from '../../modals/view-list/view-list.component';
import { FuelfilingComponent } from '../../acounts-modals/fuelfiling/fuelfiling.component';
import { AccountService } from '../../services/account.service';
import { AddFuelFillingComponent } from '../../modals/add-fuel-filling/add-fuel-filling.component';
import { log } from 'util';
import { EditFillingComponent } from '../../../app/modals/edit-filling/edit-filling.component';


@Component({
  selector: 'fuelfillings',
  templateUrl: './fuelfillings.component.html',
  styleUrls: ['./fuelfillings.component.scss']
})
export class FuelfillingsComponent implements OnInit {

  trips = [];
  regno = '';
  fuelstation = '';
  checkedTrips = [];
  fuelFilings = [];
  tripHeads = [];
  tripVouchers = [];
  selectedVehicle;
  selectedFuelFilling;
  vehicles = [];
  flag = false;
  enddate = this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
  startdate = this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }
  constructor(
    public api: ApiService,
    public common: CommonService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.common.currentPage = 'Fuel Voucher';
  }

  ngOnInit() {
  }

  getVehicle(vehicle) {
    this.selectedVehicle = vehicle;
    this.flag = true;
    this.getTripSummary();

  }

  getFuelFilling(station) {
    console.log('fuel fillin', station);
    this.selectedFuelFilling = station;
    // this.flag = true;
    // this.getTripSummary();

  }

  getFuelVoucher() {

    const params = {
      vehId: (this.selectedVehicle) ? this.selectedVehicle.id : 0,
      lastFilling: this.startdate,
      currentFilling: this.enddate,
      fuelstationid: (this.selectedFuelFilling) ? this.selectedFuelFilling.id : 0
    };
    this.common.loading++;
    this.api.post('FuelDetails/getFuelVoucher', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        //  this.showTripSummary(res['data']);
        //this.flag=false;
        this.trips = res['data'];
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });

  }

  getDataFuelFillings() {
    if (this.accountService.selected.branch.id) {
    console.log('params model', this.common.params);
    if(this.selectedVehicle && (this.selectedVehicle.id !=0)){
      if(this.selectedFuelFilling && (this.selectedFuelFilling.id !=0)){
    let fuelstatinid = (this.selectedVehicle) ? this.selectedVehicle.id : 0;
    const params = {
      vehId: (this.selectedVehicle) ? this.selectedVehicle.id : 0,
      lastFilling: this.startdate,
      currentFilling:this.enddate,
      fuelstationid: (this.selectedFuelFilling) ? this.selectedFuelFilling.id : 0
    };
    this.common.loading++;
    this.api.post('Fuel/getFeulfillings', params)
      .subscribe(res => {
        console.log('fuel data', res['data']);
        this.common.loading--;
        if(res['data'].length){
        this.fuelFilings = res['data'];
        this.getFuelFillings( res['data']);
        }else {
          this.common.showError('please Select Correct date');
        }
        // this.getHeads();
      }, err => {
        console.log(err);
        this.common.loading--;
        this.common.showError();
      });
    }
    else{
      this.common.showError('Please Select Fuel Station');
    }
  }else{
      this.common.showError('Please Select Vehicle');
      }
    }else{
      this.common.showError('Please Select branch');
    }
  }
  

  checkedAllSelected() {
    this.checkedTrips = [];
    for (let i = this.findFirstSelectInfo('index'); i <= this.findLastSelectInfo('index'); i++) {
      this.trips[i]['isChecked'] = true;
      this.checkedTrips.push(this.trips[i]);
    }
  }

  getFuelFillings(fuelData) {
    if (this.accountService.selected.branch.id) {
      console.log('Branch ID :', this.accountService.selected.branch.id);
      this.common.params = {
        vehId: this.selectedVehicle.id,
        lastFilling: this.startdate,
        currentFilling: this.enddate,
        fuelstationid: this.selectedFuelFilling,
        fuelData:fuelData
      };

      const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
         console.log('Data return: ', data);
        if (data.success) {
          this.getFuelVoucher();
        }
      });
    }
    else {
      this.common.showError('Please Select Branch');
    }
  }
  // getFuelFillings() {
  //   const params = {
  //     vehId: this.selectedVehicle.id,
  //     lastFilling: this.startdate,
  //     currentFilling: this.enddate
  //   };
  //   this.common.loading++;
  //   this.api.post('FuelDetails/getFillingsBwTime', params)
  //     .subscribe(res => {
  //       console.log('fuel data', res);
  //       this.common.loading--;
  //       this.fuelFilings = res['data'];
  //       // this.getHeads();
  //     }, err => {
  //       console.log(err);
  //       this.common.loading--;
  //       this.common.showError();
  //     });
  // }
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


  addFuel() {
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
    //this.common.handleModalSize('class', 'modal-lg', '1150');

    });
    // let vehId = this.selectedVehicle.id;
    // this.common.params = { vehId };
    // const activeModal = this.modalService.open(AddFuelFillingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   // console.log('Data: ', data);
    //   if (data.response) {
    //     //this.addLedger(data.ledger);
    //   }
    // });
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
 
 


  openVoucherEdit(voucherdata) {
    console.log('testing issue solved');
    this.common.params = {
      voucherdata: voucherdata,
      vehId: voucherdata.y_vehicle_id,
      lastFilling: this.startdate,
      currentFilling: this.enddate,
      fuelstationid: voucherdata.y_fuel_station_id
    };

    // const activeModal = this.modalService.open(FuelfilingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   if (data.response) {
    //     this.getFuelVoucher();
    //   }
    // });

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
      },
        err => {
          this.common.loading--;
          this.common.showError();
        })
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
   let activeId = document.activeElement.id;
    console.log('Active event 1111', event, activeId);

  }
}