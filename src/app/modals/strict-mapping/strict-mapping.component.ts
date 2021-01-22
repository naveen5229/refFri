import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  isPrimaryCheck=1;

  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal) {
    Promise.all([this.getVehicleRoute(), this.getRoute()]).then(() => this.setTable());
    this.common.handleModalSize('class','modal-lg','1050')
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getVehicleRoute() {
    return new Promise((resolve, reject) => {
      this.common.loading++;
      this.api.get('ViaRoutes/getStrictRouteMappingList')
        .subscribe(res => {
          this.common.loading--;
          this.routes = res['data'] || [];
          // this.vehid = this.routes[0].vehicle_id;
          resolve();
        }, err => {
          this.common.loading--;
          console.log(err);
          this.common.showError();
          reject();
        });
    })
  }

  getRoute() {
    return new Promise((resolve, reject) => {
      this.common.loading++;
      this.api.get('Suggestion/getRoutesWrtFo')
        .subscribe(res => {
          this.common.loading--;
          this.routesDetails = res['data'];
          resolve();
        }, err => {
          this.common.loading--;
          console.log(err);
          this.common.showError();
          reject();
        });
    })
  }


  changeRefernceType(route, vehicleId, type) {
    console.log('Type: ', type);
    console.log('vehicleId', route);
    // this.routeId = this.routesDetails.find((element) => {
    //   console.log(element.name == type);
    //   return element.id == type.id;
    // }).id;
    this.vehid = route.vehicle_id;
    this.rId = route._id
    this.routeId = type.id

    console.log("vid", this.vehid);
    if (route.name) {
      this.updateRoute();
    } else {
      this.insertRoute();
    }
  }

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
    this.routes.map(route => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'name') {

          column['name'] = {
            isAutoSuggestion: true,
            preSelected: route.name ? { name: route.name, id: route._routeid } : '',
            seperator: '-', data: this.routesDetails, display: ['name', 'id'],
            onSelected: this.changeRefernceType.bind(this, route, route.vehicle_id),
            placeholder: 'Search Route', inputId: "routeId"
          }
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
      rowId: this.rId,
      isPrimaryCheck:this.isPrimaryCheck


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
      rowId: null,
      isPrimaryCheck:this.isPrimaryCheck

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



  closeModal() {
    this.activeModal.close();
  }


}
