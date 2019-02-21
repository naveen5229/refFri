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
  agents = [];
  docTypes = [];
  docType = null;
  vehicleId= null;
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
    newDocUpload: '',
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
    // this.document.docUpload =this.document[0].docUpload;
    this.document.rto = this.document[0].rto;
    this.document.remark = this.document[0].remark;
    this.document.amount = this.document[0].amount;
    this.getDocumentsData();
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  ngOnInit() {
  }
  getDocumentsData() {
    this.common.loading++;
    let response;
    this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  updateDocument() {
    const params = {
      x_vehicle_id: this.vehicleId,
      x_document_id: this.document.docId,
      x_document_type_id: this.document.documentId,
      x_document_type: this.findDocumentType(this.document.documentId),
      x_issue_date:this.document.issueDate,
      x_wef_date:this.document.wefDate,
      x_expiry_date:this.document.expiryDate,
      x_document_agent_id: this.document.agentId,
      x_document_number: this.document.documentNumber,
      x_base64img: this.document.docUpload,
      x_rto: this.document.rto,
      x_remarks: this.document.remark,
      x_amount: this.document.amount,
    };

    this.common.loading++;
    let response;
    this.api.post('Vehicles/addVehicleDocument', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("api result", res);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }

  // dateSelect(date){
  //   this.document[date] = this.common.dateFormatter1(this.document.issueDate).split(' ')[0];
  //   console.log('Date:', this.document[date]);
  //    }
     
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Edit Date:', this.document[date]);
      }
    });
  }

  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentsData();
      }
    });
  }

  findDocumentType(id) {
    let documentType = '';
    console.log("id:", id);
    console.log("docTypes:", this.docTypes);
    this.docTypes.map(docType => {
      // console.log("doc Type: ",docType);
      if (docType.id == id) {
        documentType = docType.document_type
        console.log("document Type", documentType);
      }
    });
    return documentType;
  }

  selectDocType(docType) {
    this.document.documentId = docType.id
    console.log("doc var", this.document.documentId);
    return this.document.documentId;
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        console.log('Base 64: ', res);
        this.document.docUpload = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  UploadData() {
    window.open(document[0].docUpload);
  }
}
