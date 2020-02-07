import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  foMobileNo = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public user: UserService,
  ) { 
    this.foMobileNo = this.user._details.fo_mobileno;
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
}
