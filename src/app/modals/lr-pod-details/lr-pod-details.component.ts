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

  dropDown = [];

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
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.getLrPodDetail();

    //  this.title = this.common.params.title;
    // this.common.params.images.map(image => {
    //   if (image.name) {
    //     if (image.image)
    //       this.images.push(image.image);
    //   } else {
    //     this.images.push(image);
    //   }
    // });
    // this.activeImage = this.images[0];
  }

  ngOnInit() {
  }

  dismiss() {
    this.activeModal.close();
  }

  addMore() {
    this.Details.push({
      detail_type: 1,
      param_value: null,
      param_date: new Date(),
      param_remarks: null,
    });
  }

  saveLrPodDetail() {
    const params = {
      lrPodDetails: JSON.stringify(this.Details),
      podId: this.podId,
    }
    console.log("para", params)
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/saveLrPodDetails', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.Details = [];
        this.addMore();
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
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
        this.dropDown = res['data'];
        console.log("resss", this.dropDown);
      this.formatArray();

      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
    // }
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash', action: this.deleteLr.bind(this, doc) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }


      }
      columns.push(this.valobj);
    });
    return columns;
  }

  deleteLr(doc) {
    console.log("values", doc);
    const params = {
      rowId: doc._id,
    }
    if (doc._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          console.log("par", params);
          this.api.post('LorryReceiptsOperation/deleteLrPodDetail', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getLrPodDetail();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }
  formatArray() {
    this.evenArray = [];
    this.oddArray = [];
    this.dropDown.map(dd => {
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

