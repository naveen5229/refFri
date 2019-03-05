import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentComponent } from '../add-agent/add-agent.component';
import { DatePickerComponent } from '../../../modals/date-picker/date-picker.component';
import { DatePicker2Component } from '../../../modals/date-picker2/date-picker2.component';
import { DocumentationDetailsComponent } from "../../documentation-details/documentation-details.component";
import { from } from 'rxjs';
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
  spnexpdt = 0;

  document = {
    image: '',
    base64Image: null,
    type: {
      id: '',
      name: ''
    },
    dates: {
      issue: null,
      wef: null,
      expiry: null
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
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';

    this.vehicleId = this.common.params.vehicleId;

    if (this.document.dates.issue)
      this.document.dates.issue = this.common.dateFormatter(this.document.dates.issue, 'ddMMYYYY').split(' ')[0];
    if (this.document.dates.wef)
      this.document.dates.wef = this.common.dateFormatter(this.document.dates.wef, 'ddMMYYYY').split(' ')[0];
    if (this.document.dates.expiry)
      this.document.dates.expiry = this.common.dateFormatter(this.document.dates.expiry, 'ddMMYYYY').split(' ')[0];

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
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showError("SuccessFull File Selected");
        }
        else {
          //  alert("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }

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
  checkExpiryDateValidity() {
    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.dates.issue != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.issue && this.document.dates.expiry)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.dates.issue, this.document.dates.expiry);
    }
    if (this.document.dates.wef != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.wef && this.document.dates.expiry)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.dates.wef, this.document.dates.expiry);
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
    console.log("comparing " + flddate + "-" + expdate);
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

    let issuedt_valid = 1;
    let wefdt_valid = 1;
    if (this.document.dates.issue != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.issue && this.document.dates.expiry)
        issuedt_valid = this.checkExpiryDateValidityByValue(this.document.dates.issue, this.document.dates.expiry);
    }
    if (this.document.dates.wef != "undefined" && this.document.dates.expiry != "undefined") {
      if (this.document.dates.wef && this.document.dates.expiry)
        wefdt_valid = this.checkExpiryDateValidityByValue(this.document.dates.wef, this.document.dates.expiry);
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

    if (this.document.dates.issue) {
      params.x_issue_date = this.document.dates.issue.split("/").reverse().join("-");
      let strdt = new Date(params.x_issue_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Issue Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (this.document.dates.wef) {
      params.x_wef_date = this.document.dates.wef.split("/").reverse().join("-");
      let strdt = new Date(params.x_wef_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Wef Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (this.document.dates.expiry) {
      params.x_expiry_date = this.document.dates.expiry.split("/").reverse().join("-");
      let strdt = new Date(params.x_expiry_date);
      if (isNaN(strdt.getTime())) {
        this.common.showError("Invalid Expiry Date. Date formats should be dd/mm/yyyy");
        return false;
      }
    }
    if (!this.document.type.id) {
      return this.common.showError("Select Document Type");
    }
    if (!this.document.base64Image) {
      return this.common.showError("Select Document Image/File");
    }

    console.log('Params: ', params);
    this.common.loading++;
    this.api.post('Vehicles/addVehicleDocument', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("api result", res);
        let result=res["msg"];
        
        if (result=="success") {
          this.common.showError("Success");
          this.closeModal(true);
        }
        else{
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
        this.document.dates[date] = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
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
    console.log("doc var", this.document.type.id);

  }
}