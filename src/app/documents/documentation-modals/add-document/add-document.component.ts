import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
@Component({
  selector: 'add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss', '../../../pages/pages.component.css']
})
export class AddDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';

  documentData = [{}];

  docImg: '';
  docid = '';
  docType = '';
  issue_date = '';
  wef_date: '';
  expiry_date: '';
  documentNumber: '';
  remark: '';
  agentId: '';
  rto: '';

  agents = [];
  docTypes = [];
  vehicle = null;

  // for convert a image in base64 text string 
  img = 'data:image/png;base64,';
  base64textString = '';
  handleFileSelect(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvt) {
    this.common.loading++;
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    console.log("image", this.img);
    this.base64textString = this.img.concat(this.base64textString);
    this.common.loading--;
    // console.log("base 64",(this.base64textString));
  }



  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicle = this.common.params.details.vehicle_info[0];
    this.agents = this.common.params.details.document_agents_info;
    this.docTypes = this.common.params.details.document_types_info;
  }

  ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });

  }
  addDocument() {
    this.documentData = [{
      regno: this.vehicle.regno,
      x_vehicle_id: this.vehicle.id,
      x_document_type_id: this.docid,
      x_document_type: this.docType,
      x_issue_date: this.issue_date,
      x_wef_date: this.wef_date,
      x_expiry_date: this.expiry_date,
      x_document_agent_id: this.agentId,
      x_document_number: this.documentNumber,
      x_base64img: this.base64textString,
      x_rto: this.rto,
      x_remarks: this.remark
    }];
    console.log("Vehicle Id", this.documentData);
    this.common.loading++;
    this.api.post('Vehicles/addVehicleDocument', { 

      x_vehicle_id: this.vehicle.id,
      x_document_type_id: this.docid,
      x_document_type: this.docType,
      x_issue_date: this.issue_date,
      x_wef_date: this.wef_date,
      x_expiry_date: this.expiry_date,
      x_document_agent_id: this.agentId,
      x_document_number: this.documentNumber,
      x_base64img: this.base64textString,
      x_rto: this.rto,
      x_remarks: this.remark

     })
      .subscribe(res => {
        this.common.loading--;
        console.log("api result", res);
        console.log("Result", this.documentData);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
      
        this.activeModal.close;
    
    
  }


  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    this.activeModal.close({});
  }

}
