import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { EncryptService } from '../../services/encrypt.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'beehive',
  templateUrl: './beehive.component.html',
  styleUrls: ['./beehive.component.scss']
})
export class BeehiveComponent implements OnInit {
  lat1: "";
  long1: "";
  circlesData = [];
  encryptSecretKey = 'elogist123';
  data = null;
  LatLong = [];
  publicKey1133 = null;
  lat2: "";
  latLngs: "";
  long2: "";
  count = null;
  current = null;
  // arr1 = [
  //   this.lat1,
  //   this.long1,
  //   this.lat2,
  //   this.long2
  // ];
  size = "";
  first = null;
  second = null;
  print = null;
  encryptedArray = [];
  decrypt = null;
  privateDecrypted: any;
  componentType = 'page';

  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public encrypt: EncryptService,
    public activeModal: NgbActiveModal,
  ) {
    this.componentType;
    if (this.common.params && this.common.params.reference) {
      this.componentType = this.common.params.reference
    }
    else {
      this.componentType = 'page';
    }
    this.LatLong = this.common.params;
    this.common.refresh = this.refresh.bind(this);

  }

  refresh() {
    console.log('Refresh');
    this.LatLong = this.common.params;
  }
  ngOnDestroy(){}
ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("beehive-map");
  }
  closeModal() {
    this.activeModal.close();
  }

  getMapping() {
    this.mapService.clearAll();
    console.log('params:---------------- ');
    this.common.loading++;
    this.api.get('Test/beeHive')
      .subscribe(async res => {
        this.common.loading--;

        this.LatLong = res['data'];
        console.log(res['data']);
        this.count = res['data'].length;
        this.current = 0;
        this.common.params = this.LatLong;
        this.mapService.createMarkers(res['data']['latLngs'], false, true, ["lat", "lng"]);
        for (const marker in this.mapService.markers) {
          if (this.mapService.markers.hasOwnProperty(marker)) {
            const thisMarker = this.mapService.markers[marker];
            this.current++;
            let circlesData = this.mapService.createCirclesOnPostion(thisMarker.position, res['data']['radius']);
            this.api.post('Test/generateBeeHive', {
              lat: thisMarker.position.lat(), long: thisMarker.position.lng(), radius: res['data']['radius']
            })
              .subscribe(res => {
                console.log(res['data']);
                switch (res['data']) {
                  case 2:
                    // Count >= 20 Color iS Blue
                    console.log("here2");
                    circlesData.setOptions({
                      fillColor: "#0000FF",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#0000FF"
                    });
                    break;
                  case 3:
                    // Count < 20 Color iS Green
                    console.log("here3");

                    circlesData.setOptions({
                      fillColor: "#00FF00",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#00FF00"
                    });
                    break;
                  case 4:
                    // If Api Status is not OK , Color iS yellow
                    console.log("here4");
                    circlesData.setOptions({
                      fillColor: "#FFFF00",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#FFFF00"
                    });
                    break;
                  case 5:
                    // already Exist in DB , Magenta
                    console.log("here5");
                    circlesData.setOptions({
                      fillColor: "#FF00FF",
                      fillOpacity: 0.5,
                      strokeOpacity: 1,
                      strokeColor: "#FF00FF"
                    });
                    break;
                  default:
                    // Color Is Red 
                    console.log("hereDefault", res['data']);

                    break;
                }
              },
                err => {
                  this.common.showError();
                });

            await this.sleep(500);

          }
        }
      },
        err => {
          this.common.loading--;
          this.common.showError();
        })
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateBeeHive() {

    let params = {};

    this.api.post('Test/generateBeeHive', params)
      .subscribe(res => {
        console.log(res['data']);
        return res['data'];
      },
        err => {
          this.common.showError();
        });
    return 1;

  }
}
