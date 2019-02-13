import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { DocumentationDetailsComponent } from "../../documentation-details/documentation-details.component";
@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss', '../../../pages/pages.component.css']
})
export class AddDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  vehicleId = '';

  document = {
    image: '',
    base64Image: null,
    type: {
      id: '',
      name: ''
    },
    dates: {
      issue: '',
      wef: '',
      expiry: ''
    },
    number: '',
    remark: '',
    rto: '',
    agent: {
      id: '',
      name: '',
    },
    amount: '',
  }

  agents = [];
  docTypes = [];
  vehicle = null;
  isFormSubmit = false;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicleId = this.common.params.vehicleId;
    this.getDocumentsData();
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
        this.vehicle = res['data'].vehicle_info[0];
        this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;
  }


  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        console.log('Base 64: ', res);
        this.document.base64Image = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }



  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  addDocument() {
    const params = {
      x_vehicle_id: this.vehicle.id,
      x_document_type_id: this.document.type.id,
      x_document_type: this.findDocumentType(this.document.type.id),
      x_issue_date: this.document.dates.issue,
      x_wef_date: this.document.dates.wef,
      x_expiry_date: this.document.dates.expiry,
      x_document_agent_id: this.document.agent.id,
      x_document_number: this.document.number,
      x_base64img: this.document.base64Image,
      x_rto: this.document.rto,
      x_remarks: this.document.remark,
      x_amount: this.document.amount,

    };
    console.log('Params: ', params);
    this.common.loading++;
    this.api.post('Vehicles/addVehicleDocument', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("api result", res);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.document.dates[date]);
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
  // findDocumentType(type) {
  //   let id = '';
  //   console.log("id:",type);
  //   console.log("docTypes:",this.docTypes);
  //   this.docTypes.map(docType => {
  //     // console.log("doc Type: ",docType);
  //     if (docType.document_type == type) {
  //      id = docType.id
  //       console.log("document id", id);
  //     }
  //   });
  //   return  id;
  // }

  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });

    activeModal.result.then(data => {
      if (data.response) {
        this.getDocumentsData();
      }
    });

  }

  selectDocType(docType) { 
    this.document.type.id = docType.id
    console.log('Doc id: ', docType.id);
    console.log("doc var",this.document.type.id);
  }

}
