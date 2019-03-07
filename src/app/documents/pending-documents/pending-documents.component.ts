import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { PendingDocumentComponent } from '../../documents/documentation-modals/pending-document/pending-document.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { from } from 'rxjs';

@Component({
  selector: 'pending-documents',
  templateUrl: './pending-documents.component.html',
  styleUrls: ['./pending-documents.component.scss', '../../pages/pages.component.css']
})
export class PendingDocumentsComponent implements OnInit {
  data = [];
  // modalCount = 0;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getPendingDetailsDocuments();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    console.log('Refresh');
    this.getPendingDetailsDocuments();
  }

  getPendingDetailsDocuments() {
    this.common.loading++;
    this.api.post('Vehicles/getPendingDocumentsList', { x_user_id: this.user._customer.id, x_is_admin: 1 })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  showDetails(row, index) {
    let rowData = {
      id: row.document_id,
      vehicle_id: row.vehicle_id,
      regno: row.regno,
      document_type: row.name,
      document_type_id: row.document_type_id,
      agent: row.agent,
      agent_id: row.document_agent_id,
      wef_date: row.wef_date,
      expiry_date: row.expiry_date,
      issue_date: row.issue_date,
      remarks: row.remarks,
      img_url: row.img_url,
      doc_no: row.document_number,
      rto: row.rto,
      amount: row.amount,
      img_url2: row.img_url2,
      img_url3: row.img_url3
    };
    this.common.params = { rowData, title: 'Update Document', canUpdate: 1 };
    this.common.handleModalSize('class', 'modal-lg', '1200');
    const activeModal = this.modalService.open(PendingDocumentComponent, { size: 'lg', container: 'nb-layout' });
    // this.modalCount++;
    console.log('Modal Instance: ', activeModal.componentInstance);
    activeModal.result.then(mdldata => {
      console.log("response:");
      console.log(mdldata);
      // this.getPendingDetailsDocuments();
      // this.modalCount--;
    });

    // if (this.modalCount < 2) {
    //   setTimeout(() => {
    //     this.showDetails(this.data[index], ++index);
    //   }, 5000);
    // }
  }

  deleteDocument(row) {
    let remark;
    let ret = confirm("Are you sure you want to delete this Document?");
    if (ret) {
      this.common.params = { RemarkModalComponent, title: 'Delete Document' };
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("reason For delete: ", data.remark);
          remark = data.remark;
          this.common.loading++;
          this.api.post('Vehicles/deleteDocumentById', { x_document_id: row.document_id, x_remarks: remark, x_user_id: this.user._customer.id })
            .subscribe(res => {
              this.common.loading--;
              console.log("data", res);
              this.getPendingDetailsDocuments();
              this.common.showToast("Success Delete");
            }, err => {
              this.common.loading--;
              console.log(err);
              this.getPendingDetailsDocuments();
            });
        }
      })
    }
  }

}
