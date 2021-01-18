import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-pri-sec-routemapping',
  templateUrl: './vehicle-pri-sec-routemapping.component.html',
  styleUrls: ['./vehicle-pri-sec-routemapping.component.scss']
})
export class VehiclePriSecRoutemappingComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true

    }

  };
  headings = [];
  valobj = {};
  vehid = null
  selectedAll = false;
  routes = [];
  assocType = 3
  insertData = []
  routesDetails = [];
  updateData = [];
  routeId = null;
  name = ''
  regno = null;
  rowId = null;
  isPrimaryCheck = 1;
  insertData1 = [];
  expiryDate = null;
  wefDate = new Date();
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    this.getVehicleRoute();
    this.getRoute();
    this.common.handleModalSize('class', 'modal-lg', '1050');
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  searchVehicle(event) {
    this.vehid = event.id;
    console.log("event", event);
  }


  getRoute() {
    this.common.loading++;
    this.api.get('Suggestion/getRoutesWrtFo')
      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routesDetails = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeRefernceType(type) {
    console.log('routes123: ', type);
    this.routeId = type.id
    console.log('routes123:---------------- ', this.routeId);

    // this.routeId = this.routesDetails.find((element) => {
    //   console.log(element.name == type);
    //   return element.id == type.id;
    // }).id;
  }



  getVehicleRoute() {
    this.routes = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};

    this.api.get("ViaRoutes/getVehRoutesDetails").subscribe(
      res => {
        this.routes = res['data'] || [];
        console.log("result", res);
        let first_rec = this.routes[0] || [];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }
    );
  }

  insertRoute() {
    // if(this.assocType = 2){
    //   if(!this.rowId){
    //     this.isPrimaryCheck=0
    //   }
    // }
    let wefdate = this.wefDate ? this.common.dateFormatter1(this.wefDate) : null;
    let expirydate = this.expiryDate ? this.common.dateFormatter1(this.expiryDate) : null;

    const params = {
      vehicleId: this.vehid,
      assocType: this.assocType,
      routeId: this.routeId,
      rowId: this.rowId,
      isPrimaryCheck: this.isPrimaryCheck,
      wefDate: wefdate,
      expDate: expirydate
    };


    console.log("params", params)
    this.common.loading++;
    this.api.post('ViaRoutes/vehicleRouteMapping', params)
      .subscribe(res => {

        this.insertData = res['data'] || [];
        // return this.common.showToast(res['data'][0].y_id )
        this.common.loading--;

        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.routeId = '';
          this.assocType = 3;
          this.regno = '';
          this.name = '';
          this.vehid = '';
          this.routesDetails = null;
          this.getRoute();
          this.getVehicleRoute();

        }
        else if (params.rowId == null) {
          if (res['data'][0].y_id == -2) {

            this.primaryCheck();

            // this.common.showToast(res['data'][0].y_msg);

          }
        }
        else {
          this.common.showError(res['data'][0].y_msg)
        }
      }, err => {
        this.common.showError();
        // console.log('Error: ', err);
      });
  }

  primaryCheck() {
    this.common.params = {
      title: 'Add More Primary Mapping',
      description: 'Are you sure you want one more primary mapping?',
      btn2: "No",
      btn1: 'Yes'
    };
    console.log("Inside confirm model")
    const activeModal = this.modalService.open(ConfirmComponent, { size: "sm", container: "nb-layout" });
    activeModal.result.then(data => {
      console.log('res', data);
      if (data.response) {
        this.isPrimaryCheck = 0;
        const params = {
          vehicleId: this.vehid,
          assocType: this.assocType,
          routeId: this.routeId,
          rowId: this.rowId,
          isPrimaryCheck: this.isPrimaryCheck
        };


        console.log("params", params)
        this.common.loading++;
        this.api.post('ViaRoutes/vehicleRouteMapping', params).subscribe(res => {
          this.common.loading--;
          this.getVehicleRoute();

          this.insertData1 = res['data'] || [];


        })
      }
      else if (data.apiHit == 0) {
        this.isPrimaryCheck = 1;
        this.insertRoute();
        this.getVehicleRoute();
      }

    });

  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.routes);
    this.routes.map(routeDoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj['Action'] = {
            value: "", action: null, icons: [{ class: 'far fa-edit', action: this.updateRoute.bind(this, routeDoc) },
            { class: "fas fa-trash-alt", action: this.deleteRoute.bind(this, routeDoc._id) }]
          }

        }
        else {

          this.valobj[this.headings[i]] = { value: routeDoc[this.headings[i]], class: 'black', action: '' };
        }
      }

      columns.push(this.valobj);
    });
    return columns;
  }



  updateRoute(route) {
    console.log("route", route);


    if (route.assocType == "Secondary") {
      route.assocType = 3
    }
    else {
      route.assocType = 2
    }

    this.routeId = route._routeid;
    this.assocType = route.assocType;
    this.regno = route.regno;
    this.name = route.Name;
    this.vehid = route._vid;
    this.rowId = route._id;
    this.wefDate = route._wef_dt ? new Date(route._wef_dt) : null;
    this.expiryDate = route._exp_dt ? new Date(route._exp_dt) : null;

  }




  deleteRoute(row) {
    console.log("id", row)
    const params = {
      rowId: row,
    }
    console.log("id2", params)

    if (row) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are you Sure You Want  To Delete This Record?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          console.log("par", params);
          this.api.post('ViaRoutes/deleteVehRouteMapping', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.routeId = [];
              this.assocType = 3;
              this.regno = '';
              this.name = '';
              this.routesDetails = [];

              this.getVehicleRoute();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

}

