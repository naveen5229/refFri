import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
@Component({
  selector: 'pending-document',
  templateUrl: './pending-document.component.html',
  styleUrls: ['./pending-document.component.scss', '../../../pages/pages.component.css']
})
export class PendingDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  agents = [];
  docTypes = [];
  vehicleId = 0;
  agentId = '';
  canUpdate = 1;
  canreadonly = false;

  document = {
    agent: null,
    agent_id: null,
    amount: null,
    doc_no: null,
    document_type: null,
    document_type_id: null,
    expiry_date: null,
    issue_date: null,
    id: null,
    img_url: null,
    regno: null,
    remarks: null,
    rto: null,
    vehicle_id: null,
    wef_date: null
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    
      this.title = this.common.params.title;
      this.btn1 = this.common.params.btn1 || 'Update';
      this.btn2 = this.common.params.btn2 || 'Cancel';
      console.log("commonparams: ");
      console.log(this.common.params);
      if(!this.common.params.canUpdate) {
        this.canUpdate = 0;
        this.canreadonly = true;        
      }

      this.document = this.common.params.rowData;

      console.log("doc params rcvd");
      console.log(this.document);
      console.log("typid:" + this.document.document_type_id);
      this.vehicleId = this.document.vehicle_id;
      this.agentId = this.document.agent_id; 
      this.getDocumentsData();
      this.document.document_type = this.findDocumentType(this.document.document_type_id);
      console.log("doctype:" + this.document.document_type);
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

        console.log("in typid:" + this.document.document_type_id);
        for(var i=0; i<this.docTypes.length; i++) {
          if(this.docTypes[i].id == this.document.document_type_id) {
            this.document.document_type = this.docTypes[i].document_type;
            console.log("dt=" + this.document.document_type);
          }
        }

        console.log("agentid:" + this.agentId);
        this.markAgentSelected(this.agentId);


      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  markAgentSelected(option_val) {
      var elt = document.getElementById('doc_agent') as HTMLSelectElement;
      
      console.log("option:" + option_val);
      /*for(var i=0; i < elt.options.length; i++) {
        console.log("i=" + i + ", val:" + elt.options[i].value);
        if(elt.options[i].value == option_val) {
          elt.selectedIndex = i;
          break;
        }
      }*/
  }


  updateDocument() {
    const params = {
      x_vehicle_id: this.document.vehicle_id,
      x_document_id: this.document.id,
      x_document_type_id: this.document.document_type_id,
      x_document_type: this.findDocumentType(this.document.document_type_id),
      x_issue_date: this.document.issue_date,
      x_wef_date: this.document.wef_date,
      x_expiry_date: this.document.expiry_date,
      x_document_agent_id: this.document.agent_id,
      x_document_number: this.document.doc_no,
      x_rto: this.document.rto,
      x_remarks: this.document.remarks,
      x_amount: this.document.amount,

    };
    console.log("params");
    console.log(params);
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
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.document[date] = this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.document[date]);
      }

    });
  }

  addAgent() {
    
  }
  
  findDocumentType(id) {
    console.log(this.docTypes);
    console.log("idpassed:" + id);
    for(var i=0; i< this.docTypes.length; i++) {
      console.log("val:" + this.docTypes[i]);
      if(this.docTypes[i].id == id) {
        return this.docTypes[i].document_type;
      }
    }
    
    let documentType = '';
    this.docTypes.map(docType => {
      if (docType.id == id) {
        documentType = docType.document_type
        console.log("document Type", documentType);
      }
    });
    return documentType;
  }
  selectDocType(docType) {
    this.document.document_type_id = docType.id;
    console.log('Doc id: ', docType.id);
    console.log("doc var",this.document.document_type_id);
  }

  handleFileSelection(event) {
    
  }
  UploadData() {
    
  }
}
