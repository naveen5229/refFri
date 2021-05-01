import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'type-master',
  templateUrl: './type-master.component.html',
  styleUrls: ['./type-master.component.scss']
})
export class TypeMasterComponent implements OnInit {

  dataTypeMaster = [];
  name = [];
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

  id = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public activeModal:NgbActiveModal) {
    this.getData()

  }

  ngOnDestroy(){}
ngOnInit() {

  }

  closeModal() {
    this.activeModal.close();
  }

  getData(){
    this.api.get("Suggestion/getTypeMasterSuggestion").subscribe(
      res => {
        this.dataTypeMaster = res['data']
        console.log("autosugg", this.dataTypeMaster);

      }
    )
  }

  getList(event) {
    this.id = event.target.value;
    console.log("event", this.id);


  }

  getTypeMaster() {
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
    const params =
      "id=" + this.id;

    this.api.get("Suggestion/getTypeMasterList.json?" + params).subscribe(
      res => {
        this.data = [];
        this.data = res['data'];
        console.log("result", res);
        let head = this.data[0];
        for (var key in head) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );

  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }

      columns.push(this.valobj);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
}
