import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'strict-mapping',
  templateUrl: './strict-mapping.component.html',
  styleUrls: ['./strict-mapping.component.scss']
})
export class StrictMappingComponent implements OnInit {
  vehid = null
  selectedAll = false;
  routes = [];
  // assocType= 1;
  insertData=[];
  routesDetails=[];
  routeId =null;
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal) {
    this.getVehicleRoute();
    // this.getRoute()
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  searchVehicle(event){
    this.vehid=event.id;
    console.log("event",event);
    this.getVehicleRoute()
 }

 getRoute() {
  this.common.loading++;
  this.api.get('Suggestion/getRoutesWrtFo')
    .subscribe(res => {
      this.common.loading--;
 this.routesDetails = res['data'];
    }, err => {
      this.common.loading--;
      console.log(err);
    });
}

changeRefernceType(type,vehicleId) {
  console.log('Type: ', type);
  console.log('vehicleId',vehicleId);
  this.routeId = this.routesDetails.find((element) => {
    console.log(element.name == type);
   
    return element.id == type.id;
  }).id;
  this.vehid=vehicleId;
  this.insertRoute()
}


  getVehicleRoute() {
    this.common.loading++;
    this.api.get('ViaRoutes/getStrictRouteMappingList')
      .subscribe(res => {
        this.common.loading--;
   this.routes = res['data'];
   this.vehid=this.routes[0].vehicle_id;

   this.getRoute();

      }, err => {
        this.common.loading--;
        console.log(err);
      });

      // this.insertRoute()
  }

  selectAllCheckbox() {
    this.routes.map(route => route.selected = this.selectedAll);
    console.log('select All', this.selectAllCheckbox);
  }

  insertRoute() {
   
      let params = {
        vehicleId: this.vehid,
        assocType:1,
       routeId: this.routeId,
  
      };
    

    console.log("params", params)
    this.common.loading++;
    this.api.post('ViaRoutes/vehicleRouteMapping', params)
      .subscribe(res => {
        this.insertData=res['data'] || [];
        if (res['data'][0].y_id > 0) {
          this.common.loading--;
          this.common.showToast(res['data'][0].y_msg);
          this.getVehicleRoute()
        } else {
          this.common.loading--;
          this.common.showError(res['data'][0].y_msg)
        }
      }, err => {
        this.common.showError();
        // console.log('Error: ', err);
      });
  }

}
