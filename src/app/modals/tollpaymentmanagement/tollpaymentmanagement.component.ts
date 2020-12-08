import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { RemarkModalComponent } from '../remark-modal/remark-modal.component';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'tollpaymentmanagement',
  templateUrl: './tollpaymentmanagement.component.html',
  styleUrls: ['./tollpaymentmanagement.component.scss']
})
export class TollpaymentmanagementComponent implements OnInit {

  startDate = new Date();
  endDate = new Date();
  vehicleId = null;
  vehicleRegNo = '';
  vehicleClass = [];
  vClass = '';
  tpManagement_tolls=[];
  tpManagement_paths=[];
  constructor(public common: CommonService,
    public mapService: MapService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1050');
    // this.endDate = new Date();
    // this.startDate = new Date();
    this.getVehicleClass();
  }

  // ngOnInit(): void {
  // }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.mapService.mapIntialize("map",10);
      this.mapService.setMapType(0);
  }

  searchVehicle(event) {
    this.vehicleId = event.id;
    this.vehicleRegNo = event.regno;
  }

  getVehicleClass() {
    this.api.get("Suggestion/getTypeMaster?typeId=14")
      .subscribe(res => {
        console.log('Vehicle Class:', res['data']);
        this.vehicleClass = res['data'] ? res['data'] : [];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  tollPayManagement(){
    this.common.loading++;
    let params={
      startDate:this.common.dateFormatter(this.startDate),
      endDate:this.common.dateFormatter(this.endDate),
      vehicle_id:this.vehicleId,
      vClass:this.vClass
    }
    console.log("data:",params);
    this.api.post('Toll/getTollsOnVehicleRoute', params)
      .subscribe(res => {
        this.common.loading--;
        if(res['success']){
        console.log("response", res['data']);
        this.tpManagement_tolls=res['data']['tolls'];
        this.mapService.clearAll();
        this.mapService.createMarkers(this.tpManagement_tolls,false,false);
        this.tpManagement_paths=res['data']['path'];
        this.showPoly(this.formatCSVData(this.tpManagement_paths)['data']);

        }
        
      }, err => {
         this.common.loading--;
        console.log(err);
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

  showPoly(data,options?){
    this.mapService.polygonPath = null;
    let polyPath = null;
    data.forEach(rd => {
      polyPath = this.mapService.createPolyPathManual(this.mapService.createLatLng(rd.lat, rd.long),options);
    });
    let boundData = data.map(e=>{return {lat:parseFloat(e.lat),lng:parseFloat(e.long)};});
    this.mapService.setMultiBounds(boundData,true);
    return polyPath;
  }

  updateTeriff(teriffData){
    console.log("testData:",teriffData);
    this.common.params = {title: "Update Tariff",placeholder:"Enter Tariff", label:"Tariff",remark:teriffData.tariff};
    const activeModal = this.modalService.open(RemarkModalComponent, {
      size: "lg",
      container: "nb-layout"
    });activeModal.result.then(data => {
      console.log('Data: ', data);
      if (isNumeric(data.remark)) {
        let params={
          tollId:teriffData.id,
          vehicleClass:teriffData.vehicle_class,
          tariff:data.remark,
        }
        console.log("data:",params);
        this.api.post('Toll/saveTariffLogs', params)
          .subscribe(res => {
            if(res['success']){
              this.tollPayManagement();
            }
          }, err => {
            console.log(err);
          });
      }else{
        this.common.showError("please enter numeric value");
      }
    });
  }

}
