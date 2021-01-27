import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss', '../../../pages/pages.component.css']
})
export class DropDownListComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  reasonName = '';
  rules = [];
  data = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Ignore';
    this.btn1 = this.common.params.btn1 || 'Submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.rules = [
      {
        name: "Private Vehicle"
      },
      {
        name: "Not Applicable on Vehicle Type"
      },
      {
        name: "Intra State Trip Only"
      }
    ];
    this.data = this.common.params.ignoreData;
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: { name: this.reasonName }, record: this.data });
  }
  dismiss() {
    this.activeModal.close();

  }


}
