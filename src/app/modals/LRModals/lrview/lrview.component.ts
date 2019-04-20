import { Component, OnInit, Renderer } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import "jspdf-autotable";
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
    public renderer:Renderer
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
    this.api.post('LorryReceiptsOperation/printLR', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("response data", JSON.parse(res['data'][0].fn_printlrdetails).result);
        this.lrDetails = JSON.parse(res['data'][0].fn_printlrdetails).result[0];
        // this.lrDetails.branch_address=document.getElementById('branch_address').innerHTML;
        this.particulars = JSON.parse(res['data'][0].fn_printlrdetails).details;

        console.log('this.lrDetails:', this.lrDetails);
        console.log('this.particulars:', this.particulars[0]);

        // console.log("Receipt",this.receipts);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }


  onPrint(){
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

  downloadPdf(divId) {
    console.log("div id",divId);
    //document.getElementById('print-section2')
      var pdf = new jsPDF('p', 'pt', [50, 100]);
      let data = document.getElementById('print-section').innerText;
      console.log("data",data)
      pdf.text(data,10,10);
      pdf.save('converteddoc.pdf');

  }
    // let doc = new jsPDF();
    // doc.addHTML(document.getElementById(divId), function() {
    //    doc.save("Lorry Recipts.pdf");
    // });
}


