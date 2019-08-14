import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CsvErrorReportComponent } from '../../modals/csv-error-report/csv-error-report.component';

@Component({
  selector: 'import-fillings',
  templateUrl: './import-fillings.component.html',
  styleUrls: ['./import-fillings.component.scss', '../../pages/pages.component.css']
})
export class ImportFillingsComponent implements OnInit {
  isFuelFlag = false;
  fuel_station_id = 0;
  fuel_station_name = '';
  foid = 0;
  fo_name = '';

  fillingcsv = null;

  isfull = false;


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '800');


  }

  ngOnInit() {
  }

  checkFuelFlag(isFuelFlag) {
    console.log("isFuelFlag ", isFuelFlag)
    isFuelFlag ? this.getStnData(null, true) : this.getStnData({ name: null, id: null });
  }
  getStnData(station, isNull = false) {
    this.fuel_station_id = isNull ? -1 : station.id;
    this.fuel_station_name = isNull ? "Null" : station.name;
  }

  getFoData(fodata) {
    this.foid = fodata.id;
    this.fo_name = fodata.name;
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;


        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxml") {
          alert("Select valid Format Are : CSV,xlsx");
          return false;
        }
        res = res.toString().replace('vnd.ms-excel', 'csv');
        console.log('Base 64: ', res);
        this.fillingcsv = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  submitFillingData() {
    const params = {
      fuelCsv: this.fillingcsv,
      foid: this.foid,
      stationId: this.fuel_station_id,
      // isFull: this.isfull,
      isValidate: true
    };

    if (!params.fuelCsv) {
      return this.common.showError("Select csv");
    }
    console.log("Data :", params);

    this.common.loading++;
    this.api.post('FuelDetails/ImportFuelFilingsCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let successData = res['data']['success'];
        let errorData = res['data']['fail'];
        console.log("error: ", errorData);
        alert(res["msg"]);
        this.common.params = { apiData: params, successData, errorData, title: 'Fuel csv Verification', isUpdate: true };
        const activeModal = this.modalService.open(CsvErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  sampleCsv() {
    window.open("http://13.126.215.102/sample/csv/sample_fuelFilling.csv");
  }
}
