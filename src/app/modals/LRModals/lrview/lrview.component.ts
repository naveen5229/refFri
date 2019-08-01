import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lrview',
  templateUrl: './lrview.component.html',
  styleUrls: ['./lrview.component.scss']
})
export class LRViewComponent implements OnInit {
  layout = 1;
  layouts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  lrId = null;
  lrDetails = null;
  particulars = null
  constructor(
    public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public renderer: Renderer
  ) {

    this.lrId = this.common.params.lrId;
    this.common.handleModalSize('class', 'modal-lg', '820');
    this.printLR();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
    this.renderer.setElementClass(document.body, 'test', false);
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
    this.renderer.setElementClass(document.body, 'test', true);
    window.print();
    this.renderer.setElementClass(document.body, 'test', false);


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



