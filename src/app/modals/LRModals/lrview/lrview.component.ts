import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lrview',
  templateUrl: './lrview.component.html',
  styleUrls: ['./lrview.component.scss']
})
export class LRViewComponent implements OnInit {
  lrId = null;
  lrDetails = null;
  constructor(
    public common: CommonService,
    public api :ApiService,
    public activeModal: NgbActiveModal,
  ) { 

    this.lrId = this.common.params.lrId;
    this.common.handleModalSize('class', 'modal-lg', '820');
    this.printLR();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  printLR(){
    ++this.common.loading;
    let params = {
      lrId : this.lrId
    }
    console.log("params", params);
    this.api.post('LorryReceiptsOperation/printLR', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
        this.lrDetails = res['data'];
        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

}
