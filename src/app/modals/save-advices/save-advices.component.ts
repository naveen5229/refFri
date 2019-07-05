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
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.getType();
  }

  ngOnInit() {
  }
  getSelection() {
    console.log('', this.id);
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
  getAdvice() {
    let params = {
      vid: this.vid,
      regno: this.regno,
      vehasstype: this.id,
      advice_type_id: this.advice_type_id,
      advice_mode: null,
      dttime: null,
      user_value: this.user_value,
      rec_value: null,
      ref_id: this.ref_id,
      ref_name: this.ref_name,

    }
    console.log('params', params)
    this.common.loading++;
    this.api.post('Drivers/saveAdvices', params)
      .subscribe(res => {
        this.common.loading--;

        // console.log('type', this.type);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
}
