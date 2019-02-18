import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'vehicle-status-change',
  templateUrl: './vehicle-status-change.component.html',
  styleUrls: ['./vehicle-status-change.component.scss','../../pages/pages.component.css']
})
export class VehicleStatusChangeComponent implements OnInit {
viewType= "all";
VehicleStatusAlerts = [];
  constructor(
    public api : ApiService,
    public common :CommonService
  ) { 

    this.getVehicleStatusAlerts(this.viewType);

  }

  ngOnInit() {
  }

  getVehicleStatusAlerts(viewType){
    let params = 'viewType=' + viewType;
    console.log("params ", params);
    this.api.get('HaltOperations/getVehicleStatusAlerts?' + params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.VehicleStatusAlerts =res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  
  getPendingStatusDetails(){
    
    this.common.loading++;
    this.api.post('Admin/getPendingAlertDetails?')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let data = [];
        res['data'].map((fueldetail, index) => {
          data.push([index, fueldetail.name, fueldetail.location, fueldetail.liters,this.common.changeDateformat(fueldetail.entry_time)]);
        });
        console.log(data);
        this.common.params = { title: 'Filling Entries', headings: ["#", "Station Name", "Location", "Litres","Entry Time"], data };
      this.modalService.open(ViewListComponent, { size: 'lg', container: 'nb-layout' });
      }, err => {
        this.common.loading--;
        console.log(err);
      });
      

  }

}
