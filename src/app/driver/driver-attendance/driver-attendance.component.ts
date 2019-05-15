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
  table = {
    data: {
      headings: {
        name: { placeholder: 'Driver' }
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  dateValue = [];

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
        this.table.data.columns = this.getTableColumns(this.formattData());
      }, err => {
        this.common.loading--;
        console.log(err);
      });



  }

  formattData() {
    let driverAttendanceGroups = _.groupBy(this.attendances, 'DRIVERID');
    let formattedAttendances = [];
    Object.keys(driverAttendanceGroups).map(key => {
      formattedAttendances.push({
        name: driverAttendanceGroups[key][0].NAME,
        data: [...driverAttendanceGroups[key]]
      })
    });
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.DATE.split(' ')[0]] = { placeholder: this.common.changeDateformat1(attendance.DATE.split(' ')[0]) };
    });

    console.log('Group:', driverAttendanceGroups, formattedAttendances, this.table.data.headings);
    return formattedAttendances;
  }

  getTableColumns(formattedAttendances) {
    let columns = [];

    formattedAttendances.map(formattedAttendance => {
      let column = {
        name: { value: formattedAttendance.name },
      };
      formattedAttendance.data.map(attendance => {
        column[attendance.DATE.split(' ')[0]] = { value: attendance.HRS }
      });
      columns.push(column);
    });
    return columns;
  }


}

