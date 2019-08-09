import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';

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
  name =''
  regno = null;
  rowId=null;
  isPrimaryCheck=1;
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    this.getVehicleRoute();
    this.getRoute();
    this.common.handleModalSize('class', 'modal-lg', '1050');
  }

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
    // this.routeId=type.id
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
    let params = {
      vehicleId: this.vehid,
      assocType: this.assocType,
      routeId: this.routeId,
      rowId: this.rowId,
      isPrimaryCheck:this.isPrimaryCheck


    };


    console.log("params", params)
    this.common.loading++;
    this.api.post('ViaRoutes/vehicleRouteMapping', params)
      .subscribe(res => {
        this.insertData = res['data'] || [];
        if (res['data'][0].y_id >= 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.routeId = '';
          this.assocType = 3;
          this.regno = '';
          this.name = '';
          this.vehid='';
          this.routesDetails=null ;

          this.getVehicleRoute();
          this.common.loading--;
          
        }
        else if (res['data'][0].y_id == -2) {
          this.common.showToast(res['data'][0].y_msg);
          this.common.params = {
            title: 'Closing Stock',
            description: 'Are you sure you want close this stock?',
            btn2:"No",
            btn1:'Yes'
          };
          console.log("Inside confirm model")
          const activeModal = this.modalService.open(ConfirmComponent, { size: "sm", container: "nb-layout" });
          activeModal.result.then(data => {
            console.log('res', data);
            if (data.response) {
              this.getVehicleRoute();
              this.isPrimaryCheck=0;
            }
            else if(data.apiHit==0){
              this.isPrimaryCheck = 1;
            }
      
          });
          
        }  else {
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
    this.routes.map(routeDoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj['Action'] = { value: "", action: null, icons: [{ class: 'far fa-edit', action: this.updateRoute.bind(this, routeDoc._id, routeDoc._routeid, routeDoc.regno, routeDoc.AssocType, routeDoc.Name,routeDoc._vid) }, { class: "fas fa-trash-alt", action: this.deleteRoute.bind(this, routeDoc._id) }] }

        }
        else {

          this.valobj[this.headings[i]] = { value: routeDoc[this.headings[i]], class: 'black', action: '' };
        }
      }

      columns.push(this.valobj);
    });
    return columns;
  }



  updateRoute(id, route, regno, assocType, name,vid) {


    if (assocType == "Secondary") {
      assocType = 3
    }
    else {
      assocType = 2
    }
    console.log("assoc type:", assocType);
    this.routeId = route
    this.assocType = assocType;
    this.regno = regno;
    this.name = name;
    this.vehid = vid;
    this.rowId= id

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

