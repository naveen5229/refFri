import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'pod-state-view',
  templateUrl: './pod-state-view.component.html',
  styleUrls: ['./pod-state-view.component.scss']
})
export class PodStateViewComponent implements OnInit {
  data = [];
  stateId = null;
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
  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService) {
    this.data = this.common.params.status;
    this.stateId = this.common.params.status._state_id;
    console.log('viewstateId', this.data);
    this.print();
  }

  ngOnInit() {
  }
  print() {
    ++this.common.loading;
    let params = "stateId=" + this.stateId;

    console.log("params", params);
    this.api.get('LorryReceiptsOperation/getLrPodStateOnClick?' + params)
      .subscribe(res => {
        --this.common.loading;
        this.data = res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        // this.showdoughnut();
        this.table.data.columns = this.getTableColumns();
        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];

    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == "Action") {

        }
        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  closeModal() {
    this.activeModal.close();
  }
}
