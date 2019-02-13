import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../../modals/image-view/image-view.component';
import { normalize } from 'path';
@Component({
  selector: 'document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.scss']
})
export class DocumentReportComponent implements OnInit {

  title = '';
  reportResult = [];
  reportData = {
    id: null,
    status: '',

  };


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      this.common.handleModalSize('class', 'modal-lg', '990');
    this.title = this.common.params.title;

    this.reportData.id = this.common.params.docReoprt.id;
    this.reportData.status = this.common.params.status;
    console.info("report data", this.reportData);

    this.getReport();
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }


  getReport() {
    let params = {
      id: this.reportData.id,
      status: this.reportData.status
    };
    console.log("id", params.id);
    this.common.loading++;
    this.api.post('Vehicles/getDocumentsStatistics', { x_status: params.status, x_document_type_id: params.id })
      .subscribe(res => {
        this.common.loading--;
        console.log("report data", res);
        this.reportResult = res['data'];
        console.log("This report data",this.reportData);

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
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }

  checkForPdf(imgUrl) {
    var split = imgUrl.split(".");
    return split[split.length - 1] == 'pdf' ? true : false;
  }

}
