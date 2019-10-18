import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'clear-advices',
  templateUrl: './clear-advices.component.html',
  styleUrls: ['./clear-advices.component.scss']
})
export class ClearAdvicesComponent implements OnInit {
  status = [{
    name: 'pending',
    id: '0'
  },
  {
    name: 'Accept',
    id: '1'
  },
  {
    name: 'Reject',
    id: '-1'
  }]
  id = null;
  remarks = null;
  data = [];
  rowId = null;
  adviceId = null;
  fuelStations = [];
  fuelId = null;
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {

    this.rowId = this.common.params.advice.id ? this.common.params.advice.id : null;
    this.adviceId = this.common.params.advice.typeId ? this.common.params.advice.typeId : null;
    this.getFuelStationList();
  }

  ngOnInit() {
  }

  getFuelStationList() {
    this.api.get("Suggestion/getFuelStaionWrtFo").subscribe(
      res => {
        this.fuelStations = res['data'];
      },
      err => {
        console.log(err);
      }
    );
  }

  ClearAdvices() {
    let params = {
      id: this.rowId,
      status: this.id,
      remarks: this.remarks,
      fsId: this.fuelId
    }

    this.common.loading++;
    this.api.post('Drivers/clearAdvice', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (this.data[0]['y_id'] > 0) {
          this.common.showToast(this.data[0]['y_msg']);
          this.closeModal();
        } else {
          this.common.showError(this.data[0]['y_msg']);
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  closeModal() {
    this.activeModal.close();
  }
}
