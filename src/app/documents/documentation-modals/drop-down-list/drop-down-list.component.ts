import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss']
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
    this.title = this.common.params.title || 'ignore';
    this.btn1 = this.common.params.btn1 || 'Submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.reason = [
      {
        id: 11,
        name: "Norecord"
      },
      {
        id: 21,
        name: "Undefine"
      },
      {
        id: 31,
        name: "DataNotavailable"
      }
    ];
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

}
