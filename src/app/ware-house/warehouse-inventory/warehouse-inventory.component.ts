import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { GotPassComponent } from '../modals/got-pass/got-pass.component';
@Component({
  selector: 'warehouse-inventory',
  templateUrl: './warehouse-inventory.component.html',
  styleUrls: ['./warehouse-inventory.component.scss']
})
export class WarehouseInventoryComponent implements OnInit {
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
  data = [];
  constructor(public common: CommonService,
    public modalService: NgbModal,
    private api: ApiService) {

  }

  ngOnInit() {
  }
  manualWareHouseEntry() {
    this.modalService.open(GotPassComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  nearByPods() {
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
    this.api.get('LorryReceiptsOperation/getNearByPods')
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
          // this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-user', action: this.change.bind(this, doc) }, { class: 'fa fa-map-marker', action: this.view.bind(this, doc) }, { class: 'fa fa-picture-o', action: this.LRimage.bind(this, doc._img_url2) }, { class: 'fa fa-image', action: this.podimage.bind(this, doc._img_url) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
}
