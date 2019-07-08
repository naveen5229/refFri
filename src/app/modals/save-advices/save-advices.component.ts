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
  id = null;
  advice_type_id = null;
  market = null;
  group = null;
  type = [];
  vid = null;
  regno = null;
  description = null;
  user_value = null;
  ref_id = null;
  ref_name = null;
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
  startDate = null;
  revenue = {
    refId: null,
    refTypeName: null,
    refernceType: 0
  };
  refernceData = [];
  data = [];
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    console.log('Refernce:', this.referenceId);
    this.getType();
  }

  ngOnInit() {
  }
  getSelection() {
    // console.log('', this.id);
  }
  selectName(details) {
    this.ref_id = details.id;
    this.ref_name = details.empname;

  }
  getTypeDetails(res) {

  }
  selectVechile(det) {

    this.vid = det.id;
    this.regno = det.regno;
  }
  getRefernceType() {
    // console.log('Refernce:', this.referenceId);
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
  // resetVal() {
  //   document.getElementById('driver')['value'] = '';

  // }
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

  getAdvice() {
    let params = {
      vid: this.vid,
      regno: this.regno,
      vehasstype: this.id,
      advice_type_id: this.advice_type_id,
      advice_mode: null,
      dttime: this.common.dateFormatter1(this.startDate),
      user_value: this.user_value,
      rec_value: null,
      for_ref_id: this.ref_id,
      for_ref_name: this.ref_name,
      ref_id: this.revenue.refId,
      ref_name: this.revenue.refTypeName,
      ref_type: this.referenceId
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
          this.closeModal();
        } else {
          this.common.showError(this.data[0]['y_msg']);
        }
        // console.log('type', this.type);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
}
