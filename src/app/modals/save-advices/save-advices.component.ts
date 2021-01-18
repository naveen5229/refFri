import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'save-advices',
  templateUrl: './save-advices.component.html',
  styleUrls: ['./save-advices.component.scss']
})
export class SaveAdvicesComponent implements OnInit {
  option = [{
    name: 'own',
    id: '1'
  },
  {
    name: 'market',
    id: '2'
  },
  {
    name: 'group',
    id: '3'
  }]
  id = 1;
  advice_type_id = '-1';
  market = null;
  group = null;
  type = [];
  vid = null;
  regno = null;
  description = null;
  user_value = null;
  driverId = null;
  driverName = null;
  modeId = '-1';
  remark = null;
  referenceType = [{
    name: 'select Type',
    id: '0'

  },
  {
    name: 'Lr',
    id: '11'
  },
  {
    name: 'Manifest',
    id: '12'
  },
  {
    name: 'state',
    id: '13'
  },
  {
    name: 'Trip',
    id: '14'
  }]
  referenceId = null;
  referenceName = null;
  startDate = new Date();
  advice = {
    refId: '-1',
    refTypeName: null,
    refernceType: 0
  };
  refernceData = [];
  ModeData = [];
  data = [];
  preSelectedDriver = null;
  edit = 0;
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {

    this.getType();
    this.getPaymentMode();


    if (this.common.params && this.common.params.refData) {
      this.edit = 1;
      this.referenceId = this.common.params.refData.refType;
      this.advice.refId = this.common.params.refData.refId;
      this.getReferenceData();
      this.getRefernceType(this.referenceId);
    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  getReferenceData() {
    const params = "id=" + this.advice.refId +
      "&type=" + this.referenceId;
    this.api.get('Vehicles/getRefrenceDetails?' + params)
      .subscribe(res => {
        console.log(res['data']);
        let resultData = res['data'][0];
        this.vid = resultData.vid;
        this.regno = resultData.regno;
        this.advice.refTypeName = resultData.ref_name;
        this.id = resultData.vehasstype
        this.refernceTypes();
        this.getDriverInfo();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getDriverName(details) {
    this.driverId = details.id;
    this.driverName = details.empname;
    return this.driverId
  }
  getTypeDetails(res) {

  }
  selectVechile(det) {

    this.vid = det.id;
    this.regno = det.regno;
    this.getDriverInfo();
  }
  getDriverInfo() {
    let params = {
      vid: this.vid
    };
    this.api.post('Drivers/getDriverInfo', params)
      .subscribe(res => {
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.driverName = res['data'][0].empname;
          this.driverId = res['data'][0].driver_id;
          document.getElementById("driver")['value'] = res['data'][0].empname;
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  getRefernceType(typeId) {
    this.referenceType.map(element => {
      if (element.id == typeId) {
        return this.referenceName = element.name;
      }
    });
    this.refernceTypes();
  }
  getType() {

    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=55')
      .subscribe(res => {
        this.common.loading--;
        this.type = res['data'];
        console.log('type', this.type);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  closeModal() {
    this.activeModal.close({ response: true });
  }
  resetData() {
    document.getElementById('driver')['value'] = '';
    this.regno = null;
  }

  refernceTypes() {
    let type = this.referenceId + "";
    let url = null;
    let params = {
      vid: this.vid,
      regno: this.regno
    };

    switch (type) {
      case '11':
        url = "Suggestion/getLorryReceipts";
        break;
      case '12':
        url = "Suggestion/getLorryManifest";
        break;
      case '13':
        url = "Suggestion/getVehicleStates";
        break;
      case '14':
        url = "Suggestion/getVehicleTrips";
        break;
      default:
        url = null;
        return;

    }
    console.log("params", params);
    this.api.post(url, params)
      .subscribe(res => {
        this.refernceData = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getPaymentMode() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=56')
      .subscribe(res => {
        this.common.loading--;
        this.ModeData = res['data'];
        console.log('type', this.ModeData);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  getAdvice() {
    let params = {
      vid: this.vid,
      regno: this.regno,
      vehasstype: this.id,
      advice_type_id: this.advice_type_id,
      advice_mode: this.modeId,
      dttime: this.common.dateFormatter1(this.startDate),
      user_value: this.user_value,
      rec_value: null,
      for_ref_id: this.driverId,
      for_ref_name: this.driverName,
      ref_id: this.advice.refId,
      ref_name: this.advice.refTypeName,
      ref_type: this.referenceId,
      remarks: this.remark
    }
    if (params.user_value < 0) {
      this.common.showToast('Please Enter Correct User Value');
      return;
    }
    console.log('params', params)
    this.common.loading++;
    this.api.post('Drivers/saveAdvices', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data[0]['y_id'] > 0) {
          this.common.showToast(this.data[0]['y_msg']);
          this.activeModal.close({ data: true });
        } else {
          this.common.showError(this.data[0]['y_msg']);
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
}
