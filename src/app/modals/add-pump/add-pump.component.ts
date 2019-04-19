import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';


@Component({
  selector: 'add-pump',
  templateUrl: './add-pump.component.html',
  styleUrls: ['./add-pump.component.scss']
})
export class AddPumpComponent implements OnInit {
  fuel_company = 0;
  location = '';
  name = '';
  title = '';

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private mapService: MapService) {
      this.title = this.common.params.title;
      setTimeout(() =>{
        console.log('--------------location:', "location");
        this.mapService.autoSuggestion("location", (place, lat, lng) => {
          //console.log('Lat: ', lat);
          ///console.log('Lng: ', lng);
          console.log('Place: ', place);
          this.location = place;
        });
      }, 5000)

     }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectCompany(id) {
    this.fuel_company = parseInt(id);
  }

  submitPumpData() {
    let params = {
      petrolPumplocation : this.location,
      petrolPumpName: this.name,
      siteId: '',
      fuelCompany: this.fuel_company
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('FuelDetails/addPetrolPump', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("result");
        console.log(res);
        this.common.showToast("Petrol Pump Added Successfully");
        this.activeModal.close();
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });
  }
}
