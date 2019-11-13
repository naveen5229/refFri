import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'generic-model',
  templateUrl: './generic-model.component.html',
  styleUrls: ['./generic-model.component.scss']
})
export class GenericModelComponent implements OnInit {
  title = '';
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
  viewUrl = null;
  deleteUrl = '';
  deleteParams = {};
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService, ) {
    if (this.common.params && this.common.params.data) {
      this.title = this.common.params.data.title ? this.common.params.data.title : '';
      console.log("Dynamic Data", this.common.params.data);
      let str = "?";
      Object.keys(this.common.params.data.view.param).forEach(element => {
        if (str == '?')
          str += element + "=" + this.common.params.data.view.param[element];
        else
          str += "&" + element + "=" + this.common.params.data.view.param[element];
      });
      this.viewUrl = this.common.params.data.view.api + str;
      this.deleteUrl = this.common.params.data.delete ? this.common.params.data.delete.api : '';
    }
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

    this.common.loading++;
    this.api.get(this.viewUrl)
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
        if (this.headings[i] == "Action") {
          if (this.deleteUrl)
            this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-trash', action: this.delete.bind(this, doc) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  delete(doc) {
    this.common.loading++;
    Object.keys(this.common.params.data.delete.param).forEach(element => {
      console.log("element value:", element);
      this.deleteParams[element] = doc[this.common.params.data.delete.param[element]];
    });
    this.api.post(this.deleteUrl, this.deleteParams)
      .subscribe(res => {
        this.common.loading--;
        this.response = res['data'];
        this.AdviceViews();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  closeModal() {
    this.activeModal.close();
  }
}
