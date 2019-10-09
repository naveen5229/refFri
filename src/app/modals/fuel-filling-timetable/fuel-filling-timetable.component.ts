import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'fuel-filling-timetable',
  templateUrl: './fuel-filling-timetable.component.html',
  styleUrls: ['./fuel-filling-timetable.component.scss']
})
export class FuelFillingTimetableComponent implements OnInit {
  title = '';
  regno = '';
  vehicleId = null;
  startTime = new Date();
  endTime = new Date();
  isOpen = false;
  fuelFillingData = [];
  markers = [];
  constructor(
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public mapService: MapService) {
    this.common.handleModalSize('class', 'modal-lg', '1344', 'px', 1);
    if (this.common.params && this.common.params.fuelTimeTable) {
      this.title = this.common.params.fuelTimeTable.title;
      this.regno = this.common.params.fuelTimeTable.regno;
      this.vehicleId = this.common.params.fuelTimeTable.vehicleId;
      this.startTime = this.common.dateFormatter(this.common.params.fuelTimeTable.startTime);
      this.endTime = this.common.dateFormatter(this.common.params.fuelTimeTable.endTime);
      this.getFuelFillingData();
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
  }

  closeModal() {
    this.activeModal.close(false);
  }

  getFuelFillingData() {
    let params = "vehicleId=" + this.vehicleId + "&startTime=" + this.startTime + "&exitTime=" + this.endTime;
    this.common.loading++;
    this.api.get('Fuel/getFSEWrtVeh?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("res", res);
        this.fuelFillingData = res['data'];
        console.log("fuel Data:", this.fuelFillingData);
        this.createPolyPath();

      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }

  createPolyPath() {
    this.mapService.clearAll();
    this.markers.forEach(mark => {
      mark.setMap(null);
    });

    this.markers = [];
    let polygonOption = {
      strokeColor: '#000000',
      strokeWeight: 1,
      icons: [{
        icon: this.mapService.lineSymbol,
        offset: '0',
        repeat: '50px'
      }]
    };

    for (let i = 0; i < this.fuelFillingData.length; i++) {
      this.fuelFillingData[i].color = (i == 0) ? "00FF00" : (i == this.fuelFillingData.length - 1 ? "FF0000" : null);
      this.fuelFillingData[i].subType = (this.fuelFillingData[i]._type == 1 || i == 0 || i == this.fuelFillingData.length - 1) ? "marker" : null;
      console.log(">>>>>", this.mapService.createPolyPathManual(this.mapService.createLatLng(this.fuelFillingData[i]._lat, this.fuelFillingData[i]._long), polygonOption));
    }
    this.markers = this.mapService.createMarkers(this.fuelFillingData);

  }

  checkFuelData(index, fuel) {
    this.isOpen = true;
    console.log(index, fuel);
  }

}
