import { Component, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'import-bulk-vehicles',
  templateUrl: './import-bulk-vehicles.component.html',
  styleUrls: ['./import-bulk-vehicles.component.scss']
})
export class ImportBulkVehiclesComponent implements OnInit {
  csv = null;

  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }
  sampleCsv() {
    window.open("http://13.126.215.102/sample/csv/sample_document_upload.csv");
  }
  closeModal() {
    this.activeModal.close();
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
  selectFoUser(e) {

  }
  uploadCsv() {

  }
}
