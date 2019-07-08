import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'advice-view',
  templateUrl: './advice-view.component.html',
  styleUrls: ['./advice-view.component.scss']
})
export class AdviceViewComponent implements OnInit {
  data = [];
  response = [];
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
  vehicleId = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService, ) {
    this.vehicleId = this.common.params.advice._vid ? this.common.params.advice._vid : null;
    this.AdviceViews();
  }

  ngOnInit() {
  }
  AdviceViews() {
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

    this.headings = [];
    this.valobj = {};
    let params = "vId=" + this.vehicleId;
    this.common.loading++;
    this.api.get('Drivers/getAdvicesSingleVehicle?' + params)
      .subscribe(res => {
        this.common.loading--;
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
      }, err => {
        this.common.loading--;
        this.common.showError();
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
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {

          // this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-task', action: this.view.bind(this, doc.url) }, { class: 'fa fa-task', action: this.view.bind(this, doc.url) }] };
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash', action: this.change.bind(this, doc) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
  change(doc) {
    let params = {
      vId: this.vehicleId,
      id: doc._id
    }
    this.common.loading++;
    this.api.post('Drivers/deleteAdvice', params)
      .subscribe(res => {
        this.common.loading--;
        this.response = res['data'];
        this.AdviceViews();

        //this.type = res['data'];
        //console.log('type', this.type);

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  closeModal() {
    this.activeModal.close();
  }
}
