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
  particulars = null
  constructor(
    public common: CommonService,
    public api: ApiService,
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

  printLR() {
    ++this.common.loading;
    let params = {
      lrId: this.lrId
    }
    console.log("params", params);
    this.api.post('LorryReceiptsOperation/printLR', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("response data", JSON.parse(res['data'][0].fn_printlrdetails).result);
        this.lrDetails = JSON.parse(res['data'][0].fn_printlrdetails).result[0];
        this.particulars = JSON.parse(res['data'][0].fn_printlrdetails).details;

        console.log('this.lrDetails:', this.lrDetails);
        console.log('this.particulars:', this.particulars[0]);

        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  //   print(): void {
  //     let printContents, popupWin;
  //     printContents = document.getElementById('print-section').innerHTML;
  //     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  //     popupWin.document.open();
  //     popupWin.document.write(`
  //       <html>
  //         <head>
  //           <title>Print tab</title>
  //           <style>
  //           //........Customized style.......
  //           </style>
  //         </head>
  //     <body onload="window.print();window.close()">${printContents}</body>
  //       </html>`
  //     );
  //     popupWin.document.close();
  // }

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
