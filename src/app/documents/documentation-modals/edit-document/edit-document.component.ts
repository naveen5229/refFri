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
  styleUrls: ['./edit-document.component.scss','../../../pages/pages.component.css']
})
export class EditDocumentComponent implements OnInit {
 
  title = '';
  btn1 = '';
  btn2 = '';
  agents = [];
  docTypes = [];
  docType = null;
  vehicleId : null;
  document = {
   
    regno :null,
    regNumber:null ,
    documentType:null,
    documentId :null ,
    issueDate :null,
    wefDate :null ,
    expiryDate :null ,
    agentId:null,
    agentName :null,
    documentNumber :null ,
    docUpload : null,
    remark :null ,
    rto : null,
    amount : null,
    }
    // vehicleId : null,
    // regno :'',
  

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
     console.log("edit data",this.document);
    //  this.document.vehicleId = this.document[0].vehicleId;
     this.document.regNumber= this.document[0].regNumber;
     this.document.documentId = this.document[0].documentId;
     this.document.documentType = this.document[0].documentType;
    //  this.docType={id:this.document.documentId,document_type:this.document.documentType};
     this.document.issueDate = this.document[0].issueDate;
     this.document.wefDate = this.document[0].wefDate;
     this.document.expiryDate = this.document[0].expiryDate;
     this.document.agentId = this.document[0].agentId;
    // console.log("agent id",this.document.agentId);
    //  this.document.agentName = this.document[0].agentName;
     this.document.documentNumber = this.document[0].documentNumber;
     //this.document.docUpload =this.document[0].docUpload;
     this.document.rto =this.document[0].rto;
     this.document.remark =this.document[0].remark;
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
        // this.vehicle = res['data'].vehicle_info[0];
        this.agents = res['data'].document_agents_info;
        this.docTypes = res['data'].document_types_info;
        this.selectDocType({id:this.document.documentId,document_type:this.document.documentType});
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    }

  
 
  updateDocument(){
    console.log("agent id",this.document.agentId);
    console.log("doc id",this.document.documentId);
console.log("doc type",this.document.documentType);
  
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
    console.log("doc var",this.document.documentId);
  }

 
}
