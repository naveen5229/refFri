import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { RemarkModalComponent } from '../remark-modal/remark-modal.component';
import { isNumeric } from 'rxjs/util/isNumeric';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AddmissingtollComponent } from '../addmissingtoll/addmissingtoll.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'tollpaymentmanagement',
  templateUrl: './tollpaymentmanagement.component.html',
  styleUrls: ['./tollpaymentmanagement.component.scss']
})
export class TollpaymentmanagementComponent implements OnInit {

  startDate = new Date();
  endDate = new Date();
  disStart = null;
  disEnd = null;
  vehicleId = null;
  vehicleRegNo = '';
  vehicleClass = [];
  vClass = '';
  tpManagement_tolls = [];
  tpManagement_paths = [];
  disc = 0;
  terrifCount = null;
  constructor(public common: CommonService,
    public mapService: MapService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    console.log("CommonData:", this.common.params);
    if (this.common.params && this.common.params.vehId) {
      this.vehicleId = this.common.params.vehId;
      this.vehicleRegNo = this.common.params.vehRegNo;
      this.disStart = this.common.params.startDatedis;
      this.disEnd = this.common.params.endDatedis;
      this.startDate = this.common.params.startDate;
      this.endDate = this.common.params.endDate;
    }
    // this.endDate = new Date();
    // this.startDate = new Date();
    this.getVehicleClass();
  }


  ngOnDestroy() { }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("tollpaymentmanagement-map", 10);
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

  tollPayManagement() {
    const ids = [28124, 16295, 28116, 28115, 29033];
    if (ids.includes(this.vehicleId)) {
      this.getTolls();
      return;
    }

    this.common.loading++;
    let params = {
      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate),
      vehicle_id: this.vehicleId,
      vClass: this.vClass
    }
    console.log("data:", params);
    this.api.post('Toll/getTollsOnVehicleRoute', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          console.log("response", res['data']);
          this.tpManagement_tolls = res['data']['tolls'];
          this.mapService.clearAll();
          this.mapService.createMarkers(this.tpManagement_tolls, false, false);
          this.tpManagement_paths = res['data']['path'];
          this.terrifCount = (this.tpManagement_tolls).reduce((acc, val) => acc += val.tariff == null ? 0 : val.tariff, 0);
          console.log("disc:", this.disc);
          let polydata = this.formatCSVData(this.tpManagement_paths);
          this.showPoly(polydata['data']);
          this.disc = polydata['dis'];
          // this.disc=this.showPoly(polydata['dis']);

          console.log("TotalTariff:", this.terrifCount);

        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getTolls() {
    this.common.loading++;
    const subscription = this.api.getJavaPortDost(8086, `getTolls/${this.vehicleId}/${this.vClass}`)
      .subscribe((res: any) => {
        this.common.loading--;
        console.log('res:', res);
        this.tpManagement_tolls = res.tolls;
        this.mapService.clearAll();
        this.mapService.createMarkers(this.tpManagement_tolls, false, false);
        this.tpManagement_paths = res.path;
        this.terrifCount = (this.tpManagement_tolls).reduce((acc, val) => acc += val.tariff == null ? 0 : val.tariff, 0);
        console.log("disc:", this.disc);
        let polydata = this.tpManagement_paths;
        this.showPoly(polydata);
        this.disc = this.calculateDistance(polydata);
        // this.disc=this.showPoly(polydata['dis']);

        console.log("TotalTariff:", this.terrifCount);

        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
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

  showPoly(data, options?) {
    this.mapService.polygonPath = null;
    let polyPath = null;
    data.forEach(rd => {
      polyPath = this.mapService.createPolyPathManual(this.mapService.createLatLng(rd.lat, rd.long || rd.lng), options);
    });
    let boundData = data.map(e => { return { lat: parseFloat(e.lat), lng: e.long ? parseFloat(e.long) : e.lng }; });
    this.mapService.setMultiBounds(boundData, true);
    return polyPath;
  }

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.vehicleEvents, event.previousIndex, event.currentIndex);
  }

  updateTeriff(teriffData) {
    console.log("testData:", teriffData);
    this.common.params = { title: "Update Tariff", placeholder: "Enter Tariff", label: "Tariff", remark: teriffData.tariff };
    const activeModal = this.modalService.open(RemarkModalComponent, {
      size: "sm",
      container: "nb-layout"
    }); activeModal.result.then(data => {
      console.log('Data: ', data);
      if (data.response) {
        if (isNumeric(data.remark)) {
          let params = {
            tollId: teriffData.id,
            vehicleClass: teriffData.vehicle_class,
            tariff: data.remark,
          }
          console.log("data:", params);
          this.api.post('Toll/saveTariffLogs', params)
            .subscribe(res => {
              if (res['success']) {
                this.tollPayManagement();
              }
            }, err => {
              console.log(err);
            });
        } else {
          this.common.showError("please enter numeric value");
        }
      } else {
        return;
      }
    });
  }

  addMissingToll() {
    let vehData = {
      vid: this.vehicleId,
      vClass: this.vClass,
      sdate: this.startDate,
      edate: this.endDate
    }
    this.common.params = { vehData };
    const activeModal = this.modalService.open(AddmissingtollComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }

}
