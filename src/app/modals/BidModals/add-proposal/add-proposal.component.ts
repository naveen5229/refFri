import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'add-proposal',
  templateUrl: './add-proposal.component.html',
  styleUrls: ['./add-proposal.component.scss']
})
export class AddProposalComponent implements OnInit {
  bidId = null;
  weight = null;
  remarks = null;
  rate = null;
  orderId = null;
  orderType = null
  constructor(
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
  ) { 
    this.bidId = this.common.params.bidData.id;
    this.orderId = this.common.params.bidData.orderId;
    this.orderType = this.common.params.bidData.orderType;

  }

  saveData() {
    this.common.loading++;
    let params = {
      weight:this.weight,
      remarks: this.remarks,
      rate: this.rate, 
      bId:this.bidId,
      orderId:this.orderId
    }
    this.api.post('Bidding/saveProposal', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.closeModal({ response: true });
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  closeModal(status) {
    this.activeModal.close({ response: status });
  }

  ngOnInit() {
  }

}
