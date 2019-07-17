import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  advice_type_id = null;
  market = null;
  group = null;
  type = [];
  vid = null;
  regno = null;
  description = null;
  user_value = null;
  driverId = null;
  driverName = null;
  modeId = null;
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
  revenue = {
    refId: null,
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
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.getType();
    this.getPaymentMode();
    if (this.common.params.row) {
      console.info("test");
      this.edit = 1;
      this.vid = this.common.params.row._vid;
      this.regno = this.common.params.row.Regno;
      if (this.common.params.row._ref_id) {
        this.referenceId = this.common.params.row._ref_type;
        this.revenue.refId = this.common.params.row._ref_id;
        this.revenue.refTypeName = this.common.params.row._ref_name;
        this.getRefernceType(this.referenceId);
      }
    }
  }

  ngOnInit() {
  }
  getSelection() {
    // console.log('', this.id);
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
    this.common.loading++;
    this.api.post('Drivers/getDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
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
      ref_id: this.revenue.refId,
      ref_name: this.revenue.refTypeName,
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
