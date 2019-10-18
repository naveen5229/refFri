import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'challan-pending-request',
  templateUrl: './challan-pending-request.component.html',
  styleUrls: ['./challan-pending-request.component.scss']
})
export class ChallanPendingRequestComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal,
    public common:CommonService,
    public api:ApiService) {
    console.log(this.common.params);
    //this.regno=this.common.params.challan.regno;
    console.log("regno",this.common.params);
    this.common.handleModalSize('class', 'modal-lg', '1020');
   }

  ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();
  }

  challanPayRequest(){
      let params = {
        challanId: this.common.params.rowId,
      };
      this.common.loading++;
      this.api.post('Challans/challanPaymentRequest', params)
        .subscribe(res => {
          this.common.loading--;
          this.common.showToast(res['msg']);
          this.activeModal.close({ response: true });
        }, err => {
          this.common.loading--;
          console.log(err);
          this.common.showError();
        });
    }
  

}
