import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'buy-time',
  templateUrl: './buy-time.component.html',
  styleUrls: ['./buy-time.component.scss','../../pages/pages.component.css']
})
export class BuyTimeComponent implements OnInit {

  buyTime = {
    type: 'minutes',
    time: 5
  };

  minutes = [5, 15, 30, 60];
  hours = [2, 3, 5, 7, 10];


  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService) {
  }

  ngOnDestroy(){}
ngOnInit() {
    console.log('ionViewDidLoad BuyTimePage');
  }

  dismiss() {
    this.activeModal.close();
  }

  buyNow() {
    if (!this.buyTime.time || this.buyTime.time <= 0) {
      this.common.showToast('Enter a valid time');
      return;
    }
    console.log('Forward:', this.buyTime);

    let time = this.buyTime.time;
    if (this.buyTime.type == 'hours') {
      time = this.buyTime.time * 60;
    }

    let params = {
      fo_ticket_allocation_id: this.common.params['ticketId'],
      extra_time: time
    };

    console.log('Params:', params);


    this.common.loading++;
    this.api.post('FoTickets/setExtraTime', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
        this.common.showToast(res['msg']);
        this.dismiss();
      }, err => {
        console.error(err);
        this.common.loading--;
        this.common.showError();
      });
  }

}
