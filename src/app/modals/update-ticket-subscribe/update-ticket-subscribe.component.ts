import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'update-ticket-subscribe',
  templateUrl: './update-ticket-subscribe.component.html',
  styleUrls: ['./update-ticket-subscribe.component.scss']
})
export class UpdateTicketSubscribeComponent implements OnInit {

  ticket = {
    name: '',
    isActive: '',
    isOld: '',
    id: '',
    // refId: '',
    // refType: ''
  };
  update = false;

  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal
  ) {
    this.common.handleModalSize('class', 'modal-sm', '400')
    console.log('ticket:::::::', this.common.params);
    this.ticket.name = this.common.params.name;
    this.ticket.isActive = this.common.params.is_active;
    this.ticket.isOld = this.common.params.is_old;
    this.ticket.id = this.common.params.id;
    // this.ticket.refId = this.common.params.ref_id,
    //   this.ticket.refType = this.common.params.ref_type
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  UpdateTicketSubscribe() {
    let params = {
      id: this.ticket.id,
      is_active: this.ticket.isActive ? 1 : 0,
      is_old: this.ticket.isOld ? 1 : 0
      // ref_id: this.ticket.refId,
      // ref_type: this.ticket.refType
    };
    this.common.loading++;
    this.api.post('FoTicketSubscribe/updateVscEntry', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('rs', res['data']);
        if (res['success']) {
          this.update = true;
          this.common.showToast(res['msg']);
          this.activeModal.close({ update: this.update });
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  closeModal() {
    // if (this.update)
    //   this.activeModal.close({ update: this.update });
    // else
    this.activeModal.close();


  }
}
