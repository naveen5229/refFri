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
  rout = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
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
    // this.routeId== this.routesDetails[0].id
    // this.changeRefernceType(type,route,vehicleId)
  }

  changeRefernceType(route, vehicleId, type) {


    console.log('Type: ', type);
    console.log('vehicleId', route);


    this.routeId = this.routesDetails.find((element) => {
      console.log(element.name == type);
      return element.id == type.id;
    }).id;
    this.vehid = route.vehicle_id;
    this.rId = route._id
    console.log("vid", this.vehid);
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
        this.routes = res['data'] || [];
        this.vehid = this.routes[0].vehicle_id;
        console.log("row", this.rId);
        this.setTable();


      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }



  // getVehicleRoute() {
  //   this.common.loading++;
  //   this.api.get('ViaRoutes/getStrictRouteMappingList')
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log("Res:", res);
  //       this.routes = res['data'] || [];
  //       this.setTable();
  //     }, err => {
  //       this.common.loading--;
  //       this.common.showError();
  //       console.log('Error:', err);
  //     });
  // }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.genearateColumns()
    }
  }

  generateHeadings() {
    let headings = {};
    for (let key in this.routes[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  genearateColumns() {
    let columns = [];
    this.routes.map(route=> {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == name) {
          console.log("name");

          column['name'] = { isAutoSuggestion: true, display:['name','id'], 
          preSelected: route.name ? {name:route.name,id:route._routeid}:'', 
          seperator: '-', url: 'Suggestion/getRoutesWrtFo', onSelected: this.changeRefernceType.bind(this, route,this.vehid), 
          placeholder: 'Search Route', inputId: "routeId" }
        }
        else {
          column[key] = { value: route[key], class: 'black', action: '' }
        }
      }
      columns.push(column);
    });
    return columns;
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


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
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
