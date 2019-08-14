import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AccountService } from '../../../services/account.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-dispatch-order',
  templateUrl: './add-dispatch-order.component.html',
  styleUrls: ['./add-dispatch-order.component.scss']
})
export class AddDispatchOrderComponent implements OnInit {

  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.getDispatchOrderFields();
  }

  ngOnInit() {
  }

  getDispatchOrderFields(isSetBranchId?) {
    let branchId = this.accountService.selected.branch.id ? this.accountService.selected.branch.id : '';
    let params = "branchId=" + this.accountService.selected.branch.id +
      "&dispatchOrderId=" + null;
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/getDispatchOrderFields?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response", res)

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}
