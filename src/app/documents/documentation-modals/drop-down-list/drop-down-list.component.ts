import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss', '../../../pages/pages.component.css']
})
export class DropDownListComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  reason = [
    {
      id: -1,
      name: ""
    }
  ];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Ignore';
    this.btn1 = this.common.params.btn1 || 'Submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.reason = [
      {
        id: 11,
        name: "Private Vehicle"
      },
      {
        id: 21,
        name: "Not Applicable on Vehicle Type"
      },
      {
        id: 31,
        name: "Intra State Trip Only"
      }
    ];
    console.log("data:", this.common.params.ignoreData);
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: this.reason });
  }

  addReason() {

  }
}
