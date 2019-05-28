import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'vehicle-fuel-filling-entry',
  templateUrl: './vehicle-fuel-filling-entry.component.html',
  styleUrls: ['./vehicle-fuel-filling-entry.component.scss']
})
export class VehicleFuelFillingEntryComponent implements OnInit {
  startDate;
  endDate;
  vid;
  vehicleFFE = [];
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    if (this.common.params.value) {
      this.vid = this.common.params.value.vehicle_id;
      this.startDate = this.common.params.value.start_time;
      this.endDate = this.common.params.value.end_time
    }

    this.getVehicleFFEntry();

  }

  ngOnInit() {
  }

  getVehicleFFEntry() {

    let params = {
      vehicle_id: this.vid,
      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate)
    };
    this.common.loading++;
    this.api.post('FuelDetails/getVehicleFFEWrtDate', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleFFE = res['data'];
        console.log('res', res['data']);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

}
