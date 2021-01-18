import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { on } from 'cluster';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-trip-stages',
  templateUrl: './vehicle-trip-stages.component.html',
  styleUrls: ['./vehicle-trip-stages.component.scss', '../pages.component.css']
})
export class VehicleTripStagesComponent implements OnInit {

  vehicleId = null;
  startDate = '';
  endDate = '';
  openType = this.common.openType;
  vehicleNo = '';
  tripstagesData = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: '75vh'
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.common.openType = 'page'
    console.log("openType", this.openType);
    let today = new Date();
    this.endDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.startDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)))).split(' ')[0];
    this.common.refresh = this.refresh.bind(this);
    if (this.openType == "modal") {
      console.log("console.log", this.common.params);
      this.startDate = this.common.params.fromTime ? this.common.params.fromTime : this.startDate;
      this.endDate = this.common.params.toTime ? this.common.params.toTime : this.endDate;
      this.vehicleId = this.common.params.vehicleId;
      this.vehicleNo = this.common.params.vehicleRegNo;
      this.getTripStages();

    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.vehicleId = null;
    this.getTripStages();
  }
  getDate(type) {
    this.common.params = { ref_page: 'vehicle trip stages' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.startDate);
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });
  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.vehicleId = vehicle.id;
  }

  getTripStages() {
    this.tripstagesData = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        tableHeight: '75vh',
      }
    };

    const params = {
      vehicleId: this.vehicleId ? this.vehicleId : -1,
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(this.endDate.split(' ')[0])
      // endDate: this.common.dateFormatter1(enddate.setDate(enddate.getDate() + 1)).split(' ')[0],
    }

    console.log("params:", params);
    const data = "startDate=" + params.startDate +
      "&endDate=" + params.endDate + "&vehicleId=" + params.vehicleId;
    this.common.loading++;
    this.api.get('TripsOperation/vehicleDynTripSummary?' + data)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.tripstagesData = res['data'];
        console.log('tripstagesData', this.tripstagesData);
        let first_rec = this.tripstagesData[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getTableColumns() {
    let columns = [];
    let State
    for (var i = 0; i < this.tripstagesData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.tripstagesData[i][this.headings[j]], class: (this.tripstagesData[i][this.headings[j]] > 0) ? 'blue' : 'black', action: this.tripstagesData[i][this.headings[j]] > 0 ? this.openRouteMapper.bind(this, this.tripstagesData[i]) : '' };
      }
      columns.push(this.valobj);
    }
    return columns;
  }



  openRouteMapper(data) {
    console.log('Data', data);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    let startDate = data._startdt.split('T')[0];
    let startTimePeriod = data._startdt.split('T')[1];

    let endDate = data._enddt.split('T')[0];
    let endTimePeriod = data._enddt.split('T')[1];

    this.common.params = {
      vehicleId: data._vid,
      vehicleRegNo: data._regno,
      fromTime: startDate + " " + startTimePeriod,
      toTime: endDate + " " + endTimePeriod
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
    );
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
