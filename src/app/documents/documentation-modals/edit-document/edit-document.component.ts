import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
@Component({
  selector: 'edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss', '../../../pages/pages.component.css']
})
export class EditDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  spnexpdt = 0;
  agents = [];
  docTypes = [];
  docType = null;
  vehicleId = null;
  images = [];
  doc_not_img = 0;

  document = {
    docId: null,
    regno: null,
    regNumber: null,
    documentType: '',
    documentId: null,
    issueDate: null,
    wefDate: null,
    expiryDate: null,
    agentId: null,
    agentName: null,
    documentNumber: null,
    docUpload: null,
    docUpload2: null,
    docUpload3: null,
    remark: null,
    rto: null,
    amount: null,
    dates: {
      issue: '',
      wef: '',
      expiry: ''
    }
  };
  isFormSubmit = false;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Update';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.vehicleId = this.common.params.vehicleId;
    this.document = this.common.params.documentData;
    this.document.docId = this.document[0].id;
    this.document.regNumber = this.document[0].regNumber;
    this.document.documentId = this.document[0].documentId;
    this.document.documentType = this.document[0].documentType;
    this.document.issueDate = this.document[0].issueDate;
    this.document.wefDate = this.document[0].wefDate;
    this.document.expiryDate = this.document[0].expiryDate;
    this.document.agentId = this.document[0].agentId;
    this.document.documentNumber = this.document[0].documentNumber;
    this.document.docUpload = this.document[0].docUpload;
    this.document.docUpload2 = this.document[0].docUpload2;
    this.document.docUpload3 = this.document[0].docUpload3;
    this.document.rto = this.document[0].rto;
    this.document.remark = this.document[0].remark;
    this.document.amount = this.document[0].amount;
    this.getDocumentsData();
    if (this.document.docUpload != "undefined" && this.document.docUpload) {
      this.images.push(this.document.docUpload);
    }
    if (this.document.docUpload2 != "undefined" && this.document.docUpload2) {
      this.images.push(this.document.docUpload2);
    }
    if (this.document.docUpload3 != "undefined" && this.document.docUpload3) {
      this.images.push(this.document.docUpload3);
    }
    this.common.handleModalSize('class', 'modal-lg', '1200');
    if (this.document.issueDate) {
      this.document.issueDate = this.common.dateFormatter(this.document.issueDate, 'ddMMYYYY').split(' ')[0];
    }
    if (this.document.wefDate) {
      this.document.wefDate = this.common.dateFormatter(this.document.wefDate, 'ddMMYYYY').split(' ')[0];
    }
    if (this.document.expiryDate) {
      this.document.expiryDate = this.common.dateFormatter(this.document.expiryDate, 'ddMMYYYY').split(' ')[0];
    }
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  ngOnInit() {
  }
  getDocumentsData() {
    this.common.loading++;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
      .subscribe(res => {
        this.common.loading--;
        this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;
        if (this.document.docUpload) {
          if ((this.document.docUpload.indexOf('.pdf') > -1) || (this.document.docUpload.indexOf('.doc') > -1) || (this.document.docUpload.indexOf('.docx') > -1) || (this.document.docUpload.indexOf('.xls') > -1) || (this.document.docUpload.indexOf('.xlsx') > -1) || (this.document.docUpload.indexOf('.csv') > -1)) {
            this.doc_not_img = 1;
          }
          this.images.push({ name: "doc-img", image: this.document.docUpload });
          this.common.params = { title: "Doc Image", images: this.images };
        }

        if (this.document.docUpload2) {
          if ((this.document.docUpload2.indexOf('.pdf') > -1) || (this.document.docUpload2.indexOf('.doc') > -1) || (this.document.docUpload2.indexOf('.docx') > -1) || (this.document.docUpload2.indexOf('.xls') > -1) || (this.document.docUpload2.indexOf('.xlsx') > -1) || (this.document.docUpload2.indexOf('.csv') > -1)) {
            this.doc_not_img = 1;
          }
          this.images.push({ name: "doc-img", image: this.document.docUpload2 });
          this.common.params = { title: "Doc Image", images: this.images };
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  checkExpiryDateValidity() {
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.issueDate != "undefined" && this.document.expiryDate != "undefined") {
      if (this.document.issueDate && this.document.expiryDate)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issueDate, this.document.expiryDate);
    }
    if (this.document.wefDate != "undefined" && this.document.expiryDate != "undefined") {
      if (this.document.wefDate && this.document.expiryDate)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wefDate, this.document.expiryDate);
    }
    if (!issuedt_valid || !wefdt_valid) {
      this.common.showError("Please check the Expiry Date validity");
    }
  }

  checkExpiryDateValidityByValue(flddate, expdate) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    let d1 = new Date(flddate);
    let d2 = new Date(expdate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      this.common.showError("Invalid Date. Date formats should be dd/mm/yyyy");
      return 0;
    }
    if (d1 > d2) {
      this.spnexpdt = 1;
      return 0;
    }
    return 1;
  }

  updateDocument() {
    const params = {
      x_vehicle_id: this.vehicleId,
      x_user_id: this.user._details.id,
      x_document_id: this.document.docId,
      x_document_type_id: this.document.documentId,
      x_document_type: this.findDocumentType(this.document.documentId),
      x_issue_date: this.document.issueDate,
      x_wef_date: this.document.wefDate,
      x_expiry_date: this.document.expiryDate,
      x_document_agent_id: this.document.agentId,
      x_document_number: this.document.documentNumber,
      x_rto: this.document.rto,
      x_remarks: this.document.remark,
      x_amount: this.document.amount,
    };

    if (!this.document.documentId) {
      alert("Select Document Type");
    }

    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.issueDate != "undefined" && this.document.expiryDate != "undefined") {
      if (this.document.issueDate && this.document.expiryDate)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issueDate, this.document.expiryDate);
    }
    if (this.document.wefDate != "undefined" && this.document.expiryDate != "undefined") {
      if (this.document.wefDate && this.document.expiryDate)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wefDate, this.document.expiryDate);
    }
    if (issuedt_valid && wefdt_valid) {
      this.spnexpdt = 0;
    } else {
      this.spnexpdt = 1;
    }

    if (this.spnexpdt) {
      this.common.showError("Please check the Expiry Date validity");
      return false;
    }

    if (this.document.issueDate) {
      params.x_issue_date = this.document.issueDate.split("/").reverse().join("-");
      let strdt = new Date(params.x_issue_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Issue Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (this.document.wefDate) {
      params.x_wef_date = this.document.wefDate.split("/").reverse().join("-");
      let strdt = new Date(params.x_wef_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Wef Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (this.document.expiryDate) {
      params.x_expiry_date = this.document.expiryDate.split("/").reverse().join("-");
      let strdt = new Date(params.x_expiry_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Expiry Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (params.x_issue_date) {
      params.x_issue_date = this.document.issueDate.split("/").reverse().join("-");
    }
    if (params.x_wef_date) {
      params.x_wef_date = this.document.wefDate.split("/").reverse().join("-");
    }
    if (params.x_expiry_date) {
      params.x_expiry_date = this.document.expiryDate.split("/").reverse().join("-");
    }

    this.common.loading++;
    this.api.post('Vehicles/updateVehicleDocumentByCustomer', params)
      .subscribe(res => {
        this.common.loading--;
        let result = (res['msg']);
        if (result == "success") {
          alert(res['msg']);
          this.closeModal(true);
        }
        else {
          alert(result);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        return this.document[date];
      }
    });
  }

  getDateInDisplayFormat(strdate) {
    if (strdate)
      return strdate.split("-").reverse().join("/");
    else
      return strdate;
  }

  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentsData();
      }
    });
  }

  findDocumentType(id) {
    let documentType = '';
    this.docTypes.map(docType => {
      if (docType.id == id) {
        documentType = docType.document_type
      }
    });
    return documentType;
  }

  selectDocType(docType) {
    this.document.documentId = docType.id
    return this.document.documentId;
  }

  checkType(event) {
    let id = event.target.value;
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

        }
        else {
          alert("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  UploadData() {
    window.open(document[0].docUpload);
  }
}
