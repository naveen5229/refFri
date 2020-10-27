import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorReportComponent } from '../error-report/error-report.component';
import { CsvErrorReportComponent } from '../../../modals/csv-error-report/csv-error-report.component';
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
  foUser = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '500');

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


  selectFoUser(user) {
    this.foUser = user.id;
  }

  uploadCsv() {
    const params = {
      driverCsv: this.csv,
      foid: this.foUser
    };
    if (!params.driverCsv && !params.foid) {
      return this.common.showError("Select  Option");
    }
    this.common.loading++;
    this.api.post('Drivers/ImportDriversCsv', params)
      .subscribe(res => {
        this.common.loading--;
        let successData =  res['data']['success'];
        let errorData =res['data']['fail'];
        alert(res["msg"]);
        this.common.params = { apiData: params,successData, errorData, title: 'Bulk Vehicle csv Verification',isUpdate:false };
        const activeModal = this.modalService.open(CsvErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  
        this.closeModal(true);
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
        if (file.type == "application/vnd.ms-excel") {
        }
        else {
          alert("valid Format Are : csv");
          return false;
        }

        res = res.toString().replace('vnd.ms-excel', 'csv');
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
