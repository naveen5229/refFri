import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'lr-pod-details',
  templateUrl: './lr-pod-details.component.html',
  styleUrls: ['./lr-pod-details.component.scss']
})
export class LrPodDetailsComponent implements OnInit {

  podField = [];

  evenArray = [];
  oddArray = [];

  title = '';
  images = [];
  activeImage = '';

  data = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  headings = [];
  valobj = {};
  podId = null;
  lrId = null;
  Details = [{
    detail_type: 1,
    param_value: null,
    param_date: new Date(),
    param_remarks: null,
  }]

  constructor(public activeModal: NgbActiveModal,
    public common: CommonService,
    private modalService: NgbModal,
    public api: ApiService) {
    console.log("id", this.common.params);
    this.podId = this.common.params.podDetails.podId;
    this.lrId = this.common.params.podDetails.lrId;
    this.common.handleModalSize('class', 'modal-lg', '500');
    this.getLrPodDetail();
  }

  ngOnInit() {
  }

  dismiss() {
    this.activeModal.close();
  }


  saveLrPodDetail() {
    this.Details = this.evenArray.concat(this.oddArray);
    let details = this.Details.map(detail => {
      let copyDetails = Object.assign({}, detail);
      if (detail['r_coltype'] == 3 && detail['r_value']) {
        copyDetails['r_value'] = this.common.dateFormatter1(detail['r_value']);
      }

      return copyDetails;
    });

    const params = {
      lrPodDetails: JSON.stringify(details),
      podId: this.podId,
      lrId: this.lrId
    }
    console.log("para......", params);

    this.common.loading++;
    this.api.post('LorryReceiptsOperation/saveLrPodDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("--res", res['data'][0].r_id)
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Successfully Eenterd");
        } else {
          this.common.showError(res['data'][0].r_msg);
        }
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
          console.error('Api Error:', err);
        });
    // }
  }

  getLrPodDetail() {
    const params = "podId=" + this.podId +
      "&lrId=" + this.lrId;
    console.log("pod", params);
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/lrPodEditDetails?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("resss", res);
        if (res['data']) {
          this.podField = res['data'].result;
          this.images = res['data'].images ? res['data'].images : []; //['http:\/\/edocs.elogist.in\/docs\/201907\/LrPod\/4559-93-pod1-1563360365.jpeg',];
          this.formatArray();
        }
        if (this.images.length > 0) {
          this.activeImage = this.images[0];
          this.common.handleModalSize('class', 'modal-lg', '1000');
        }
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
    // }
  }

  formatArray() {
    this.evenArray = [];
    this.oddArray = [];
    this.podField.map(dd => {
      if (dd.r_coltype == 3) {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_fixedvalues) {
        dd.r_fixedvalues = JSON.parse(dd.r_fixedvalues);
      }
      if (dd.r_colorder % 2 == 0) {
        this.evenArray.push(dd);
      } else {
        this.oddArray.push(dd);
      }
    });
    console.log("evenArray", this.evenArray);
    console.log("oddArray", this.oddArray);
  }
}

