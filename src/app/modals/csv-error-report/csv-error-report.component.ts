import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'csv-error-report',
  templateUrl: './csv-error-report.component.html',
  styleUrls: ['./csv-error-report.component.scss', '../../pages/pages.component.css']
})
export class CsvErrorReportComponent implements OnInit {
  title = '';
  btn = '';
  errors = [];
  success = [];
  columns = [];
  selectOption = 'fail';

  csvData = {
    fuelcsv: null,
    foid: null,
    isfuel: null,
    stationId: null,

  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1024');
    this.title = this.common.params.title || 'Error Report';
    this.btn = this.common.params.btn || 'update';
    this.errors = this.common.params.errorData;
    this.success = this.common.params.successData;
    this.csvData = this.common.params.apiData;
    this.csvData.fuelcsv = this.common.params.apiData.fuelCsv;
    this.csvData.isfuel = this.common.params.apiData.isFull;
    this.csvData.foid = this.common.params.apiData.foid;
    this.csvData.stationId = this.common.params.apiData.stationId;
    this.selectOption;
    console.log("csv Data:", this.csvData);

    this.columnSperate();
  }

  ngOnDestroy(){}
ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  report(type) {
    console.log("test", type);
    this.selectOption = type;
    this.columnSperate();
  }

  columnSperate() {
    this.columns = [];
    if (this.selectOption == 'fail') {
      if (this.errors.length) {
        for (var key in this.errors[0]) {
          if (key.charAt(0) != "_")
            this.columns.push(key);
        }
        console.log("columns");
        console.log(this.columns);
      }
    }
    else if (this.selectOption == 'success') {
      if (this.success.length) {
        for (var key in this.success[0]) {
          if (key.charAt(0) != "_")
            this.columns.push(key);
        }
        console.log("columns");
        console.log(this.columns);
      }
    }



  }
  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  uploadCsv() {
    const params = {
      fuelCsv: this.csvData.fuelcsv,
      foid: this.csvData.foid,
      stationId: this.csvData.stationId,
      isFull: this.csvData.isfuel,
      isValidate: false
    };

    console.log("Data :", params);

    this.common.loading++;
    this.api.post('FuelDetails/ImportFuelFilingsCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);

        this.common.showToast(res['msg']);

        this.activeModal.close();


      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }


}
