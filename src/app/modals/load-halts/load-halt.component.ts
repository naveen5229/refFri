import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'load-halt',
  templateUrl: './load-halt.component.html',
  styleUrls: ['./load-halt.component.scss']
})
export class LoadHaltComponent implements OnInit {
  typeId = -1;
  typeIds = [];
  showAll = false;
  title="Halt Load"

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) {

    this.getTypeIds();
  }

  ngOnDestroy(){}
ngOnInit() {

  }

  closeModal(type) {
    if (type)
      this.activeModal.close({ response: this.typeId });
    else
      this.activeModal.close();
  }

  getTypeIds() {
    this.api.post("SiteFencing/getSiteTypes", {})
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.typeIds = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

}
