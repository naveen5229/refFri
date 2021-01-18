import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-performance',
  templateUrl: './vehicle-performance.component.html',
  styleUrls: ['./vehicle-performance.component.scss', '../pages.component.css']
})
export class VehiclePerformanceComponent implements OnInit {

  startDate = null;
  endDate = null;
  vehiclePerformance = [];
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
  click = false;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public dateService: DateService) {
    let today = new Date(), start = new Date();
    this.endDate = today;
    this.endDate = this.common.dateFormatter(today);
    start = new Date(today.setDate(today.getDate() - 7));
    this.startDate = this.common.dateFormatter(start);
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.getVehiclePerformance();
  }

 


  getDate(type) {
    this.common.params = { ref_page: 'vehicle-performance' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
        }
        else {
          this.endDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

  getVehiclePerformance() {
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
    this.vehiclePerformance = [];

    const params = {
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(this.endDate.split(' ')[0])
    }
    this.click = true;
    const data = "startDate=" + params.startDate +
      "&endDate=" + params.endDate;
    this.common.loading++;
    this.api.get('Vehicles/vehiclePerformance?' + data)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        if (res['data'] == null) {

          this.vehiclePerformance = [];
          // this.click=false;
          this.table = null;
          return;

        }
        this.vehiclePerformance = res['data'];

        let first_rec = this.vehiclePerformance[0];
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
    for (var i = 0; i < this.vehiclePerformance.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        console.log("Test....", this.headings[j]);
        if (this.headings[j] === "distance") {
          this.valobj[this.headings[j]] = { value: this.vehiclePerformance[i][this.headings[j]], class: this.vehiclePerformance[i][this.headings[j]] > 0 ? 'blue' : '', action: this.vehiclePerformance[i][this.headings[j]] > 0 ? this.openRouteMapper.bind(this, this.vehiclePerformance[i]) : '' };

        }
        else {

          this.valobj[this.headings[j]] = { value: this.vehiclePerformance[i][this.headings[j]] };
        }
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  openRouteMapper(details) {


    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: details._vid,
      vehicleRegNo: details.regno,
      fromTime: details._start,
      toTime: details._end
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    // activeModal.result.then(
    //   data => ////console.log("data", data)
    //   // this.reloadData()
    // );
  }


  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


}
