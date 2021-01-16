import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';
import { UserService } from '../../services/user.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'general-modal',
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss']
})
export class GeneralModalComponent implements OnInit {jobId = null;
  numbers = [];
  data = [];
  items = null;
  apiURL = null;
  parameters = null;
  title = 'Detail';
  isBtn = false;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.apiURL = this.common.params.data.apiURL;
    this.title = this.common.params.data.title;
    this.parameters = this.common.params.data.params;
    this.isBtn = this.common.params.data.isBtn;

    this.viewData();
  }
  ngOnDestroy(){}
ngOnInit() {

  }
  viewData() {
    console.log("this.parameters",this.parameters);
    this.common.loading++;
    this.api.post(this.apiURL,this.parameters)
      .subscribe(res => {
        this.common.loading--;
        console.log("res['data'][0]",res['data'][0]);
        let headings = Object.keys(res['data'][0]);
        console.log("headings",headings);
        for (let index = 0; index < headings.length; index++) {
          const header = headings[index];
          const value = res['data'][0][header];
          if (!header.startsWith("_") && value) {
            this.data.push({ head: header, value: value });
          }
        }
        this.items = res['data'][0]['_itemsdetails'];
        for (let index = 0; index < Math.ceil(this.data.length / 2); index++) {
          this.numbers.push(index);
        }
        console.log("Data Details", this.data);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal(isFatal) {
    this.activeModal.close({ response: isFatal });
  }
}