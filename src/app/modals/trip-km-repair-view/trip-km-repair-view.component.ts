import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'trip-km-repair-view',
  templateUrl: './trip-km-repair-view.component.html',
  styleUrls: ['./trip-km-repair-view.component.scss']
})
export class TripKmRepairViewComponent implements OnInit {

  tripId = 0;
  showData = {gps:null,google:null,repaired:null};
  GPSData = [];
  GoogleData = [];
  RepairData = [];
  GPSDis = 0;
  GoogleDis = 0;
  RequiredDis = 0;
  constructor(private api: ApiService,
    private common: CommonService,
    private map: MapService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.tripId = this.common.params.tripId;
    this.map.map = null;
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.getTripKmData();
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

  formatCSVData(dataStr){
    let data = [];
    let p = null;
    let dis = 0;
    dataStr.split('\n').forEach(point => {
      let bPoint = point.split(',');
      if(bPoint[1]){
        data.push({lat:bPoint[1],long:bPoint[0]});
        if(p){
          dis += this.common.distanceFromAToB(bPoint[1],bPoint[0],p[1],p[0],'Mt');
        }
        p = bPoint;
      }
    });
    return {data:data,dis: Math.round(dis/1000)};
  }

  setAndShowData(type) {
    console.log('type',type,this.map.map);
    if(!this.map.map){
      this.map.mapIntialize("map");
      setTimeout(() => {
        this.map.addListerner(this.map.map,'click',(e)=>{
          console.log("latLng",e.latLng.lat()+','+e.latLng.lng());
        });
      }, 100); 
    }
    
    switch (type) {
      case 'gps':
        if(!this.showData['gps'])
          this.showData['gps'] = this.showPoly(this.GPSData,{strokeColor: '#f44336', strokeOpacity: 1, strokeWeight: 1,icons: [{
            icon:  this.map.lineSymbol,
            offset: '100%',
            repeat:'20px'
          }]});
        else{
          this.showData['gps'].setMap(null);
          this.showData['gps'] = null;
        }
        break;
      case 'google':
        if(!this.showData['google'])
          this.showData['google'] = this.showPoly(this.GoogleData,{strokeColor: '#008CBA', strokeOpacity: 1, strokeWeight: 1,icons: [{
            icon:  this.map.lineSymbol,
            offset: '100%',
            repeat:'20px'
          }]});
          else{
            this.showData['google'].setMap(null);
            this.showData['google'] = null;
          }
        break;
      case 'repaired':
        if(!this.showData['repaired'])
          this.showData['repaired'] = this.showPoly(this.RepairData,{strokeColor: '#4CAF50', strokeOpacity: 1, strokeWeight: 1,icons: [{
            icon:  this.map.lineSymbol,
            offset: '100%',
            repeat:'20px'
          }]});
          else{
            this.showData['repaired'].setMap(null);
            this.showData['repaired'] = null;
          }
        break;
      default:
        this.common.showToast('Unknown Type');
        break;
    }
  }

  showPoly(data,options){
    this.map.polygonPath = null;
    let polyPath = null;
    data.forEach(rd => {
      polyPath = this.map.createPolyPathManual(this.map.createLatLng(rd.lat, rd.long),options);
    });
    let boundData = data.map(e=>{return {lat:parseFloat(e.lat),lng:parseFloat(e.long)};});
    this.map.setMultiBounds(boundData,true);
    return polyPath;
  }

  closeModal() {
    this.activeModal.close();
  }
}
