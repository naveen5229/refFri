import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'placements',
  templateUrl: './placements.component.html',
  styleUrls: ['./placements.component.scss','../../pages/pages.component.css']
})
export class PlacementsComponent implements OnInit {
  placements = [];
  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
  ) {
    this.getPlacement();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getPlacement();
  }
  getPlacement() {
    this.common.loading++;
    this.api.get('Placement/getFoPlacementRePort?')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.placements = res['data'];

             }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails ={
      id : placement.x_trip_id,
     // endName : placement.x_showtripend,
      startName : placement.x_showtripstart,
      startTime : placement.x_showstarttime,
      //endTime : placement.x_showendtime,
      regno : placement.x_showveh,
      vehicleId:placement.x_vehicle_id,
      siteId:placement.x_hl_site_id
      
    }
      this.common.params= {tripDetils : tripDetails, ref_page : 'placements'};
      console.log("vehicleTrip",tripDetails);
      const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        //console.log("data", data.respone);
        this.getPlacement();
  
      });
  }
  
}
