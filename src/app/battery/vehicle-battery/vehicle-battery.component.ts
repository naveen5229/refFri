import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-battery',
  templateUrl: './vehicle-battery.component.html',
  styleUrls: ['./vehicle-battery.component.scss']
})
export class VehicleBatteryComponent implements OnInit {

  refmode = "701";
  vehicleBattery = [
    {
      refmode: "701",
      refid: null,
      batteryId: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      details: null,
    },
    // {
    //   refmode: "701",
    //   refid: null,
    //   batteryId: null,
    //   date: (this.common.dateFormatter(new Date())).split(' ')[0],
    //   details: null,
    // },
    // {
    //   refmode: "701",
    //   refid: null,
    //   batteryId: null,
    //   date: (this.common.dateFormatter(new Date())).split(' ')[0],
    //   details: null,
    // },
    // {
    //   refmode: "701",
    //   refid: null,
    //   batteryId: null,
    //   date: (this.common.dateFormatter(new Date())).split(' ')[0],
    //   details: null,
    // },
  ]
  vehicleNo = "";
  vehicleId = null;
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.common.refresh = this.refresh.bind(this);
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }

  getDate(index) {
    this.common.params = { ref_page: "Tyre Inputs", date: this.vehicleBattery[index].date };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.vehicleBattery[index].date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.vehicleBattery[index].date);
    });
  }
  getBatteryDetails(batteryDetails, index) {
    this.vehicleBattery[index].batteryId = batteryDetails.id;
    // this.vehicleBattery[index].batteryNo = batteryDetails.batterynum;
    this.getBatteryCurrentStatus(this.vehicleBattery[index].batteryId, index)
  }
  getvehicleData(vehicleDetails, i) {
    this.vehicleBattery[i].refid = vehicleDetails.id;
    this.vehicleId = vehicleDetails.id;
    console.log('refid', vehicleDetails);
    28795
  }
  resetVehDetails() {
    // this.vehicleBattery[i].refmode = ref;
    // console.log('ref', ref, i)
    // this.vehicleNo = "";
    // this.vehicleId = null;
  }

  addMore() {
    this.vehicleBattery.push({
      refmode: "701",
      refid: null,
      batteryId: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
      details: null,
    });
  }

  saveDetails() {
    if (!this.vehicleId) {
      this.common.showError("Please Select Vehicle");
    } else {
      this.common.loading++;
      let params = {
        // refMode: this.refMode,
        vehicleBattery: JSON.stringify(this.vehicleBattery),
      };
      console.log('Params:', params);

      this.api.post('Battery/saveBatteryMappingWrtVeh', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("return id ", res['data'][0].r_id);
          if (res['data'][0].r_id > 0) {
            console.log("sucess");
            this.common.showToast("sucess");
            //this.getMappedTyres();
          } else {
            console.log("fail");
            this.common.showError(res['data'][0].r_msg);
          }
        }, err => {
          this.common.loading--;
          console.error(err);
          this.common.showError();
        });
    }
  }





  getBatteryCurrentStatus(batteryId, index) {
    console.log("vehicle Id ---", this.vehicleId, "battery====", batteryId);
    if (!batteryId) {
      alert("Vehicle id and battery Id is Mandatory");
    } else {
      let alertMsg;
      let params = 'batteryId=' + batteryId;
      console.log("params ", params);
      this.api.get('Battery/getBatteryCurrentStatus?' + params)
        .subscribe(res => {
          console.log('Res: ', res['data']);
          if (res['data'][0].r_id > 0) {
            alertMsg = res['data'][0].r_msg
            this.openConrirmationAlert(alertMsg, index);
          }

        }, err => {
          console.error(err);
          this.common.showError();
        });
    }
  }
  openConrirmationAlert(alertMsg, index) {
    this.common.params = {
      title: "Current Postion Of Battery",
      description: alertMsg + " Do you want to change ?"
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (!data.response) {
        this.vehicleBattery[index].batteryId = null;
        // this.vehicleBattery[index].batteryNo = null;
        // console.log("data", document.getElementById('tyreNo-' + index), document.getElementById('tyreNo-' + index).innerHTML);

        (<HTMLInputElement>document.getElementById('batteryNo-' + index)).value = '';
      }
    });
  }

  getWarehouseData(details, i) {

  }

}
