import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'document-history',
  templateUrl: './document-history.component.html',
  styleUrls: ['./document-history.component.scss']
})
export class DocumentHistoryComponent implements OnInit {
  title = '';
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

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.getDocumentChangeHistory();
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getDocumentChangeHistory() {
    this.common.loading++;
    this.api.post('Vehicles/getDocumentChangeHistoryById', { x_document_id: this.common.params.doc_id })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        if (!this.data.length) {
          document.getElementById('mdl-body').innerHTML = 'No record exists';
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
        console.log(err);
      });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }
}
