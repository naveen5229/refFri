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
      this.document = this.common.params.rowData;
      console.log("doc params rcvd");
      console.log(this.document);
      this.vehicleId = this.document.vehicle_id;
      this.agentId = this.document.agent_id; 
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
    
  }
  getDate(date) {
    
  }

  addAgent() {
    
  }
  
  findDocumentType(id) {
    
  }
  selectDocType(docType) {
    
  }

  handleFileSelection(event) {
    
  }
  UploadData() {
    
  }
}
