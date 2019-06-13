import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'add-via-routes',
  templateUrl: './add-via-routes.component.html',
  styleUrls: ['./add-via-routes.component.scss']
})
export class AddViaRoutesComponent implements OnInit {
  location = '';
  foData = null;
  routeData = {

    routeName: null,
    siteId: null,
    lat: null,
    long: null,
    latlong: null,
    duration: Float64Array = null,
    kms: null,
    placeName: null,
  };

  selectOption = 'site';
  mark = null;
  ismap = false;

  constructor(private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService) {
    this.foData = this.common.params.foData;
    console.log("FOData:", this.foData);
    this.common.handleModalSize('class', 'modal-lg', '1250');
    setTimeout(() => {
      console.log('--------------location:', "location");
      this.mapService.autoSuggestion("location", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        console.log("position", this.routeData.latlong);
        this.location = place;
      });

    }, 2000)

  }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.mapService.mapIntialize("map");

    setTimeout(() => {
      this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
        this.mapService.clearAll();
        this.mapService.zoomAt({ lat: lat, lng: lng });
      });
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        if (this.ismap == true) {


          console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
          this.routeData.latlong = [{
            lat: evt.latLng.lat(),
            long: evt.latLng.lng(),
            color: 'FF0000',
            subType: 'marker'
          }];
          // this.position = evt.latLng.lat() + "," + evt.latLng.lng();
          if (this.mark != null) {
            this.mark[0].setMap(null);
            this.mark = null;
          }
          this.mark = this.mapService.createMarkers(this.routeData.latlong, false, false);
          console.log("latlong", this.routeData.latlong);
        }
      });

    }, 1000);


  }
  add() {

    console.log("Data", this.routeData);


  }


  closeModal() {
    this.activeModal.close();
  }

  selectSite(site) {
    console.log("Site Data", site);

    this.routeData.siteId = site.id;
    this.routeData.lat = site.lat;
    this.routeData.long = site.long;
  }

  report(type) {
    console.log("test", type);
    this.selectOption = type;
    if (this.selectOption == "site") {
      this.routeData.placeName = null;
      this.mapService.clearAll();
      this.ismap = false;
    }
    else if (this.selectOption == "map") {
      this.routeData.siteId = null;
      this.ismap = true;
    }
  }
}
