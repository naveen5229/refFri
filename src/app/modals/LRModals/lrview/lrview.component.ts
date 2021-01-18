import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lrview',
  templateUrl: './lrview.component.html',
  styleUrls: ['./lrview.component.scss']
})
export class LRViewComponent implements OnInit {
  layout = 1;
  layouts = [1, 2, 3, 4];
  lrId = null;
  lrDetails = null;
  particulars = null
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer2
  ) {

    this.lrId = this.common.params.lrId;
    this.common.handleModalSize('class', 'modal-lg', '820');
    this.printLR();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.addClass(document.body, 'test');
  }

  printLR() {
    ++this.common.loading;
    let params = {
      lrId: this.lrId
    }
    console.log("params", params);
    this.api.post('LorryReceiptsOperation/lrDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("Res", res['data']);

        this.lrDetails = JSON.parse(res['data']).result[0];
        this.particulars = JSON.parse(res['data']).details;

        console.log('this.lrDetails:', this.lrDetails);
        console.log('this.particulars:', this.particulars[0]);

        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }


  onPrint() {
    this.renderer.addClass(document.body, 'test');
    window.print();
    this.renderer.addClass(document.body, 'test');
  }



  findCustomFields(customFields) {
    if (!customFields) return [];
    customFields = JSON.parse(customFields);
    let formattedFields = [];
    let keys = Object.keys(customFields);
    keys.map(key => {
      formattedFields.push({ name: key, value: customFields[key] });
    });

    console.log('Formatted :', formattedFields);
    return formattedFields;
  }


}



