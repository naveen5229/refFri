import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-fillings',
  templateUrl: './import-fillings.component.html',
  styleUrls: ['./import-fillings.component.scss']
})
export class ImportFillingsComponent implements OnInit {
  fuel_station_id= 0;
  fuel_station_name = '';
  foid = 0;
  fo_name = '';
  title= '';
  fillingcsv = {};

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) { 
      this.title = this.common.params.title;
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
}
