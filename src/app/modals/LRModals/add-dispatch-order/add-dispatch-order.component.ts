import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AccountService } from '../../../services/account.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dateFieldName } from '@telerik/kendo-intl';
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';
import { ChangeDriverComponent } from '../../DriverModals/change-driver/change-driver.component';
import { BasicPartyDetailsComponent } from '../../basic-party-details/basic-party-details.component';

@Component({
  selector: 'add-dispatch-order',
  templateUrl: './add-dispatch-order.component.html',
  styleUrls: ['./add-dispatch-order.component.scss']
})
export class AddDispatchOrderComponent implements OnInit {
  vehicleType = 1;
  dispatchOrderField = [];
  generalDetailColumn2 = [];
  generalDetailColumn1 = [];
  disOrder = {
    date: new Date(),
    id: null,
    prefix: null,
    serial: null
  };
  vehicleData = {
    regno: null,
    id: null
  };

  driverData = {
    id: null,
    mobileNo: null
  }

  btnTxt = 'SAVE';
  keepGoing = true;

  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1000');

    console.log("dispatchOrderData", this.common.params.dispatchOrderData);
    if (this.common.params.dispatchOrderData) {
      this.disOrder.id = this.common.params.dispatchOrderData.id ? this.common.params.dispatchOrderData.id : null;
    }
    if (this.disOrder.id || this.accountService.selected.branch.id) {
      this.getDispatchOrderFields(true);
    }
    this.formatGeneralDetails();
  }

  ngOnInit() {
  }

  getDispatchOrderFields(isSetBranchId?) {
    this.disOrder.id = this.disOrder.id ? this.disOrder.id : null;
    let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
    let params = "branchId=" + this.accountService.selected.branch.id +
      "&dispatchOrderId=" + this.disOrder.id;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getDispatchOrderFields?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'] && res['data'].result) {
          this.dispatchOrderField = res['data'].result[0];
          let headData = res['data'].headings;
          if (headData.length > 0) {
            this.setLrHeadData(headData[0], isSetBranchId);
          }
          this.formatGeneralDetails();
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  setLrHeadData(headData, isSetBranchId?) {
    console.log("head data", headData)
    this.vehicleData.id = headData.vehicle_id;
    this.vehicleData.regno = headData.regno;
    this.vehicleType = headData.veh_asstype;
    this.disOrder.id = headData.dispatch_id;
    this.disOrder.date = headData.dispatch_date ? new Date(headData.dispatch_date) : null;
    isSetBranchId && (this.accountService.selected.branch.id = headData.branch_id);
    // this.accountService.selected.branch.id = headData.branch_id;
    this.disOrder.prefix = headData.prefix;
    this.disOrder.serial = headData.autonum;

  }

  takeActionSource(type, res, i) {
    console.log("here", type, res, i, "this.generalDetailColumn1", this.generalDetailColumn1, "this.generalDetailColumn2", this.generalDetailColumn2);
    setTimeout(() => {
      if (type == 'generalDetailColumn1') {
        this.generalDetailColumn1[i].r_value = this.generalDetailColumn1[i].r_value ? this.generalDetailColumn1[i].r_value : '-------';
        if (this.keepGoing && this.generalDetailColumn1[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.generalDetailColumn1[i].r_value = res.location.name;
              this.generalDetailColumn1[i].r_valueid = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
      else if (type == 'generalDetailColumn2') {
        this.generalDetailColumn2[i].r_value = this.generalDetailColumn2[i].r_value ? this.generalDetailColumn2[i].r_value : '-------';
        if (this.keepGoing && this.generalDetailColumn2[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.generalDetailColumn2[i].r_value = res.location.name;
              this.generalDetailColumn2[i].r_valueid = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
    }, 1000);

  }
  getVehicleInfo(vehicle) {
    console.log("vehicle", vehicle);
    this.vehicleData.regno = vehicle.regno;
    this.vehicleData.id = vehicle.id;
    this.getDriverData(this.vehicleData.id);
  }




  // resetDriver(){

  //   this.driverData.id =null;
  //     this.driverData.mobileNo=null;
  //     this.
  //   }



  resetVehicleData() {
    console.log("Test");
    this.vehicleData.id = null;
    this.vehicleData.regno = null;
    this.resetDriverInfo();
  }

  getDriverData(vehicleId) {
    let params = {
      vid: vehicleId ? vehicleId : this.vehicleData.id
    };
    console.log("vehicleId 2", params);
    this.common.loading++;
    this.api.post('Drivers/getDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.getDriverInfo(res['data'][0], true);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  resetDriverInfo() {
    this.dispatchOrderField.map(dispatchField => {
      if (dispatchField.r_colname == 'driver_name') {
        dispatchField.r_value = null;
        dispatchField.r_valueid = null;
        (<HTMLInputElement>document.getElementById('driver_mobile')).value = null;
      }
    });
  }

  //lrOrderField To dispatchOrderField
  getDriverInfo(driver, arr?: any) {
    if (arr && arr === true) {
      this.dispatchOrderField.map(dispatchField => {
        if (dispatchField.r_colname == 'driver_name') {
          dispatchField.r_value = '';
          dispatchField.r_value = driver.empname;
          dispatchField.r_valueid = driver.id ? driver.id : driver.driver_id;
        }
      });
    } else if (arr) {
      arr.r_value = '';
      arr.r_value = driver.empname;;
      arr.r_valueid = driver.id ? driver.id : driver.driver_id;
    }
    this.driverData.id = driver.id ? driver.id : driver.driver_id;
    // (<HTMLInputElement>document.getElementById('driver_id')).value = this.driverData.id;
    (<HTMLInputElement>document.getElementById('driver_mobile')).value = driver.mobileno;
  }



  closeModal() {
    this.activeModal.close(true);
  }

  formatGeneralDetails() {
    console.log("dispatchOrderField", this.dispatchOrderField);
    this.generalDetailColumn2 = [];
    this.generalDetailColumn1 = [];
    this.dispatchOrderField.map(dd => {
      if (dd.r_coltype == 3) {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_fixedvalues) {
        dd.r_fixedvalues = JSON.parse(dd.r_fixedvalues);
      }
      if (dd.r_colorder % 2 == 0) {
        this.generalDetailColumn2.push(dd);
      } else {
        this.generalDetailColumn1.push(dd);
      }
    });
    console.log("generalDetailColumn2", this.generalDetailColumn2);
    console.log("generalDetailColumn1", this.generalDetailColumn1);
  }

  saveDetails() {

    ++this.common.loading;
    let params = {
      dispatchOrderId: this.disOrder.id,
      branchId: this.accountService.selected.branch.id,
      vehicleId: this.vehicleData.id,
      dispatchOrderPrefix: this.disOrder.prefix,
      dispatchOrderSerial: this.disOrder.serial,
      vehicleRegNo: document.getElementById('vehicleno')['value'],
      date: this.common.dateFormatter(this.disOrder.date),
      dispatchOrderDetails: JSON.stringify(this.dispatchOrderField),
      vehicleType: this.vehicleType
    }
    console.log("params", params);


    this.api.post('LorryReceiptsOperation/saveDispatchOrders', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('response :', res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Successfully Added");
          this.closeModal();

        } else {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }
  addDriver() {
    this.common.params = { vehicleId: null, vehicleRegNo: null };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      if (data.data) {
      }
    });
  }

  addAssociation() {
    console.log("open Association modal")
    this.common.params = {
      cmpId: 1,
    };
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

}
