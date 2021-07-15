import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ForcellyRemappingRouteComponent } from '../forcelly-remapping-route/forcelly-remapping-route.component';

@Component({
  selector: 'remaptripandroute',
  templateUrl: './remaptripandroute.component.html',
  styleUrls: ['./remaptripandroute.component.scss']
})
export class RemaptripandrouteComponent implements OnInit {

  title = "Remap Trip And Route"
  routeId = null;
  tripId;
  vehicleTripRouteId;
  routeName;
  routes = [];
  report;
  vId;


  constructor(
    private activeModal: NgbActiveModal,
    private common: CommonService,
    private api: ApiService,
    private modalService: NgbModal
  ) {
    this.tripId = this.common.params.tripId;
    this.vehicleTripRouteId = this.common.params.routeId;
    this.report = this.common.params.title;
    this.vId = this.common.params.vId;
    console.log('tripId: ', this.tripId, this.vehicleTripRouteId)
    console.log('vehicle Id: ', this.vehicleTripRouteId, this.vId)
  
      this.getSuggestions();
    
  }

  ngOnInit(): void {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getSuggestions() {
    this.api.get('ViaRoutes/getViaRouteSuggestions?')
      .subscribe(res => {
        this.routes = res['data'];
        if (this.vehicleTripRouteId) {
          this.routes.filter(ele => {
            if (ele.route_id == this.vehicleTripRouteId) {
              console.log('inside routeName if')
              this.routeName = ele.route_name;
              this.routeId = ele.route_id;
            }
          })

          console.log('routeName is: ', this.routeName)
        }
      }, err => {
        console.log(err);
      });
  }

  selectRoute(event) {
    console.log('event is: ', event);
    this.routeId = event['route_id']
  }

  titleRemapTripAndRouteFun(){
    if(this.title){
      this.routeDashRemapTrip();
    } else{
      this.remapTripAndRoute();
    }
  }

  remapTripAndRoute() {

    let params = {
      vehicleTripId: this.tripId,
      routeId: this.routeId,
      isForce: false
    }

    console.log('params is: ', params);

    this.common.loading++;
    this.api.postJavaPortDost(8093, 'remapTripAndRoute', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('response is: ', res)
        this.common.showToast(res['msg']);
        if (res['code'] == (-3 || '-3')) {
          console.log('inside code');
          this.common.params = { description: 'Do you want to forcefully map route?', btn1: 'Submit', btn2: 'Cancel', vehicleTripId: this.tripId, routeId: this.routeId }
          const activeModal = this.modalService.open(ForcellyRemappingRouteComponent, { size: 'lg', container: 'nb-layout' });

          activeModal.result.then(response => {
            console.log('resp: ', response)
            if (response.response) {
              this.closeModal(false)
            }
          });
        }

      }, err => {
        this.common.loading--;
        console.log('err is: ', err)
      })
  }

  routeDashRemapTrip(){
    let params = {
      vehicleId: this.vId,
      routeId: this.routeId,
      isForce: false,
      associationType: 1
    }

    console.log('params is: ', params)

    this.common.loading ++;
    this.api.postJavaPortDost(8093, 'remapVehicleAndRoute', params)
      .subscribe(res => {
        this.common.loading --;
        console.log('repsonse is: ', res)
        this.common.showToast(res['msg']);
        if (res['code'] == (-3 || '-3')) {
          console.log('inside code');
          this.common.params = { description: 'Do you want to forcefully map route?', btn1: 'Submit', btn2: 'Cancel', vehicleTripId: this.tripId, routeId: this.routeId }
          const activeModal = this.modalService.open(ForcellyRemappingRouteComponent, { size: 'lg', container: 'nb-layout' });

          activeModal.result.then(response => {
            console.log('resp: ', response)
            if (response.response) {
              this.closeModal(false)
            }
          });
        }
      }, err => {
        this.common.loading --;
        console.log('err is: ', err)
      })
  }
}
