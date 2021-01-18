import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-web-view-summary',
  templateUrl: './fo-web-view-summary.component.html',
  styleUrls: ['./fo-web-view-summary.component.scss']
})
export class FoWebViewSummaryComponent implements OnInit {
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
  startDate = null;
  endDate = null;
  id = null;

  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {

    this.startDate = this.common.dateFormatter1(this.common.params.sd);
    this.endDate = this.common.dateFormatter1(this.common.params.ed);
    this.id = this.common.params.summary._id;
    console.log('startdate:', this.startDate);
    console.log('endate:', this.endDate);
    this.fowebView();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  fowebView() {
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
    let params = "startDate=" + this.startDate + "&endDate=" + this.endDate + "&type=" + '1' + "&adminId=" + this.id;
    console.log('params', params);
    this.common.loading++;
    this.api.get('FoAdmin/getFoAdminWebPageView?' + params)
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
          //this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-user', action: this.change.bind(this, doc) }, { class: 'fa fa-map-marker', action: this.view.bind(this, doc) }, { class: 'fa fa-picture-o', action: this.LRimage.bind(this, doc._img_url2) }, { class: 'fa fa-image', action: this.podimage.bind(this, doc._img_url) }] };
        } else {
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
