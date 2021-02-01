import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lr-assign',
  templateUrl: './lr-assign.component.html',
  styleUrls: ['./lr-assign.component.scss', '../../../pages/pages.component.css']
})
export class LrAssignComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
  branchId = null;
  partyId = null;
  dataList = [];
  selectedType = [];
  invoiceId = null;
  invoiceType = null;
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


  headings1 = [];
  valobj1 = {};
  data1 = [];
  columnsValue = [];
  constructor(public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {

    console.log("Data:::", this.common.params.row);
    this.common.handleModalSize('class', 'modal-lg', '800', 'px', 1);
    this.branchId = this.common.params.row._branch_id ? this.common.params.row._branch_id : null;
    this.partyId = this.common.params.row._party_id ? this.common.params.row._party_id : null;
    this.invoiceId = this.common.params.row._id ? this.common.params.row._id : null;
    this.invoiceType = this.common.params.row._invtype?this.common.params.row._invtype:null;
    this.getlrUnmapped();
    this.viewlrData();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  refresh() {
    this.viewlrData();
    this.getlrUnmapped();
  }

  getlrUnmapped() {
    this.common.loading++;
    let params = {
      startTime: this.common.dateFormatter(this.startTime).split(' ')[0],
      endTime: this.common.dateFormatter(this.endTime).split(' ')[0] + " 23:59:00",
      partyId: this.partyId,
      branchId: this.branchId,
      invoiceId: this.invoiceId,
      mapped:0
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getlrUnmapped', params)
      .subscribe(res => {
        console.log("resss", res);
        this.common.loading--;
        this.headings1 = [];
        this.valobj1 = {};
        this.data1 = [];
        this.columnsValue = [];
        this.data1 = res['data'];
        if (this.data1) {
          console.log("data", this.data);
          this.getTableColumnName();
        }



      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }


  getTableColumnName() {
    console.log
    this.headings = [];
    this.valobj = {};
    let first_rec = this.data1[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings1.push(key);
      }
    }

    console.log("headings", this.headings1);
    this.getTableColumn();
  }

  getTableColumn() {
    this.data1.map(doc => {
      this.valobj1 = {};

      for (let i = 0; i < this.headings1.length; i++) {
        this.valobj1[this.headings1[i]] = doc[this.headings1[i]];
      }
      this.columnsValue.push(this.valobj1);
    });
    console.log("this.columnsValue", this.columnsValue);
  }

  onChange(id: string, isChecked: boolean) {
    console.log("id",id);
    if (isChecked) {
      this.selectedType.push(id);
    } else {
      let index = this.selectedType.indexOf(id);
      this.selectedType.splice(index, 1);
    }
    console.log(this.selectedType);
    return this.selectedType
  }

  selectAll(isChecked) {
    console.log("test", isChecked);
    if (isChecked) {
      console.log("true", isChecked);

      this.dataList.forEach(ele => {
        this.selectedType.push(ele.id);
      });
    }
    if (!isChecked) {
      console.log("false", isChecked);

      this.dataList.forEach(element => {
        this.selectedType.pop();
      });
    }
    console.log("Select Id:", this.selectedType);
  }

  assignGroups() {
    this.common.loading++;
    let params = {
      invoiceId: this.invoiceId,
      lrIds: JSON.stringify(this.selectedType).replace("[", "{").replace("]", "}"),
      lrId: null,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/assignGroups', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.refresh();
          this.selectedType = [];
        }
      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }

  viewlrData() {
    this.common.loading++;
    let params = {
      startTime: this.common.dateFormatter(this.startTime).split(' ')[0],
      endTime: this.common.dateFormatter(this.endTime).split(' ')[0] + " 23:59:00",
      partyId: this.partyId,
      branchId: this.branchId,
      invoiceId: this.invoiceId,
      mapped:1
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getlrUnmapped', params)
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


      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }


  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        // if (this.headings['Action'] == 'Action') {
        //   console.log("testing");

        this.valobj['Action'] = { class: '', icons: this.UnMappedLr(doc) };

        // }
      }
      columns.push(this.valobj);

    });

    return columns;
  }



  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  UnMappedLr(row) {
    let icons = [];

    icons.push(
      {
        class: "fa fa-window-close",
        action: this.unAssginLr.bind(this, row),
      },


    )
    return icons;
  }
  unAssginLr(row) {
    this.common.loading++;
    let params = {
      invoiceId: this.invoiceId,
      lrIds: null,
      lrId: row._lrid,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/assignGroups', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success'] == true) {
          this.common.showToast(res['msg']);

          this.refresh();
        }

      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }


}
