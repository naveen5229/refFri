import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-fillings',
  templateUrl: './import-fillings.component.html',
  styleUrls: ['./import-fillings.component.scss', '../../pages/pages.component.css']
})
export class ImportFillingsComponent implements OnInit {
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
      this.common.handleModalSize('class', 'modal-m', '500');
   
   
  }

  ngOnInit() {
  }

  getStnData(station) {
    this.fuel_station_id = station.id;
    this.fuel_station_name = station.name;
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
        if (file.type != "application/vnd.ms-excel") {
          alert("valid Format Are : CSV");
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
      isFull: this.isfull
    };

    if (!params.fuelCsv) {
      return this.common.showError("Select  Option");
    }
    console.log("Data :", params);
    return;
    this.common.loading++;
    this.api.post('FuelDetails/ImportFuelFilingsCsv', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        let errorData = res['data']['f'];
        console.log("error: ", errorData);
        alert(res["msg"]);


        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }
}
