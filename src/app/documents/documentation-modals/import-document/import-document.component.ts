import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorReportComponent } from '../error-report/error-report.component';
@Component({
  selector: 'import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss', '../../../pages/pages.component.css']
})
export class ImportDocumentComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  btn3 = '';

  upload = {
    csv: null,
    foid: ''
  };
  csv = null;
  docType = {
    id: '',
    type: ''
  };
  vehicleId = '';
  // data = [];
  // docTypes = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-m', '500');

    this.title = this.common.params.title;
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.btn3 = this.common.params.btn3 || 'Validate';
    this.vehicleId = this.common.params.vehicleId;
    // this.getDocumentsData();

  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  // getDocumentsData() {
  //   this.common.loading++;
  //   let response;
  //   this.api.post('Vehicles/getAddVehicleFormDetails', { x_vehicle_id: this.vehicleId })
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log("data", res);
  //       this.docTypes = res['data'].document_types_info;
  //       console.log("new doc type", this.docTypes);
  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  //   return response;
  // }

  selectDocType(documentType) {
    this.docType = documentType;
    console.log("Document type", this.docType.id);
  }

  uploadCsv() {
    const params = {
      vehicleDocCsv: this.csv,
    };
    if (!params.vehicleDocCsv) {
      return this.common.showError("Select  Option");
    }
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('Drivers/ImportDriversCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let errorData = res['data'];
        alert(res["msg"]);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  checkCsv(validate = null) {
    const params = {
      vehicleDocCsv: this.csv,
      validate: validate,
      docTypeId: this.docType.id
    };
    if (!params.vehicleDocCsv) {
      return this.common.showError("Select  Option");
    }
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('Drivers/ImportDriversCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let errorData = res['data'];
        this.common.params = { errorData, ErrorReportComponent, title: 'Document Verification' };
        const activeModal = this.modalService.open(ErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;


        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "application/vnd.ms-excel") {
        }
        else {
          alert("valid Format Are : csv");
          return false;
        }

        res = res.toString().replace('vnd.ms-excel', 'csv');
        console.log('Base 64: ', res);
        this.csv = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  sampleCsv() {
    window.open("http://13.126.215.102/sample/csv/sample_document_upload.csv");
  }
}
