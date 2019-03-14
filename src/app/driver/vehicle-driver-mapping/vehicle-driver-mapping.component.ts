import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'vehicle-driver-mapping',
  templateUrl: './vehicle-driver-mapping.component.html',
  styleUrls: ['./vehicle-driver-mapping.component.scss','../../pages/pages.component.css']
})
export class VehicleDriverMappingComponent implements OnInit {
  driverMapping=[];
  constructor(
    public common:CommonService,
    public api:ApiService
  ) {
    this.getdriverMapping();
   }

  ngOnInit() {
  }

  getdriverMapping() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/getVehicleMapping')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.driverMapping = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

}
