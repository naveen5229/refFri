import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
@Component({
  selector: 'daywise-vehicle-distance',
  templateUrl: './daywise-vehicle-distance.component.html',
  styleUrls: ['./daywise-vehicle-distance.component.scss']
})
export class DaywiseVehicleDistanceComponent implements OnInit {

  checkstart = null;
  checkend = null;
  arrdriverData = [{
    days: null,
    Regno: null,
    attendance: null,
    id: null,
  }];
  table = {
    data: {
      headings: {
        Regno: { placeholder: 'RegNo', editable: false }
      },
      columns: []
    },
    settings: {
      hideHeader: true,
      editable: false
    }
  };
  startDate;
  endDate;

  data = [];
  vehicleId = null;
  constructor(public router: Router,
    private modalservice: NgbModal,
    public common: CommonService,
    public api: ApiService,
    private datePipe: DatePipe,
    public user: UserService, ) {
    let today = new Date();
    // this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 7)));
    this.startDate = new Date(today.setDate(today.getDate() - 7));
    this.endDate = new Date();
    console.log('date on cons', this.startDate, this.endDate);

  }

  ngOnInit() {
  }
  getDate(flag) {
    console.log('start', this.startDate);
    this.common.params = { ref_page: "daywise vehicle distance" };
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      if (flag == 'start') {
        this.startDate = '';
        this.startDate = data.date;
      } else {
        this.endDate = '';
        this.endDate = data.date;
      }
      // this.dates[date] = data.date;
      console.log('start and end', this.startDate, this.endDate);
    });
  }



  getDistance() {
    this.data = [];
    this.table = {
      data: {
        headings: {
          Regno: { placeholder: 'RegNo', editable: false }
        },
        columns: []
      },
      settings: {
        hideHeader: true,
        editable: false
      }
    };

    console.log('this.table', this.table);
    this.checkstart = new Date(this.startDate.valueOf());
    this.checkend = new Date(this.endDate.valueOf());
    console.log('checkend and checkstart', this.checkend, this.checkstart);
    if (this.checkend > this.checkstart.setDate(this.checkstart.getDate() + 7)) {

      this.common.showToast("Differece from start to end date should be 7 days");
      return;

    }

    let params = {
      // vehicleId: this.vehicleId,
      fromTime: this.common.dateFormatter(this.startDate).split(' ')[0],
      tTime: this.common.dateFormatter(this.endDate).split(' ')[0],
    }
    console.log('params to insert', params);
    this.common.loading++;

    let response;
    this.api.post('Vehicles/foVehicleDayWiseDistance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'] || [];
        this.table.data.columns = this.getTableColumns(this.formattData());

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  formattData() {
    console.log('this.data', this.data);
    let driverAttendanceGroups = _.groupBy(this.data, 'vehicleId');
    let formattedAttendances = [];
    Object.keys(driverAttendanceGroups).map(key => {
      formattedAttendances.push({
        Regno: driverAttendanceGroups[key][0].regno,
        data: [...driverAttendanceGroups[key]]
      })
    });
    //this.common.changeDateformat1(attendance.date.split(' ')[0])
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.date.split(' ')[0]] = { placeholder: this.datePipe.transform(attendance.date.split(' ')[0], 'dd') };
    });

    console.log('Group:', driverAttendanceGroups, formattedAttendances, this.table.data.headings);
    return formattedAttendances;
  }

  getTableColumns(formattedAttendances) {
    let columns = [];
    // this.datePipe.transform(attendance.date.split(' ')[0], 'dd-MMM');

    formattedAttendances.map(formattedAttendance => {
      let column = {
        Regno: { value: formattedAttendance.Regno },
      };
      formattedAttendance.data.map(attendance => {
        column[attendance.date.split(' ')[0]] = { value: attendance.distance }
      });
      columns.push(column);
    });
    return columns;
  }

  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Daywise Vehicle Distance";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Daywise Vehicle Distance";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}
