import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { from } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverAttendanceUpdateComponent } from '../../modals/driver-attendance-update/driver-attendance-update.component';
import * as _ from "lodash";
import { PARAMETERS } from '@angular/core/src/util/decorators';

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
        total_present: { placeholder: 'TP', editable: true },
        total_absent: { placeholder: 'TA', editable: true },
        total_half: { placeholder: 'THD', editable: true },
        isEdit: { placeholder: 'isEdit', editable: true }

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
        this.table.data.columns = this.getTableColumns(this.formattData());
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
        id: driverAttendanceGroups[key][0].attendance_id,
        driver_id: driverAttendanceGroups[key].driver_id,
        date: driverAttendanceGroups[key][0].date,
        data: [...driverAttendanceGroups[key]]
      })
    });
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.date.split(' ')[0]] = {
        placeholder: this.common.changeDateformat3(attendance.date.split(' ')[0]),
        editable: true
      };
      //console.log('dates', this.dateValue);
    });

    // console.log('Group:', formattedAttendances);
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
        isEdit: { value: '' },
        id: formattedAttendance.id
      };
      formattedAttendance.data.map(attendance => {
        column[attendance.date.split(' ')[0]] = { value: attendance.attendance, date: attendance.date }
      });
      // column['params'] = formattedAttendance;
      columns.push(column);
    });
    return columns;
  }


  handleTableEdit(columns, formattedAttendance) {
    let att_list=[];
  
    this.common.params = { columns };
    // console.log('current', this.common.params.columns.current);
    let show = [];
    console.log('columns', columns);
    let currentVal=this.common.params.columns.current;
    for(let i=0;i<currentVal.length;i++){

      att_list.push({
        "driver_name":currentVal[i]["name"],
        "tp":currentVal[i]["name"]
      })

      
      
    }
    // Object.keys(this.common.params.columns.current).forEach(date => {
    //   show.push(this.common.params.columns.current[date]);
    // });
    console.log("Show", show);

    //let att_list = _.groupBy(this.common.params.columns.current, '');

    // let att_list = [{
    //   //foid: this.user._details.id,
    //   driver_id: this.common.params.columns.current.id,
    //   driver_name: this.common.params.columns.current.name,
    //   date: this.common.params.columns.current.date,
    //   tp: this.common.params.columns.current.total_present,
    //   ta: this.common.params.columns.current.total_absent,
    //   thd: this.common.params.columns.current.total_half,
    //   // adjust_day: this.common.params.current.isEdit,
    //   att_id: this.common.params.columns.current.id,


    // }]
    // this.common.loading++;
    // this.api.post('Drivers/updateDriverAttendance')
    //   .subscribe(res => {
    //     this.common.loading--;
    //     console.log('res', res['data']);


    //   }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });
  }
}

