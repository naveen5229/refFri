import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MapService } from '../../services/map.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trip-km-repair-view',
  templateUrl: './trip-km-repair-view.component.html',
  styleUrls: ['./trip-km-repair-view.component.scss']
})
export class TripKmRepairViewComponent implements OnInit {

  tripId = 0;
  showData = { gps: null, google: null, repaired: null };
  GPSData = [];
  GoogleData = [];
  RepairData = [];
  GPSDis = 0;
  GoogleDis = 0;
  RequiredDis = 0;
  vId;
  constructor(private api: ApiService,
    private common: CommonService,
    private map: MapService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    console.log('this.common.params', this.common.params);
    this.tripId = this.common.params.tripId;
    this.vId = this.common.params.vId;
    this.map.map = null;
  }

  ngOnDestroy() { }
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    const ids = [28124, 16295, 28116, 28115, 29033, 88634];
    this.common.loading++;
    const subscription1 = this.api.getJavaPortDost(8083, `switchesfromtrip/${this.common.params.tripId}`)
      .subscribe(res => {
        this.common.loading--;
        console.log('response of getJavaPortDost is: ', res);
        res = res['data'];
        if (res['loc_data_type'] === 'is_single') {
          console.log('res loc_data_type :', res['loc_data_type']);
          this.getTripKmData();
        } else {
          this.routeRestoreSnapped();
          return;
        }
      }, err => {
        this.common.loading--;
        console.error(err);
      });
  }

  getTripKmData() {
    if (!this.tripId) {
      this.common.showError('No Trip Present');
      return;
    }
    ++this.common.loading;
    this.api.get('HaltOperations/populateKmsInVTStates?tripIds=' + this.tripId)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        let gps = this.formatCSVData(res['data']['info'][0]["debugPath"]["gpsPath"]);
        this.GPSData = gps['data'];
        this.GPSDis = gps['dis'];
        let google = this.formatCSVData(res['data']['info'][0]["debugPath"]["googlePath"]);
        this.GoogleData = google['data'];
        this.GoogleDis = google['dis'];
        let repair = this.formatCSVData(res['data']['info'][0]["debugPath"]["path"]);
        this.RepairData = repair['data'];
        this.RequiredDis = repair['dis'];
        // console.log("GPSData GoogleData RepairData", this.GPSData, this.GoogleData, this.RepairData);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

  routeRestoreSnapped() {
    ++this.common.loading
    // const subscription = this.apiService.postJavaPortDost(8086, 'routerestore/true', params)
    const subscription = this.api.getJavaPortDost(8083, `getrawdatafromtrip/${this.common.params.tripId}`)
      .subscribe((res: any) => {
        console.log('res:', res);
        --this.common.loading;
        this.GPSData = res.raw;
        this.GPSDis = this.calculateDistance(res.raw);
        this.GoogleData = res.google;
        this.GoogleDis = this.calculateDistance(res.google);
        this.RepairData = res.withSnap;
        this.RequiredDis = this.calculateDistance(res.withSnap);

        subscription.unsubscribe();
      }, err => {
        --this.common.loading;
        console.error(err);
        subscription.unsubscribe();
      });

  }


  formatCSVData(dataStr) {
    let data = [];
    let p = null;
    let dis = 0;
    dataStr.split('\n').forEach(point => {
      let bPoint = point.split(',');
      if (bPoint[1]) {
        data.push({ lat: bPoint[1], long: bPoint[0] });
        if (p) {
          dis += this.common.distanceFromAToB(bPoint[1], bPoint[0], p[1], p[0], 'Mt');
        }
        p = bPoint;
      }
    });
    return { data: data, dis: Math.round(dis / 1000) };
  }

  calculateDistance(points) {
    let distance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const pointA = points[i];
      const pointB = points[i + 1];
      distance += this.common.distanceFromAToB(pointA.lat, pointA.lng, pointB.lat, pointB.lng, 'Mt');
    }
    return Math.round(distance / 1000)
  }

  setAndShowData(type) {
    console.log('type', type, this.map.map);
    if (!this.map.map) {
      this.map.mapIntialize("trip-km-repair-view-map");
      setTimeout(() => {
        this.map.addListerner(this.map.map, 'click', (e) => {
          console.log("latLng", e.latLng.lat() + ',' + e.latLng.lng());
        });
      }, 100);
    }

    switch (type) {
      case 'gps':
        if (!this.showData['gps'])
          this.showData['gps'] = this.showPoly(this.GPSData, {
            strokeColor: '#f44336', strokeOpacity: 1, strokeWeight: 1, icons: [{
              icon: this.map.lineSymbol,
              offset: '100%',
              repeat: '20px'
            }]
          });
        else {
          this.showData['gps'].setMap(null);
          this.showData['gps'] = null;
        }
        break;
      case 'google':
        if (!this.showData['google'])
          this.showData['google'] = this.showPoly(this.GoogleData, {
            strokeColor: '#008CBA', strokeOpacity: 1, strokeWeight: 1, icons: [{
              icon: this.map.lineSymbol,
              offset: '100%',
              repeat: '20px'
            }]
          });
        else {
          this.showData['google'].setMap(null);
          this.showData['google'] = null;
        }
        break;
      case 'repaired':
        if (!this.showData['repaired'])
          this.showData['repaired'] = this.showPoly(this.RepairData, {
            strokeColor: '#4CAF50', strokeOpacity: 1, strokeWeight: 1, icons: [{
              icon: this.map.lineSymbol,
              offset: '100%',
              repeat: '20px'
            }]
          });
        else {
          this.showData['repaired'].setMap(null);
          this.showData['repaired'] = null;
        }
        break;
      default:
        this.common.showToast('Unknown Type');
        break;
    }
  }

  showPoly(data, options) {
    this.map.polygonPath = null;
    let polyPath = null;
    data.forEach(rd => {
      polyPath = this.map.createPolyPathManual(this.map.createLatLng(rd.lat, rd.long ? rd.long : rd.lng), options);
    });
    let boundData = data.map(e => { return { lat: parseFloat(e.lat), lng: e.long ? parseFloat(e.long) : parseFloat(e.lng) }; });
    this.map.setMultiBounds(boundData, true);
    return polyPath;
  }

  closeModal() {
    this.activeModal.close();
  }
}
