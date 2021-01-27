import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tank-empty-details',
  templateUrl: './tank-empty-details.component.html',
  styleUrls: ['./tank-empty-details.component.scss', '../../pages/pages.component.css']
})
export class TankEmptyDetailsComponent implements OnInit {
  startDate = '';
  fillingData = [];
  moveLoc = { place: '', lat: 0, lng: 0 };
  siteLoc = '';
  odometer = 0;

  // selectedSite = null;
  liter = null;
  vid = null;
  constructor(
    public mapService: MapService,
    public common: CommonService,
    private modalservice: NgbModal,
    public activeModal: NgbActiveModal,
    public api: ApiService) {
    let today;
    today = new Date();

    this.startDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)));
    console.log('dates ', this.startDate);
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {

    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
      this.moveLoc.place = place;
      this.moveLoc.lat = lat;
      this.moveLoc.lng = lng;
    });
  }

  closeModal() {
    this.activeModal.close();
  }
  selectVehicle(vehicle) {
    //console.log('Vehicle Data:+++ ', this.selectedVehicleId);
    this.vid = vehicle.id;
    //console.log("vehicle=", vehicle);
  }

  Submit() {
    const params = {
      vid: this.vid,
      date: this.common.dateFormatter1(this.startDate),
      litre: this.liter,
      location: this.moveLoc.place,
      lat: this.moveLoc.lat,
      long: this.moveLoc.lng,
      odo_val: this.odometer
    }
    console.log("params:", params);

    this.common.loading++;
    this.api.post('Fuel/setTankEmptyDetails', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.activeModal.close();
        }
        else {
          this.common.showError(res['data']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
