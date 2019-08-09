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
  insertData = [];
  routesDetails = [];
  routeId = null;
  name = ''
  rId = null
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal) {
    this.getVehicleRoute();
    this.getRoute()
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  searchVehicle(event) {
    this.vehid = event.id;
    console.log("event", event);
    this.getVehicleRoute()
  }

  getRoute() {
    this.common.loading++;
    this.api.get('Suggestion/getRoutesWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.routesDetails = res['data'];
        //this.name=this.routesDetails[0].name
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeRefernceType(type, route) {
  

    console.log('Type: ', type);
    console.log('vehicleId', route);
  

    this.routeId = this.routesDetails.find((element) => {
      console.log(element.name == type);
      return element.id == type.id;
    }).id;
    this.vehid = route.vehicle_id;
    this.rId  = route._id
        console.log("vid",this.vehid);
    if (route.name) {
      console.log('________________You can hit updatye API');
      this.updateRoute();
    } else {
      console.log('______________________You can hit insert API');
      this.insertRoute();
    }
  }


  getVehicleRoute() {
    this.common.loading++;
    this.api.get('ViaRoutes/getStrictRouteMappingList')
      .subscribe(res => {
        this.common.loading--;
        this.routes = res['data'];
        this.vehid = this.routes[0].vehicle_id;
        console.log("row",this.rId);
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  updateRoute() {
    this.getVehicleRoute()
    console.log("update")
    let params = {
      vehicleId: this.vehid,
      assocType: 1,
      routeId: this.routeId,
      rowId: this.rId

    };


    console.log("params", params)
    this.common.loading++;
    this.api.post('ViaRoutes/vehicleRouteMapping', params)
      .subscribe(res => {
        this.insertData = res['data'] || [];
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




  insertRoute() {
   this.getVehicleRoute()
    console.log("insert")

    let params = {
      vehicleId: this.vehid,
      assocType: 1,
      routeId: this.routeId,
      rowId: null

    };


    console.log("params", params)
    this.common.loading++;
    this.api.post('ViaRoutes/vehicleRouteMapping', params)
      .subscribe(res => {
        this.insertData = res['data'] || [];
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
