import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';


@Component({
  selector: 'vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.scss']
})
export class VehicleInfoComponent implements OnInit {

  vehicleInfo = {};
  vehicleId = -1;
  vehicleRegNo = null;
  tonnage = 0;
  startDate = new Date;
  endDate = new Date;

  constructor(public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public mapService: MapService
    ) { 
      this.common.handleModalSize('class', 'modal-lg', '1300', 'px', 0);

      if (this.common.params && this.common.params.refData) {
          console.log(this.common.params.refData);
          this.vehicleId = this.common.params.refData['_vid'];
          this.vehicleRegNo = this.common.params.refData['Vehicle'];
          this.startDate = new Date(this.common.params.refData['Start Date']);
          this.endDate = new Date(this.common.params.refData['End Date']);
      }
    }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
}
  closeModal() {
    this.activeModal.close();
  }

  searchVehicle(value) {
    this.vehicleId = value.id;
    this.vehicleRegNo = value.regno;
  }

  getVehicleInfo() {
    console.log(this.vehicleInfo);
    this.vehicleInfo = {};
    this.mapService.clearAll();
  let startDate = this.common.dateFormatter(this.startDate);
  let endDate = this.common.dateFormatter(this.endDate);
  console.log('start & end', startDate, endDate);
  const params = "vId=" + 26 +
    "&fromTime=" + startDate +
    "&toTime=" + endDate + "&tonnage =" + this.tonnage ;
  console.log('params', params);
  ++this.common.loading;
  this.api.get('Test/getVehicleAvgFuelConsumption?' + params)
    .subscribe(res => {
      --this.common.loading;
      console.log('Res:', res['data']);
      this.vehicleInfo = res['data'];
      this.vehicleInfo['path'].forEach(element => {
        this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long));
        this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
      });
      this.mapService.createMarkers([this.vehicleInfo['path'][0], this.vehicleInfo['path'][(this.vehicleInfo['pathCount']-1)]], false, false);

    })
  }
}
