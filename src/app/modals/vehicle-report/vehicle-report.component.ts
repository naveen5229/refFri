import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment_ from 'moment';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { DateService } from '../../services/date.service';
const moment = moment_;
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.scss']
})
export class VehicleReportComponent implements OnInit {

  startDate = null;
  element = '';
  endDate = null;
  placeName = '';
  startTime: any;
  endTime: any;
  resultTime: any;
  duration = [];
  vid = '';
  details = [];
  report = [];
  vehicleRegNo;
  limit;
  table = null;
  i: ''; d: '';

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal,
    public dateService: DateService) {
    this.vid = this.common.params.vehicleId;
    this.vehicleRegNo = this.common.params.vehicleRegNo;

    if (this.common.params.ref_page == 'consView') {
      let today = new Date(), start = new Date();

      this.endDate = today;
      console.log("end Date:", this.endDate);

      start.setDate(today.getDate() - 3);
      this.startDate = start;
      console.log("Start Date:", this.startDate);


    }
    else {
      console.log('fromTime', new Date(this.common.params.fromTime));
      console.log('totime', new Date(this.common.params.toTime));
      this.startDate = new Date(this.common.params.fromTime);
      this.endDate = new Date(this.common.params.toTime);
      console.log("fromTime", this.startDate);
      console.log("endDate", this.endDate);
    }


    this.getVehicleReport();
  }


  ngOnDestroy(){}
ngOnInit() {
  }
  ngAfterViewInit() { }

  searchVehicle(vehicleList) {
    this.vid = vehicleList.id;
  }


  getVehicleReport() {
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    let params = {
      vehicleId: this.vid,
      startDate: startDate,
      endDate: endDate,
    };
    this.duration = [];
    this.common.loading++;
    this.api.post('HaltOperations/getVehicleEvents', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.report = res['data'];
        if (!(res['data'].length))
          this.common.showToast('record empty !!');
        this.report.forEach((d) => {
          this.startTime = d.start_time;
          this.startTime = new Date(this.startTime);
          this.endTime = d.end_time;

          if (this.endTime != null) {
            this.endTime = new Date(this.endTime);
            this.resultTime = this.endTime - this.startTime;
            console.log('begore resultTime: ' + this.resultTime);
            var result = this.common.dateDiffInHoursAndMins(this.startTime, this.endTime);
            //var result=moment.utc(this.resultTime).format('HH:mm');
            console.log('moment', moment.utc(this.resultTime).format('HH:mm'));
            this.duration.push(result);
          } else {
            var result1 = 'Running';
            this.duration.push(result1);
          }


        });
        console.log('result time', this.resultTime);
        this.table = this.setTable();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  showLocation(details) {
    if (!details.lat) {
      this.common.showToast('Vehicle location not available!');
      return;
    }
    const location = {
      lat: details.lat,
      lng: details.long,
      name: '',
      time: ''
    };
    console.log('Location: ', location);
    this.common.params = { location, title: 'Vehicle Location' };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: 'lg', container: 'nb-layout' });
  }

  setTable() {
    let headings = {
      Start: { title: 'Start', placeholder: 'Start' },
      End: { title: 'End', placeholder: 'End' },
      Place: { title: 'Place', placeholder: 'Place' },
      Location: { title: 'Location', placeholder: 'Location' },
      // Reason: { title: 'Reason', placeholder: 'Reason' },
      Duration: { title: 'Duration', placeholder: 'Duration' },
      Action: { title: 'Action', placeholder: 'Action' }
    };

    // if (this.user._loggedInBy == 'admin') {
    //   headings['delete'] = { title: 'Delete', placeholder: 'Delete', hideSearch: true, class: 'del' };
    // }
    return {
      report: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    let i = 0;
    this.report.map(R => {

      let column = {
        Start: { value:R.event_type=='state' ? "* "+ this.datePipe.transform(R.start_time, 'dd MMM HH:mm '):this.datePipe.transform(R.start_time, 'dd MMM HH:mm ')},
        End: { value: this.datePipe.transform(R.end_time, 'dd MMM HH:mm') },
        Place: { value: this.getPlaceName(R), class: R.halt_type_id == 11 ? 'green' : R.halt_type_id == 21 ? 'red' : 'default' },
        Location: { value: R.loc_name },
        // Reason: { value: R.halt_reason, class: R.halt_type_id == 11 ? 'green' : R.halt_type_id == 21 ? 'red' : 'default' },
        Duration: { value: this.duration[i] },
        Action: { value: `<i class="fa fa-map-marker"></i>`, isHTML: true, action: this.showLocation.bind(this, R) },
      };

      columns.push(column);
      i++;
    });
    return columns;
  }

  getPlaceName(R) {
    let str_site_name, str_halt_reason;
    if (R.site_name != null) {
      str_site_name = R.site_name.toUpperCase();
      console.log('str_site_name', str_site_name)
    }
    if (R.halt_reason != null) {
      str_halt_reason = R.halt_reason.toUpperCase();
      console.log('str_halt_reason', str_halt_reason)
    }


    if ((str_site_name == "UNKNOWN") || (R.site_name == null)) {
      if (R.site_type != null) {
        if ((str_halt_reason != "UNKNOWN")) {
          this.placeName = R.site_type + '_' + R.halt_reason;
          console.log('place:1 ', this.placeName);
        } else {
          this.placeName = R.site_type;
          console.log('place:2 ', this.placeName);
        }
      } else if ((str_halt_reason != "UNKNOWN")) {
        this.placeName = R.halt_reason;
        console.log('place:3 ', this.placeName);
      } else {
        this.placeName = 'Halt';
        console.log('place:4 ', this.placeName);
      }
    } else if ((str_halt_reason != "UNKNOWN")) {
      this.placeName = R.site_name + '_' + R.halt_reason;
      console.log('place:5 ', this.placeName);
    } else {
      this.placeName = R.site_name;
      console.log('place:6 ', this.placeName);
    }

    return this.placeName;

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
