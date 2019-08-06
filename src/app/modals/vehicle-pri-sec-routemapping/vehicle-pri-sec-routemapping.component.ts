import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
  assocType=3 
  insertData=[]
  routesDetails=[];
  routeId =null;
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal) {
    this.getVehicleRoute();
    this.getRoute();
    this.common.handleModalSize('class', 'modal-lg', '1050');
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  searchVehicle(event){
    this.vehid=event.id;
    console.log("event",event);
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

changeRefernceType(type) {
  console.log('Type: ', type);
  this.routeId = this.routesDetails.find((element) => {
    console.log(element.name == type);
   
    return element.id == type.id;
  }).id;
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
    
    this.api.get("ViaRoutes/getRouteDetails").subscribe(
      res => {
        this.routes = res['data'] || [] ;
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

  // selectAllCheckbox() {
  //   this.routes.map(route => route.selected = this.selectedAll);
  //   console.log('select All', this.selectAllCheckbox);
  // }

  insertRoute() {
    let params = {
      vehicleId: this.vehid,
      assocType:this.assocType,
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


  getTableColumns() {
    let columns = [];
    console.log("Data=", this.routes);
    this.routes.map(stateDoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", stateDoc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: stateDoc[this.headings[i]], class: 'black', action: '' };
      }
  
      columns.push(this.valobj);
    });
    return columns;
  }
  
  
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  
}

