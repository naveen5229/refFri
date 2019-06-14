import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { from } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverAttendanceUpdateComponent } from '../../modals/driver-attendance-update/driver-attendance-update.component';
import * as _ from "lodash";

@Component({
  selector: 'driver-attendance',
  templateUrl: './driver-attendance.component.html',
  styleUrls: ['./driver-attendance.component.scss', '../../pages/pages.component.css']
})
export class DriverAttendanceComponent implements OnInit {

  arrdriverData = [{
    days: null,
    name: null,
    attendance: null,
    id: null,
  }];
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date())
  };
  attendances = [];
  arrayofdates = [];
  table = {
    data: {
      headings: {
        name: { placeholder: 'Driver' },
        total_present: { placeholder: 'TP' },
        total_absent: { placeholder: 'TA' },
        total_half: { placeholder: 'THD' }
      },
      columns: []
    },
    settings: {
      //hideHeader: true
      hideHeader: true,
      editable: true,
      editableAction: this.handleTableEdit.bind(this)
    }
  };

  //dateValue = [];

  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
  ) {

    let today;
    today = new Date();
    this.dates.end = (this.common.dateFormatter(today)).split(' ')[0];
    this.dates.start = (this.common.dateFormatter(new Date(today.getFullYear(), today.getMonth(), 1))).split(' ')[0];
  }

  ngOnInit() {
  }


  getDate(date) {

    this.common.params = { ref_page: 'lrDetails' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];

      }

    });
  }





  getAttendace() {
    let params = {
      startDate: this.dates.start,
      endDate: this.dates.end
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('Drivers/getDriverAttendance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.attendances = res['data'];
        this.table.data.columns = this.table.data.columns = this.getTableColumns(this.formattData());
      }, err => {
        this.common.loading--;
        console.log(err);
      });



  }

  formattData() {
    let driverAttendanceGroups = _.groupBy(this.attendances, 'driver_id');
    let formattedAttendances = [];
    Object.keys(driverAttendanceGroups).map(key => {
      formattedAttendances.push({
        name: driverAttendanceGroups[key][0].driver_name,
        total_present: driverAttendanceGroups[key][0].total_present,
        total_absent: driverAttendanceGroups[key][0].total_absent,
        total_half: driverAttendanceGroups[key][0].total_half,

        data: [...driverAttendanceGroups[key]]
      })
    });
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.date.split(' ')[0]] = { placeholder: this.common.changeDateformat3(attendance.date.split(' ')[0]) };
      //console.log('dates', this.dateValue);
    });

    //console.log('Group:', this.dateValue);
    return formattedAttendances;
  }


  getTableColumns(formattedAttendances) {
    let columns = [];

    formattedAttendances.map(formattedAttendance => {
      let column = {
        name: { value: formattedAttendance.name },
        total_present: { value: formattedAttendance.total_present },
        total_absent: { value: formattedAttendance.total_absent },
        total_half: { value: formattedAttendance.total_half },




      };
      formattedAttendance.data.map(attendance => {
        column[attendance.date.split(' ')[0]] = { value: attendance.attendance }
      });
      columns.push(column);
    });
    return columns;
  }
  view(formattedAttendance) {
    this.common.params = { formattedAttendance }
    console.log('view', this.common.params);
  }
  handleTableEdit() {

  }
}

