import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import * as _ from "lodash";
@Component({
  selector: 'daywise-vehicle-distance',
  templateUrl: './daywise-vehicle-distance.component.html',
  styleUrls: ['./daywise-vehicle-distance.component.scss']
})
export class DaywiseVehicleDistanceComponent implements OnInit {
  arrdriverData = [{
    days: null,
    Regno: null,
    attendance: null,
    id: null,
  }];
  table = {
    data: {
      headings: {
        Regno: { placeholder: 'RegNo' }
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  dates = {
    start: null,
    end: this.common.dateFormatter(new Date()),
  }
  data = [];
  vehicleId = null;
  constructor(public router: Router,
    private modalservice: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public user: UserService, ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 7)));

  }

  ngOnInit() {
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }



  getDistance() {
    let params = {
      // vehicleId: this.vehicleId,
      fromTime: this.dates.start,
      tTime: this.dates.end,
    }
    this.common.loading++;
    let response;
    this.api.post('Vehicles/foVehicleDayWiseDistance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        this.table.data.columns = this.getTableColumns(this.formattData());

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  formattData() {
    let driverAttendanceGroups = _.groupBy(this.data, 'vehicleId');
    let formattedAttendances = [];
    Object.keys(driverAttendanceGroups).map(key => {
      formattedAttendances.push({
        Regno: driverAttendanceGroups[key][0].regno,
        data: [...driverAttendanceGroups[key]]
      })
    });
    formattedAttendances[0]['data'].map(attendance => {
      this.table.data.headings[attendance.date.split(' ')[0]] = { placeholder: this.common.changeDateformat1(attendance.date.split(' ')[0]) };
    });

    console.log('Group:', driverAttendanceGroups, formattedAttendances, this.table.data.headings);
    return formattedAttendances;
  }

  getTableColumns(formattedAttendances) {
    let columns = [];

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

}
