import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lrrate-calculator',
  templateUrl: './lrrate-calculator.component.html',
  styleUrls: ['./lrrate-calculator.component.scss']
})
export class LRRateCalculatorComponent implements OnInit {
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

  refType = null;
  refId = null;
  expenseType = null;
  constructor(
    public api: ApiService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public common: CommonService) {
    console.log(this.common.params.refData);
    if (this.common.params.refData) {
      this.refId = this.common.params.refData.refId;
      this.refType = this.common.params.refData.refTypeId;
      this.expenseType = this.common.params.refData.isExpense;
      this.getLrRate();
    }
    this.common.handleModalSize('class', 'modal-lg', '1300', 'px', 1);
  }


  ngOnDestroy(){}
ngOnInit() {
  }

  getLrRate() {
    const params = {
      refId: this.refId,
      refTypeId: this.refType,
      isExpense: '' + this.expenseType
    };
    ++this.common.loading;
    console.log("params", params);
    this.api.post('FrieghtRate/getFrieghtRate', params)
      .subscribe(res => {
        --this.common.loading;
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
        console.log('Api Response:', res)
      },
        err => console.error(' Api Error:', err));
  }

  formatTitle(title) {
    let tempTitle = title.split('y_')[1];
    console.log("temp title:", tempTitle);
    return tempTitle.charAt(0).toUpperCase() + tempTitle.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);

        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  closeModal() {
    this.activeModal.close();
  }

  saveCalculatedRate() {
    console.log("hello");
    const params = {
      refId: this.refId,
      refTypeId: this.refType,
      isExpense: '' + this.expenseType
    };
    ++this.common.loading;
    console.log("params", params);
    this.api.post('LorryReceiptsOperation/saveCalculatedRate', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Api Response:', res['data'][0]);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Sucessfully saved");
          this.closeModal();
        }
        else {
          this.common.showError(res['data'][0].r_msg);
        }
      },
        err => console.error(' Api Error:', err));
  }


}
