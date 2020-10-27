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
  viewObj = {
    param: null,
    api: null,
  };
  viewModalObj = {
    param: null,
    api: null,
  };
  deleteObj = {
    param: null,
    api: null,
  };
  deleteParams = null;
  viewModalParams = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    public modalService: NgbModal) {
    if (this.common.params && this.common.params.data) {
      console.log()
      this.title = this.common.params.data.title ? this.common.params.data.title : '';

      //post api call
      if (this.common.params.data.view && this.common.params.data.view.type && (this.common.params.data.view.type) == 'post') {

        this.viewObj = this.common.params.data.view;
        this.viewPost();

      }

      //get api call
      else if (this.common.params.data.view) {
        let str = "?";
        Object.keys(this.common.params.data.view.param).forEach(element => {
          if (str == '?')
            str += element + "=" + this.common.params.data.view.param[element];
          else
            str += "&" + element + "=" + this.common.params.data.view.param[element];
        });
        this.viewObj = this.common.params.data.view;
        this.viewObj.api += str;
        this.view();

      }


      if (this.common.params.data.delete) {
        this.deleteObj = this.common.params.data.delete;
      }
      if (this.common.params.data.viewModal) {
        this.viewModalObj = this.common.params.data.viewModal;
      }

    }
  }

  ngOnInit() {
  }

  view() {
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
    this.api.get(this.viewObj.api)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];

        if (this.data == null) {
          this.data = [];
          this.table = null;
          return;
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

  viewPost() {
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
    this.api.post(this.viewObj.api, this.viewObj.param)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];

        if (this.data == null) {
          this.data = [];
          this.table = null;
          return;
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
          let icons = [];
          if (this.deleteObj.api)
            icons.push({ class: 'fa fa-trash', action: this.delete.bind(this, doc) });
          if (this.viewModalObj.api)
            icons.push({ class: 'fa fa-eye', action: this.viewModal.bind(this, doc) });
          if (icons.length != 0)
            this.valobj[this.headings[i]] = { value: "", action: null, icons: icons };
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
    this.deleteParams = {};
    Object.keys(this.deleteObj.param).forEach(element => {
      console.log("element value:", element);
      this.deleteParams[element] = doc[this.deleteObj.param[element]];
    });
    this.api.post(this.deleteObj.api, this.deleteParams)
      .subscribe(res => {
        this.common.loading--;
        this.response = res['data'];
        this.view();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  viewModal(doc) {
    this.viewModalParams = {};
    Object.keys(this.viewModalObj.param).forEach(element => {
      console.log("element value:", element);
      this.viewModalParams[element] = doc[this.viewModalObj.param[element]];
    });
    let dataparams = {
      view: {
        api: this.viewModalObj.api,
        param: this.viewModalParams
      },
      title: "View Modal"
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  closeModal() {
    this.activeModal.close();
  }
}
