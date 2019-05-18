import { Component, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
<<<<<<< HEAD
=======
import { ErrorCoomonVehiclesComponent } from '../../modals/error-coomon-vehicles/error-coomon-vehicles.component';
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
@Component({
  selector: 'import-bulk-vehicles',
  templateUrl: './import-bulk-vehicles.component.html',
  styleUrls: ['./import-bulk-vehicles.component.scss']
})
export class ImportBulkVehiclesComponent implements OnInit {
  csv = null;
<<<<<<< HEAD
=======
  foid = null;
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }
  sampleCsv() {
<<<<<<< HEAD
    window.open("http://13.126.215.102/sample/csv/sample_document_upload.csv");
=======
    window.open("http://13.126.215.102/sample/csv/sample_bulk_vehicle_upload.csv");
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
  }
  closeModal() {
    this.activeModal.close();
  }
<<<<<<< HEAD
=======
  selectFoUser(user) {
    this.foid = user.id;

  }
  cancelModal() {
    this.activeModal.close();
  }
>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
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
<<<<<<< HEAD
  selectFoUser(e) {

  }
  uploadCsv() {

  }
=======
  uploadCsv() {
    const params = {
      vehicleBulkCsv: this.csv,
      foid: this.foid
    };
    if (!params.vehicleBulkCsv && !params.foid) {
      return this.common.showError("Select  Option");
    }
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('Gisdb/addBulkVehicle', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let output = res['success'];
        let errorData = res['data'];
        if (output == false) {
          this.common.params = { errorData, ErrorCoomonVehiclesComponent, title: 'Vehicle Verification' };
          const activeModal = this.modalService.open(ErrorCoomonVehiclesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        }

        else {

          this.activeModal.close();
        }

        // this.common.params = { errorData, ErrorReportComponent, title: 'Document Verification' };
        // const activeModal = this.modalService.open(ErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });


        // this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

>>>>>>> cb114ae9b08206066b54a3ed299bd01ac75abe6b
}
