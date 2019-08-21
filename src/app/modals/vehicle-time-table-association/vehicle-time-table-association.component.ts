import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'vehicle-time-table-association',
  templateUrl: './vehicle-time-table-association.component.html',
  styleUrls: ['./vehicle-time-table-association.component.scss']
})
export class VehicleTimeTableAssociationComponent implements OnInit {
  routesDetails = [];
  routeId = null;
  routeTimes = [];
  routeTime = null;
  routeName = null;
  routeTimeName = null;
  assocTypeId = '0';
  assoctionType = [
    {
      id: null,
      name: null,
    }];
  vehicleId = null;
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  vehicleTimeTable = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {

    this.common.handleModalSize('class', 'modal-lg', '1000', 'px', 1);
    if (this.common.params && this.common.params.vehicleRouteData) {
      this.routeId = this.common.params.vehicleRouteData.routeId;
      this.routeName = this.common.params.vehicleRouteData.routeName;
      this.routeTimeName = this.common.params.vehicleRouteData.routeTimeName;
      this.routeTime = this.common.params.vehicleRouteData.routeTime;
      this.assocTypeId = this.common.params.vehicleRouteData.assType ? this.common.params.vehicleRouteData.assType : '0';
    }
    if (this.routeId) {
      this.getrouteTime();

    }
    this.getRoutes();
    this.assoctionType = [
      {
        id: '0',
        name: '--Select Association Type--'
      },
      {
        id: '1',
        name: 'Strict'
      },
      {
        id: '2',
        name: 'Primary'
      },
      {
        id: '3',
        name: 'Secondary'
      },

    ];

  }


  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getRoutes() {
    this.common.loading++;
    this.api.get('Suggestion/getRoutesWrtFo')
      .subscribe(res => {
        this.common.loading--;
        console.log('Route:', res);
        this.routesDetails = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeRouteType(type) {
    this.routeId = type.id;
    if (this.routeId) {
      this.getrouteTime();
    }
    // this.routeId = this.routesDetails.find((element) => {
    //   console.log(element.name == type);
    //   return element.id == type.id;
    // }).id;
  }

  changeRouteTime(time) {
    this.routeTime = time.id;
  }

  getVehicle(vehicle) {
    console.log("vehicle", vehicle);

    this.vehicleId = vehicle.id;


  }

  getrouteTime() {
    this.common.loading++;
    this.api.get('ViaRoutes/getTimeTable?routeId=' + this.routeId + '&isSug=true')
      .subscribe(res => {
        this.common.loading--;
        console.log('route Time:', res);
        this.routeTimes = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addVehicleTimeTable() {
    let params = {
      routeId: this.routeId,
      routeTime: this.routeTime,
      assType: this.assocTypeId,
      vehicleId: this.vehicleId


    }
    this.common.loading++;
    this.api.post('ViaRoutes/getTimeTable', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('result:', res);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }



  getVehicleRouteTimeTable() {
    this.common.loading++;
    this.api.get('ViaRoutes/getTimeTable?routeId=' + this.routeId)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleTimeTable = res['data'];
        this.vehicleTimeTable.length ? this.setTable() : this.resetTable();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.vehicleTimeTable[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.vehicleTimeTable.map(route => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(route)
          };
        } else {
          column[key] = { value: route[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(route) {
    let icons = [
      {
        class: "fas fa-trash-alt",
        action: this.deleteRouteTime.bind(this, route)
      },
    ];
    return icons;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }





  deleteRouteTime(route) {
    let params = {
      routeId: route._route_id,
      timeTableId: route._rtt_id,

    }
    if (route._route_id) {
      this.common.params = {
        title: 'Delete Vehicle Route Time',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('ViaRoutes/deleteTimeTable', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0].y_id > 0) {
                this.common.showToast('Success');
                this.getVehicleRouteTimeTable();
              }
              else {
                this.common.showToast(res['data'][0].y_msg);
              }

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }



}
