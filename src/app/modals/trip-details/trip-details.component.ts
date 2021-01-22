import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { VehicleReportComponent } from '../vehicle-report/vehicle-report.component';
import { RouteMapperComponent } from '../route-mapper/route-mapper.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss', '../../pages/pages.component.css']
})
export class TripDetailsComponent implements OnInit {
  startDate = null;
  endDate = null;
  vehicleId = null;
  vehicleOrigin = null;
  vehicleDestination = null;
  vehicleRegNo = null;
  trips = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public dateService: DateService
  ) {
    // this.common.handleModalSize('class', 'modal-lg', '1600');
    this.startDate = new Date(this.common.params.fromTime);
    this.endDate = new Date(this.common.params.toTime);
    console.log("Start Date:", this.startDate);
    this.vehicleId = this.common.params.vehicleId;
    this.vehicleRegNo = this.common.params.vehicleRegNo;
    this.getTripDetails();
  }

  ngOnDestroy(){}
ngOnInit() {
  }



  getTripDetails() {
    this.trips = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    let params = "vehicleId=" + this.vehicleId +
      "&startDate=" + startDate +
      "&endDate=" + endDate;
    console.log(params)
    this.common.loading++;
    this.api.get('TripsOperation/getTrips?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.trips = res['data'];
        if (this.trips != null) {
          console.log('vehicleTrips', this.trips);
          let first_rec = this.trips[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {

            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }

          }
          let action = { title: 'Action', placeholder: 'Action' };
          this.table.data.headings['action'] = action;


          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
          // this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.trips.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "Trip") {
          this.valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.trips[i]), isHTML: true, class: 'black' };

        } else {
          this.valobj[this.headings[j]] = { value: this.trips[i][this.headings[j]], class: 'black', action: '' };
        }
        this.valobj['action'] = {
          value: '', isHTML: true, action: null, icons: [
            { class: " icon fa fa-info", action: this.vehicleReport.bind(this, this.trips[i]) },
            { class: " fa fa-route route-mapper", action: this.openRouteMapper.bind(this, this.trips[i]) },
            
            
          ]
        }


      }
      this.valobj['style'] = { background: this.trips[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }
  vehicleReport(trip) {
    console.log("trip------", trip);
    let fromTime = trip._startdate;
    let toTime = trip._enddate;
    console.log("trip------", fromTime, toTime);
    this.common.params = { vehicleId: trip._vid, vehicleRegNo: this.vehicleRegNo, fromTime: fromTime, toTime: toTime };
    this.common.handleModalHeightWidth('class', 'modal-lg', '200', '1500');
    this.modalService.open(VehicleReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "mycustomModalClass" });

  }

  openRouteMapper(trip) {
    let fromTime = this.common.dateFormatter(new Date(trip._startdate));
    let toTime = this.common.dateFormatter(new Date(trip._enddate));
    this.common.params = { vehicleId: trip._vid, vehicleRegNo: this.vehicleRegNo, fromTime: fromTime, toTime: toTime }
    // console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass" });
    activeModal.result.then(data =>
      console.log("data", data)
      // this.reloadData()
    );
  }
 
  closeModal() {
    this.activeModal.close();
  }
  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback' }
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

}
