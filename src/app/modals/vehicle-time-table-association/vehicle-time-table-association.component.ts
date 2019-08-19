import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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


}
