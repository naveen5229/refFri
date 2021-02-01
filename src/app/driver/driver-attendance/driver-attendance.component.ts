import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
    start: '',
    end: ''
  };
  attendances = [];
  arrayofdates = [];
  table = {
    data: {
      headings: {
        name: { placeholder: 'Driver' },
        total_present: { placeholder: 'TP', editable: true, hideSearch: true },
        total_absent: { placeholder: 'TA', editable: true, hideSearch: true },
        total_half: { placeholder: 'THD', editable: true, hideSearch: true },
        adjust_day: { placeholder: 'AD', editable: true, hideSearch: true }

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
  user: any;


  constructor(
    public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
  ) {
    this.common.refresh = this.refresh.bind(this);
    // let today;
    // today = new Date();
    // this.dates.end = (this.common.dateFormatter(today)).split(' ')[0];
    // this.dates.start = (this.common.dateFormatter(new Date(today.getFullYear(), today.getMonth(), 1))).split(' ')[0];
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getAttendace();
  }
  // getDate(flag) {

  //   this.common.params = { ref_page: 'lrDetails' };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'month-date' });
  //   activeModal.result.then(data => {
  //     if (flag == 'start') {
  //       this.dates.start = '';
  //       this.dates.start = data.date;
  //     } else {
  //       this.dates.end = '';
  //       this.dates.end = data.date;
  //     }
  //   });
  // }

  getAttendace() {
    this.table = {
      data: {
        headings: {
          name: { placeholder: 'Driver' },
          total_present: { placeholder: 'TP', editable: true, hideSearch: true },
          total_absent: { placeholder: 'TA', editable: true, hideSearch: true },
          total_half: { placeholder: 'THD', editable: true, hideSearch: true },
          adjust_day: { placeholder: 'AD', editable: true, hideSearch: true }
        },
        columns: []
      },
      settings: {
        hideHeader: true,
        editable: true,
        editableAction: this.handleTableEdit.bind(this)
      }
    };
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
    let driverAttendanceGroups = _.groupBy(this.attendances, 'y_driver_id');
    let formattedAttendances = [];
    Object.keys(driverAttendanceGroups).map(key => {
      formattedAttendances.push({
        name: driverAttendanceGroups[key][0].y_driver_name,
        total_present: driverAttendanceGroups[key][0].y_total_present,
        total_absent: driverAttendanceGroups[key][0].y_total_absent,
        total_half: driverAttendanceGroups[key][0].y_total_half,
        id: driverAttendanceGroups[key][0].y_attendance_id,
        driver_id: driverAttendanceGroups[key][0].y_driver_id,
        date: driverAttendanceGroups[key][0].y_date,
        adjust_day: driverAttendanceGroups[key][0].y_adjust_day,
        att: driverAttendanceGroups[key][0].y_attendance,
        data: [...driverAttendanceGroups[key]]
      })
    });
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.y_date.split(' ')[0]] = {
        placeholder: this.common.changeDateformat3(attendance.y_date.split(' ')[0]),
        editable: true,
        hideSearch: true
      };

    });
    console.log('formattdata', formattedAttendances);
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
        adjust_day: { value: formattedAttendance.adjust_day },
        id: formattedAttendance.id,
        att: formattedAttendance.att,
        driver_id: formattedAttendance.driver_id
      };
      formattedAttendance.data.map(attendance => {
        column[attendance.y_date.split(' ')[0]] = { value: attendance.y_attendance, date: attendance.y_date }
      });
      column['params'] = formattedAttendance;
      columns.push(column);
    });
    return columns;
  }


  handleTableEdit(columns, formattedAttendance) {
    let att_list = [];

    this.common.params = { columns };
    console.log('current', this.common.params.columns.current);
    let show = [];
    //  console.log('columns', columns);
    let currentVal = this.common.params.columns.current;



    Object.keys(this.common.params.columns.current).forEach(key => {



      var patt = /....-..-../i;
      if (key.match(patt)) {
        if (this.common.params.columns.current[key]['value'] == 'p' || this.common.params.columns.current[key]['value'] == 'P') {
          this.common.params.columns.current.id = '2';
        } else if (this.common.params.columns.current[key]['value'] == 'a' || this.common.params.columns.current[key]['value'] == 'ap' || this.common.params.columns.current[key]['value'] == 'A' || this.common.params.columns.current[key]['value'] == 'AP') {
          this.common.params.columns.current.id = '0';
        } else if (this.common.params.columns.current[key]['value'] == 'HD' || this.common.params.columns.current[key]['value'] == 'hd' || this.common.params.columns.current[key]['value'] == 'H' || this.common.params.columns.current[key]['value'] == 'h') {
          this.common.params.columns.current.id = '1';
        } else {
          this.common.showToast('Invalid Pattern');
        }
        show.push({
          driver_id: this.common.params.columns.current.driver_id,
          name: this.common.params.columns.current.name.value,
          date: this.common.params.columns.current[key]['date'],

          att_id: this.common.params.columns.current.id,

          tp: this.common.params.columns.current.total_present.value,
          ta: this.common.params.columns.current.total_absent.value,
          thd: this.common.params.columns.current.total_half.value,
          adjust_day: this.common.params.columns.current.adjust_day.value,

        }
        );
      }
    });


    console.log('show', show);

    let params = {
      att_list: show
    };
    console.log('params', params);
    this.common.loading++;
    this.api.post('Drivers/updateDriverAttendance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.attendances = res['data'];
        this.getAttendace();

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  selectedDate(dates) {
    console.log('Dates:', dates);
  }


}

