import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

@Component({
  selector: 'add-via-routes',
  templateUrl: './add-via-routes.component.html',
  styleUrls: ['./add-via-routes.component.scss']
})
export class AddViaRoutesComponent implements OnInit {
  location = '';
  routeData = {

    routeName: null,
    startSiteId: null,
    endSiteId: null,

    startlat: null,
    startlong: null,
    endlat1: null,
    endlong2: null,


    lat: null,
    long: null,
    lat1: null,
    long1: null,
    duration: null,
    kms: null,
    placeName: null,
    placeName2: null,
  };

  selectOption = 'site';
  selectOption2 = 'site2';
  mark = [];
  ismap = false;
  ismap2 = false;
  startSearch = '';
  endSearch = '';

  keepGoingForStart = true;
  keepGoingForEnd = true;

  routeTypes = [{
    name: 'Loaded',
    id: '0'
  },
  {
    name: 'Empty',
    id: '1'
  }
  ];
  routeId = '0';

  constructor(private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService,
    private modalService: NgbModal) {
    // this.foId = this.common.params.foData;
    // console.log("FOData:", this.foId);
    this.common.handleModalSize('class', 'modal-lg', '1250');
    setTimeout(() => {
      console.log('--------------location:', "location");
      this.mapService.autoSuggestion("location", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        this.location = place;
      });
      this.mapService.zoomAt({ lat: 26.9100, lng: 75.7900 }, 12);

    }, 2000)

  }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.mapService.mapIntialize("map");

    setTimeout(() => {
      this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
        this.mapService.clearAll();
        this.mapService.zoomAt({ lat: lat, lng: lng }, 12);
      });


    }, 1000);
  }



  add() {
    const params = {
      name: this.routeData.routeName,
      startLat: this.routeData.startlat,
      startLong: this.routeData.startlong,
      endLat: this.routeData.endlat1,
      endLong: this.routeData.endlong2,
      startSiteId: this.routeData.startSiteId,
      endSiteId: this.routeData.endSiteId,
      duration: this.routeData.duration,
      kms: this.routeData.kms,
      startName: this.routeData.placeName,
      endName: this.routeData.placeName2,
      routeType: this.routeId

    };

    console.log("Data :", params);

    this.common.loading++;
    this.api.post('ViaRoutes/insert', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("test", res['data'][0].y_msg);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);
          return;

        }
        else {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ response: res });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }


  closeModal() {
    this.activeModal.close();
  }

  selectSite(site) {
    console.log("Site Data", site);
    this.routeData.startSiteId = site.id;
    this.routeData.startlat = site.lat;
    this.routeData.startlong = site.long;
    this.routeData.placeName = site.name;
  }
  selectSite2(site) {
    this.routeData.endSiteId = site.id;
    this.routeData.endlat1 = site.lat;
    this.routeData.endlong2 = site.long;
    this.routeData.placeName2 = site.name;
  }

  selectStartByMap(map) {
    console.log("Map", map);

    this.routeData.startSiteId = map.id;
    this.routeData.startlat = map.lat;
    this.routeData.startlong = map.long;
    this.routeData.placeName = map.location.split(",")[0] || map.name;
  }

  selectEndByMap(map) {
    this.routeData.endSiteId = map.id;
    this.routeData.endlat1 = map.lat;
    this.routeData.endlong2 = map.long;
    this.routeData.placeName2 = map.location.split(",")[0] || map.name;
  }
  onChangeMapData(search) {
    this.startSearch = search;
    this.endSearch = search;
    console.log('..........', search);

  }


  report(type) {
    if (type == "site") {
      this.routeData.placeName = null;
      this.routeData.lat = null;
      this.routeData.long = null;
      this.ismap = false;
      this.mark[0] && this.mark[0].setMap(null);
    }
    else if (type == "map") {
      this.routeData.startSiteId = null;
      this.routeData.startlat = null;
      this.routeData.startlong = null;
      this.ismap = true;
      this.mark[0] && this.mark[0].setMap(null);
    }
  }

  report2(type) {
    if (type == "site2") {
      this.routeData.placeName2 = null;
      this.routeData.lat1 = null;
      this.routeData.long1 = null;
      this.ismap2 = false;
      this.mark[1] && this.mark[1].setMap(null);
    }
    else if (type == "map2") {
      this.routeData.endSiteId = null;
      this.routeData.endlat1 = null;
      this.routeData.endlong2 = null;
      this.ismap2 = true;
      this.mark[1] && this.mark[1].setMap(null);
    }
  }

  takeActionOnStart(res, type) {
    setTimeout(() => {
      console.log("Here", this.keepGoingForStart, this.startSearch.length, this.startSearch);
      if (type == 'start') {


        if (this.keepGoingForStart && this.startSearch.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoingForStart = false;
          activeModal.result.then(res => {
            if (res != null) {
              this.keepGoingForStart = true;
              if (res.location.lat) {
                this.routeData.placeName = res.location.name;

                (<HTMLInputElement>document.getElementById('startName')).value = this.routeData.placeName;
                this.routeData.startlat = res.location.lat;
                this.routeData.startlong = res.location.lng;
                this.routeData.startSiteId = res.id;
              }
            }
            this.keepGoingForStart = true;

          });

        }
      }
      else {
        if (this.keepGoingForEnd && this.endSearch.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoingForEnd = false;
          activeModal.result.then(res => {
            if (res != null) {
              this.keepGoingForEnd = true;
              if (res.location.lat) {
                this.routeData.placeName2 = res.location.name;

                (<HTMLInputElement>document.getElementById('endName')).value = this.routeData.placeName2;
                this.routeData.endlat1 = res.location.lat;
                this.routeData.endlong2 = res.location.lng;
                this.routeData.endSiteId = res.id;
              }
            }
            this.keepGoingForEnd = true;

          });

        }
      }

    }, 1000);

  }

}
