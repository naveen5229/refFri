import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'pending-licence-detail',
  templateUrl: './pending-licence-detail.component.html',
  styleUrls: ['./pending-licence-detail.component.scss']
})
export class PendingLicenceDetailComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  canUpdate = 1;
  doc_not_img = 0;
  images = [];
  imgs = [];

  driver = {
    id: null,
    is_verified: null,
    empname: null,
    licence_no: null,
    licence_photo: null,
    newicenceno: null,
    effective_date: null,
    expiry_date: null,
    ntexpiry_date: null,
    dob: null,
    licence_type: null,
    lcv:null,
    mcv: null,
    hcv: null,
    remarks: null,
    address: null
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) { 
      this.common.handleModalSize('class', 'modal-lg', '1200');
      this.title = this.common.params.title;
      this.btn1 = this.common.params.btn1 || 'Update';
      console.log("rowdata:");
      console.log(this.common.params.rowData);
      let rowData = this.common.params.rowData;
      this.driver.id=rowData.driver_id;
      this.driver.empname=rowData.empname;
      this.driver.licence_no=rowData.licence_no;
      this.driver.licence_photo=rowData.licence_photo;
      if(rowData.licence_photo) {
        this.images.push(rowData.licence_photo);
      }
      this.driver.remarks=rowData.remarks;
      if (!this.common.params.canUpdate) {
        this.canUpdate = 0;
      }
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  validateLicenceno(elt) {
    let strval = elt.target.value;
    elt.target.value = (strval.replace(" ", "")).toUpperCase();
  }

  updateDocument(type){

  }
}
