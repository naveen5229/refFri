import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import {PendingDocumentComponent } from '../../documents/documentation-modals/pending-document/pending-document.component';
import { from } from 'rxjs';

@Component({
  selector: 'pending-documents',
  templateUrl: './pending-documents.component.html',
  styleUrls: ['./pending-documents.component.scss', '../../pages/pages.component.css']
})
export class PendingDocumentsComponent implements OnInit {
  data = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal
  ) { 
    this.getPendingDetailsDocuments();
   }

  ngOnInit() {
  }

  getPendingDetailsDocuments() {
    this.common.loading++;
    this.api.get('Vehicles/getPendingDetailsDocuments', {})
        .subscribe(res => {
          this.common.loading--;
          console.log("data", res);
          this.data = res['data'];

                
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  
    showDetails(row) {
      let rowData = {
        id : row.id,
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
        amount: row.amount
      };
      this.common.params = {rowData, title: 'Update Document', canUpdate: 1};
      this.common.handleModalSize('class', 'modal-lg', '1200');
      const activeModal = this.modalService.open(PendingDocumentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(mdldata => {
        console.log("response:");
        console.log(mdldata);
      });
    }
    
    deleteDocument(row) {
      let ret = confirm("Are you sure you want to delete this Document?");
      if(ret) {
        console.log("Deleting document with id:" + row.id);
        this.common.loading++;
        this.api.post('Vehicles/deleteDocumentById', {x_document_id: row.id})
        .subscribe(res => {
          this.common.loading--;
          console.log("data", res);
          window.location.reload();          
        }, err => {
          this.common.loading--;
          console.log(err);
          window.location.reload();
        });        
      }
    }
}
