import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { ImageViewComponent} from '../../../modals/image-view/image-view.component';

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
  spnexpdt = 0;
  current_date = new Date();
  images = [];

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
      if(this.document.issue_date)
        this.document.issue_date = this.common.dateFormatter(this.document.issue_date, 'ddMMYYYY').split(' ')[0];

      console.log("doc params rcvd");
      console.log(this.document);
      console.log("typid:" + this.document.document_type_id);
      this.vehicleId = this.document.vehicle_id;
      this.agentId = this.document.agent_id;
      this.getDocumentsData();
      this.document.document_type = this.findDocumentType(this.document.document_type_id);
      console.log("doctype:" + this.document.document_type);
      this.images.push({name : "doc-img", image: this.document.img_url});
      this.common.params = { title : "Doc Image", images: this.images};
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

  checkExpiryDateValidity() {
    let issuedt_valid = 1;
    let wefdt_valid= 1;
    if(this.document.issue_date != "undefined" && this.document.expiry_date != "undefined") {
      if(this.document.issue_date && this.document.expiry_date)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issue_date, this.document.expiry_date);
    }
    if(this.document.wef_date != "undefined" && this.document.expiry_date != "undefined") {
      if(this.document.wef_date && this.document.expiry_date)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wef_date, this.document.expiry_date);
    }
    if(!issuedt_valid || !wefdt_valid) {
      this.common.showError("Please check the Expiry Date validity");
    }
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
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if(this.document.issue_date != "undefined" && this.document.expiry_date != "undefined") {
      if(this.document.issue_date && this.document.expiry_date)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.issue_date, this.document.expiry_date);
    }
    if(this.document.wef_date != "undefined" && this.document.expiry_date != "undefined") {
      if(this.document.wef_date && this.document.expiry_date)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.wef_date, this.document.expiry_date);
    }    
    if(issuedt_valid && wefdt_valid) {
      this.spnexpdt = 0;
    } else {
      this.spnexpdt = 1;
    }
    
    if(this.spnexpdt) {
      this.common.showError("Please check the Expiry Date validity");
      return false;
    }
    if(this.document.issue_date)
      params.x_issue_date = this.document.issue_date.split("/").reverse().join("-");
    if(this.document.wef_date)
      params.x_wef_date = this.document.wef_date.split("/").reverse().join("-");
    if(this.document.expiry_date)
      params.x_expiry_date = this.document.expiry_date.split("/").reverse().join("-");
    
    console.log("params");
    console.log(params);
    
    this.common.loading++;
    let response;
    this.api.post('Vehicles/addVehicleDocument', params)
    .subscribe(res => {
      this.common.loading--;
      console.log("api result", res);
      this.closeModal(true);
      window.location.reload();
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
        this.document[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('Date:', this.document[date]);
      }

    });
  }

  setDate(date){
    console.log("fetch Date",date);
    this.document[date] = this.common.dateFormatter(this.document.issue_date, 'ddMMYYYY').split(' ')[0];
    console.log('Date:', this.document[date]);
   }

  checkExpiryDateValidityByValue(flddate, expdate) {
    let strdt1 = flddate.split("/").reverse().join("-");
    let strdt2 = expdate.split("/").reverse().join("-");
    flddate = this.common.dateFormatter(strdt1).split(' ')[0];
    expdate = this.common.dateFormatter(strdt2).split(' ')[0];
    console.log("comparing " + flddate + "-" + expdate);
    let d1 = new Date(flddate);
    let d2 = new Date(expdate);
    if(d1 > d2) {
      this.spnexpdt = 1;
      return 0;
    }
    return 1;
  }
  
  addAgent() {
    this.common.params = { title: 'Add Agent' };
    const activeModal = this.modalService.open(AddAgentComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(agtdata => {
      if (agtdata.response) {
        console.log("agtdata:");
        console.log(agtdata.response);
        this.common.loading++;
        this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
          .subscribe(res => {
            this.common.loading--;
            console.log("data", res);
            this.agents = res['data'].document_agents_info;
            console.log("agents:");
            console.log(this.agents);
            if(this.agents.length) {
              console.log("list");
              console.log(this.agents);
              this.document.agent_id = this.agents[this.agents.length-1].id;
              this.document.agent = this.agents[this.agents.length-1].name;
              console.log(this.document.agent_id + "->" + this.document.agent + " added");
            }

          }, err => {
            this.common.loading--;
            console.log(err);
          });
      }
    });

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
    /*
    let documentType = '';
    this.docTypes.map(docType => {
      if (docType.id == id) {
        documentType = docType.document_type
        console.log("document Type", documentType);
      }
    });
    return documentType;*/
  }
  selectDocType(docType) {
    this.document.document_type_id = docType.id;
    console.log('Doc id: ', docType.id);
    console.log("doc var",this.document.document_type_id);
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.document.vehicle_id = vehicle.id;
  }
}
