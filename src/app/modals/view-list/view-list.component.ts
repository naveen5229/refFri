import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss', '../../pages/pages.component.css']
})
export class ViewListComponent implements OnInit {
  title = '';
  headings = [];
  datas = [];
  actions = {};
  actionParams = {};

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.headings = this.common.params.headings;
    this.datas = this.common.params.data;
    this.common.params.actions && (this.actions = this.common.params.actions);
    this.common.params.actionParams && (this.actionParams = this.common.params.actionParams);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  handleAction(rowIndex, colIndex) {
    let action = this.actions[this.headings[colIndex]];
    if (!action) return;
    let params = this.actionParams[this.headings[colIndex]] && this.actionParams[this.headings[colIndex]][rowIndex] ? this.actionParams[this.headings[colIndex]][rowIndex] : null;
    if (params) action(params);
    else action();
  }
}
