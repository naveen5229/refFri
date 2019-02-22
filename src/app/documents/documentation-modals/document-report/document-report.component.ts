import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../../modals/image-view/image-view.component';
import { EditDocumentComponent } from '../../documentation-modals/edit-document/edit-document.component';
import { normalize } from 'path';
import { from } from 'rxjs';
@Component({
  selector: 'document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.scss', '../../../pages/pages.component.css']
})
export class DocumentReportComponent implements OnInit {

  title = '';
  reportResult = [];
  reportData = {
    id: null,
    status: '',
  };
  currentdate = new Date;
  nextMthDate = null;
  curr = null;


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1024');
    this.title = this.common.params.title;

    this.reportData.status = this.common.params.status;
    console.info("report data", this.reportData);

   this.totalReport();


  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }


  getReport() {
    let params = {
      id:this.common.params.docReoprt.id,
      status: this.reportData.status
    };
  
    console.log("id", params.id);
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', { x_status: params.status, x_document_type_id: params.id })
      .subscribe(res => {
        this.common.loading--;
        this.reportResult = res['data'];
        console.log("Api result", this.reportResult);

        let exp_date = this.common.dateFormatter(this.reportResult[0].expiry_date);
        this.curr = this.common.dateFormatter(this.currentdate);
        this.nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  totalReport() {
    let params = {
      status: this.reportData.status
    }
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', { x_status: params.status })

      .subscribe(res => {
        this.common.loading--;
        this.reportResult = res['data'];
        console.log("Api result", this.reportResult);
        let exp_date = this.common.dateFormatter(this.reportResult[0].expiry_date);
        this.curr = this.common.dateFormatter(this.currentdate);
        this.nextMthDate = this.common.getDate(30, 'yyyy-mm-dd');
        this.getReport();
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  imageView(doc) {
    console.log("image data", doc);
    let images = [{
      name: "image",
      image: doc.img_url
    }];
    console.log("images:", images);
    if (this.checkForPdf(images[0].image)) {
      window.open(images[0].image);
      return;
    }
    this.common.params = { images, title: 'Image' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }
  
  editData(doc) {
    console.log("edit model open  data", doc);
    let documentData = [{
      regNumber: doc.regno,
      id: doc.document_id,
      vehicleId: doc.vehicle_id,
      documentType: doc.document_type,
      documentId: doc.document_type_id,
      issueDate: doc.issue_date,
      wefDate: doc.wef_date,
      expiryDate: doc.expiry_date,
      agentId: doc.document_agent_id,
      agentName: doc.agent,
      documentNumber: doc.document_number,
      docUpload: doc.img_url,
      remark: doc.remarks,
      rto: doc.rto,
      amount: doc.amount,
    }];
    console.log("Document Id ;", documentData[0].id);

    this.common.params = { documentData, title: 'Update Document', vehicleId: documentData[0].vehicleId };
    const activeModal = this.modalService.open(EditDocumentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        // this.closeModal(true);
        this.getReport();
      }
    });
  }


}
