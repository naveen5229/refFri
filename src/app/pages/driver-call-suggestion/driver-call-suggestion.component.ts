import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverDistanceComponent } from '../../modals/driver-distance/driver-distance.component';
import { RouteMapperComponent } from "../../modals/route-mapper/route-mapper.component";
import { ChangeDriverComponent } from '../../modals/DriverModals/change-driver/change-driver.component';
import { AddShortTargetComponent } from '../../modals/add-short-target/add-short-target.component';
import { VehicleTripUpdateComponent } from '../../modals/vehicle-trip-update/vehicle-trip-update.component';
import { headersToString } from 'selenium-webdriver/http';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { ReportIssueComponent } from '../../modals/report-issue/report-issue.component';

@Component({
  selector: 'driver-call-suggestion',
  templateUrl: './driver-call-suggestion.component.html',
  styleUrls: ['./driver-call-suggestion.component.scss']
})
export class DriverCallSuggestionComponent implements OnInit {
  driverData = [];
  headings = [];
  kmpdval = 300;
  runhourval = 10;
  distance = 0;
  strcurdate = '';
  stryesterday = '';
  dis_all = 'dcs'
  table = {
    data: {
      headings: {
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    let today = new Date();
    this.strcurdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today.setDate(today.getDate() - 1);
    this.stryesterday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.getReport();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {

    this.getReport();
  }
  getReportdata(dis_all) {
    console.log("dis_all", dis_all);
    if (dis_all == '11') {
      this.getLongLoading(dis_all);
    } else if (dis_all == '21') {
      this.getLongUnloading(dis_all)
    } else if (dis_all == '51') {
      this.getOnwardDelayData(dis_all)
    } else if (dis_all == 'dcs') {
      this.fetchReport();
    } else if (dis_all == 'pdf') {
      this.getDelayFaults();
    } else if (dis_all == 'st') {
      this.getShortTarget();
    }
  }




  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  fetchReport() {
    //if((this.kmpdval == undefined || !this.kmpdval) || (this.runhourval == undefined || !this.runhourval)) {
    if (this.kmpdval == undefined || !this.kmpdval) {
      this.common.showError("Please provide Km per day");
      return false;
    }
    this.getReport();
  }


  openDistance(driverData) {
    this.common.loading++;
    let today = new Date();
    let strcurdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today.setDate(today.getDate() - 1);
    let stryesterday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.api.post('Vehicles/getVehDistanceBwTime', { vehicleId: driverData, fromTime: stryesterday, tTime: strcurdate })
      .subscribe(res => {
        this.common.loading--;
        let data = res['data'];
        if (data > 0)
          this.distance = Math.round((data / 1000) * 100) / 100;
        this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
        this.openRouteMapper(driverData);

      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }

  getReport() {
    this.common.loading++;
    this.headings = [];
    let x_kmpd, x_runhour;
    if (this.kmpdval == 0 || this.kmpdval == undefined) {
      x_kmpd = null;
    } else {
      x_kmpd = this.kmpdval;
    }
    if (this.runhourval == 0 || this.runhourval == undefined) {
      x_runhour = null;
    } else {
      x_runhour = this.runhourval;
    }
    let x_user_id = this.user._details.id;
    if (this.user._loggedInBy == "admin") {
      x_user_id = this.user._customer.id;
    }
    if (typeof x_kmpd == "string") {
      x_kmpd = parseInt(x_kmpd);
    }

    this.api.post('Drivers/getDriverCallSuggestion', { x_user_id: x_user_id, x_kmpd: x_kmpd })
      .subscribe(res => {
        this.common.loading--;
        this.resetDisplayTable();
        this.driverData = res['data'];
        if (this.driverData == null || res['data'] == null) {
          console.log("resetting table");
          this.driverData = [];
          this.resetDisplayTable();
        }
        console.info("driver Data", this.driverData);
        let first_rec = this.driverData[0];
        this.table.data.headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = hdgobj;
          }
        }
        console.log("hdgs:");
        console.log(this.headings);
        console.log(this.table.data.headings);

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetDisplayTable() {
    this.table = {
      data: {
        headings: {
        },
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }

  getTableColumns() {
    let columns = [];

    for (let i = 0; i < this.driverData.length; i++) {
      let valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        let val = this.driverData[i][this.headings[j]];
        if (this.headings[j] == "Dist Covered" && this.driverData[i]._starttime) {

          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.openRouteMapper.bind(this, this.driverData[i]) };

        } else if (this.headings[j] == "Driver") {
          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.openChangeDriverModal.bind(this, this.driverData[i]) };

        }
        else if (this.headings[j] == "Vehicle") {
          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.addShortTarget.bind(this, this.driverData[i]) };

        }
        else if (this.headings[j] == "Trip") {
          valobj[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.driverData[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.driverData[i]) };
        }
        else if (this.headings[j] == "Current Loc") {
          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.showLocation.bind(this, this.driverData[i]) };
        }
        else if (this.headings[j] == "Last 24Hr KM" && this.driverData[i]._last24starttime) {
          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.openRouteMapper.bind(this, this.driverData[i], "Last 24Hr KM") };
        }
        else if (this.headings[j] == "Act") {
          valobj[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.driverData[i]) },
              this.user.permission.add && { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.driverData[i]) },
              { class: "icon fa fa-route route-mapper", action: this.openRouteMapper.bind(this, this.driverData[i]) },
            ]
          };

          // { value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.driverData[i]) };

        }
        else {
          valobj[this.headings[j]] = { value: val, class: 'black', action: '' };
        }
      }
      columns.push(valobj);
    }
    console.log("datalength:");
    console.log(this.driverData.length);
    return columns;
  }



  //--------------------------------- onward data--------------------
  showTable = false;
  onwardDelayData = [];
  valobj2 = {};
  table2 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  getOnwardDelayData(type) {
    let hrs = this.hours;
    if (this.hoursType == 'days') {
      hrs = this.hours * 24;
    }
    this.onwardDelayData = [];
    this.common.loading++;
    let params = "type=" + type +
      "&hours=" + hrs;
    this.api.get('TripsOperation/tripOnwardDelay?' + params)
      .subscribe(res => {
        this.common.loading--;

        console.log("result", res['data']);
        this.onwardDelayData = res['data'];
        this.smartTableWithHeadings();

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  smartTableWithHeadings() {
    this.table2 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.onwardDelayData != null) {
      console.log('onwardDelayData', this.onwardDelayData);
      let first_rec = this.onwardDelayData[0];
      console.log("first_Rec", first_rec);

      for (var key in first_rec) {
        if (key.charAt(0) != "_") {
          this.headings.push(key);
          let headerObj = { title: key, placeholder: this.formatTitle(key) };
          this.table2.data.headings[key] = headerObj;
        }

      }

      this.table2.data.columns = this.getTableColumns2();
      console.log("table:2");
      console.log(this.table2);
      this.showTable = true;
    } else {
      this.common.showToast('No Record Found !!');
    }


  }

  getTableColumns2() {
    let columns = [];
    for (var i = 0; i < this.onwardDelayData.length; i++) {
      this.valobj2 = {};

      for (let j = 0; j < this.headings.length; j++) {
        console.log("header", this.headings[j])
        if (this.headings[j] == 'Vehicle') {
          this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.onwardDelayData[i]) };
        }
        else if (this.headings[j] == "Trip") {
          this.valobj2[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.onwardDelayData[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.onwardDelayData[i]) };

        }
        else if (this.headings[j] == "Current Loc") {
          this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.onwardDelayData[i]) };

        }
        else if (this.headings[j] == "%Dist") {
          this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.onwardDelayData[i]) };

        }
        else if (this.headings[j] == "Mobile") {
          this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'blue', action: this.openChangeDriverModal.bind(this, this.onwardDelayData[i]) };

        }
        else if (this.headings[j] == "Act") {
          this.valobj2[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.onwardDelayData[i]) },
              this.user.permission.add && { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.onwardDelayData[i]) }]
          };

          //{ value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.onwardDelayData[i]) };

        }
        else {
          this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      this.valobj2['style'] = { background: this.onwardDelayData[i]._rowcolor };
      columns.push(this.valobj2);
    }

    console.log('Columns:', columns);
    return columns;
  }


  //---------------------- delay defaults data

  delayFaults = [];
  valobj3 = {};
  table3 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  getDelayFaults() {

    this.delayFaults = [];
    this.table3 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //  console.log('params: ', params);
    this.common.loading++;
    this.api.get('Placement/placementDelayFaults?')
      .subscribe(res => {
        this.common.loading--;
        this.delayFaults = res['data'];
        if (this.delayFaults != null) {
          console.log('delayFaults', this.delayFaults);
          let first_rec = this.delayFaults[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table3.data.headings[key] = headerObj;
            }

          }

          this.table3.data.columns = this.getTableColumns3();
          console.log("table:");
          console.log(this.table);
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
          this.delayFaults = [];
          return;
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns3() {
    let columns = [];
    for (var i = 0; i < this.delayFaults.length; i++) {
      this.valobj3 = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == "mobileno") {
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openChangeDriverModal.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "%Dist") {
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "vehicle") {
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "Trip") {
          this.valobj3[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.delayFaults[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.delayFaults[i]) };

        }
        else if (this.headings[j] == "Current Loc") {
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.delayFaults[i]) };

        } else if (this.headings[j] == "Act") {
          this.valobj3[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.delayFaults[i]) },
              this.user.permission.add && { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.delayFaults[i]) }]
          };
          //{ value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.delayFaults[i]) };

        }
        else {
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'black', action: '' };
        }

      }
      this.valobj3['style'] = { background: this.delayFaults[i]._rowcolor };
      columns.push(this.valobj3);
    }

    console.log('Columns:', columns);
    return columns;
  }


  //----------------short Target Data
  shortTarget = [];
  valobj4 = {};
  table4 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  getShortTarget() {

    this.shortTarget = [];
    this.table4 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //  console.log('params: ', params);
    this.common.loading++;
    this.api.get('Placement/getShortTarget')
      .subscribe(res => {
        this.common.loading--;
        this.shortTarget = res['data'];

        //this.shortTarget = res['data'];
        if (this.shortTarget != null) {
          console.log('shortTarget', this.shortTarget);
          let first_rec = this.shortTarget[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table4.data.headings[key] = headerObj;
            }

          }

          this.table4.data.columns = this.getTableColumns4();
          console.log("table:");
          console.log(this.table4);
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
          this.shortTarget = [];
          return;
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns4() {
    let columns = [];
    for (var i = 0; i < this.shortTarget.length; i++) {
      this.valobj4 = {};
      for (let j = 0; j < this.headings.length; j++) {
        console.log("header", this.headings[j]);
        if (this.headings[j] == 'Vehicle') {
          this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.shortTarget[i]) };

        } else if (this.headings[j] == 'Current Loc') {
          this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.shortTarget[i]) };

        } else if (this.headings[j] == 'Trip') {
          this.valobj4[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.shortTarget[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.shortTarget[i]) };

        }
        else if (this.headings[j] == "Act") {
          this.valobj4[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.shortTarget[i]) },
              this.user.permission.add &&   { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.shortTarget[i]) }]
          };//{ value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.shortTarget[i]) };

        } else if (this.headings[j] == "remark") {
          this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.shortTarget[i]) };

        }
        else if (this.headings[j] == "Mobile") {
          this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'blue', action: this.openChangeDriverModal.bind(this, this.shortTarget[i]) };

        }
        else {
          this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'black', action: '' };

        }


      }
      this.valobj4['style'] = { background: this.shortTarget[i]._rowcolor };
      columns.push(this.valobj4);
    }

    console.log('Columns:', columns);
    return columns;
  }


  //----------------Long Loading Data
  longLoading = [];
  hoursType = 'hrs';
  hours = 10;
  valobj5 = {};
  table5 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  getLongLoading(type) {
    let hrs = this.hours;
    this.longLoading = [];
    this.table5 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.hoursType == 'days') {
      hrs = this.hours * 24;
    }
    let params = "type=" + type +
      "&hours=" + hrs;
    console.log('params: ', params);
    this.common.loading++;
    this.api.get('TripsOperation/tripOnwardDelay?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.longLoading = res['data'];
        //this.shortTarget = res['data'];
        if (this.longLoading != null) {
          console.log('shortTarget', this.longLoading);
          let first_rec = this.longLoading[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table5.data.headings[key] = headerObj;
            }

          }

          this.table5.data.columns = this.getTableColumns5();
          console.log("table:");
          console.log(this.table5);
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
          this.longLoading = [];
          return;
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns5() {
    let columns = [];
    for (var i = 0; i < this.longLoading.length; i++) {
      this.valobj5 = {};
      for (let j = 0; j < this.headings.length; j++) {
        console.log("header", this.headings[j]);
        if (this.headings[j] == 'Vehicle') {
          this.valobj5[this.headings[j]] = { value: this.longLoading[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.longLoading[i]) };

        } else if (this.headings[j] == 'Driver') {
          this.valobj5[this.headings[j]] = { value: this.longLoading[i][this.headings[j]], class: 'blue', action: this.openChangeDriverModal.bind(this, this.longLoading[i]) };
        }
        else if (this.headings[j] == 'Current Loc') {
          this.valobj5[this.headings[j]] = { value: this.longLoading[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.longLoading[i]) };

        }
        else if (this.headings[j] == 'Act') {
          this.valobj5[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.longLoading[i]) },
              this.user.permission.add &&   { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.longLoading[i]) }]
          };
          //{ value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.longLoading[i]) };

        }
        else if (this.headings[j] == 'Trip') {
          this.valobj5[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.longLoading[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.longLoading[i]) };

        }
        else if (this.headings[j] == '%Dist') {
          this.valobj5[this.headings[j]] = { value: this.longLoading[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.longLoading[i]) };

        }
        else {
          this.valobj5[this.headings[j]] = { value: this.longLoading[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      this.valobj5['style'] = { background: this.longLoading[i]._rowcolor };
      columns.push(this.valobj5);
    }

    console.log('Columns:', columns);
    return columns;
  }

  //---------------------Long unloading data

  longUnLoading = [];
  valobj6 = {};
  table6 = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  getLongUnloading(type) {

    this.longUnLoading = [];
    let hrs = this.hours;
    this.table6 = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    if (this.hoursType == 'days') {
      hrs = this.hours * 24;
    }
    let params = "type=" + type +
      "&hours=" + hrs;
    console.log('params: ', params);
    this.common.loading++;
    this.api.get('TripsOperation/tripOnwardDelay?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.longUnLoading = res['data'];
        console.log('longunLoading', this.longUnLoading);

        if (this.longUnLoading != null) {
          let first_rec = this.longUnLoading[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table6.data.headings[key] = headerObj;
            }

          }

          this.table6.data.columns = this.getTableColumns6();
          console.log("table:");
          console.log(this.table6);
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns6() {
    let columns = [];
    for (var i = 0; i < this.longUnLoading.length; i++) {
      console.log("longUnLoading", this.longUnLoading);
      this.valobj6 = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (this.headings[j] == 'Vehicle') {
          this.valobj6[this.headings[j]] = { value: this.longUnLoading[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.longUnLoading[i]) };

        } else if (this.headings[j] == 'Driver') {
          this.valobj6[this.headings[j]] = { value: this.longUnLoading[i][this.headings[j]], class: 'blue', action: this.openChangeDriverModal.bind(this, this.longUnLoading[i]) };
        }
        else if (this.headings[j] == 'Current Loc') {
          this.valobj6[this.headings[j]] = { value: this.longUnLoading[i][this.headings[j]], class: 'blue', action: this.showLocation.bind(this, this.longUnLoading[i]) };

        }
        else if (this.headings[j] == 'Act') {
          this.valobj6[this.headings[j]] = {
            value: '', isHTML: true, action: null, icons: [
              { class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.longUnLoading[i]) },
              this.user.permission.add &&  { class: 'icon fa fa-pencil-square-o', action: this.addShortTarget.bind(this, this.longUnLoading[i]) }]
          };
          //{ value: "", class: 'icon fa fa-question-circle', action: this.reportIssue.bind(this, this.longUnLoading[i]) };

        }
        else if (this.headings[j] == 'Trip') {
          this.valobj6[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.longUnLoading[i]), isHTML: true, class: 'black', action: this.openPlacementModal.bind(this, this.longUnLoading[i]) };

        }
        else if (this.headings[j] == '%Dist') {
          this.valobj6[this.headings[j]] = { value: this.longUnLoading[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.longUnLoading[i]) };

        }
        else if (this.headings[j] == "Trip") {
          console.log("htmll------", this.common.getJSONTripStatusHTML(this.longUnLoading[i]));
          this.valobj6[this.headings[j]] = { value: this.common.getJSONTripStatusHTML(this.longUnLoading[i]), isHTML: true, class: 'black', action: '' };

        }
        else {
          this.valobj6[this.headings[j]] = { value: this.longUnLoading[i][this.headings[j]], class: 'black', action: '' };
        }
      }
      this.valobj6['style'] = { background: this.longUnLoading[i]._rowcolor };
      columns.push(this.valobj6);
    }

    console.log('Columns:', columns);
    return columns;
  }





  //-------------open Modals--------------------


  addShortTarget(target) {
    console.log("target", target);
    this.common.params = {
      vehicleId: target._vid || target._vehicleid,
      vehicleRegNo: target.vehicle || target.Vehicle || target.regno || target.v_regno

    };
    console.log("params=", this.common.params);
    const activeModal = this.modalService.open(AddShortTargetComponent, {
      size: "sm",
      container: "nb-layout"
    });
  }

  openChangeDriverModal(vehicleTrip) {
    console.log("vehicleTrip", vehicleTrip);
    let vt = {
      vehicleId: vehicleTrip._vehicleid || vehicleTrip._vid,
      vehicleRegNo: vehicleTrip.Vehicle || vehicleTrip.regno || vehicleTrip.v_regno || vehicleTrip.vehicle
    }
    this.common.params = { vehicleId: vt.vehicleId, vehicleRegNo: vt.vehicleRegNo };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.respone);


    });
  }
  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails = {
      vehicleId: placement._vehicleid || placement._vid,
      siteId: placement._siteid ? placement._siteid : -1
    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'cs' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   //console.log("data", data.respone);

    // });
  }
  showLocation(loc) {
    if (!loc._curlat && !loc._tlat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: loc._curlat || loc._tlat,
      lng: loc._curlong || loc._tlong,
      name: "",
      time: ""
    };
    //console.log("Location: ", location);
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }


  openRouteMapper(defaultFault, timeFrom = 'Trip Start') {
    let fromTime = null;
    console.log("defaultFault", defaultFault);
    if (timeFrom == 'Last 24Hr KM') {
      fromTime = this.common.dateFormatter(defaultFault._last24starttime);
    } else {
      fromTime = this.common.dateFormatter(defaultFault._starttime);
    }
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: defaultFault._vehicleid || defaultFault._vid,
      vehicleRegNo: defaultFault.Vehicle || defaultFault.regno || defaultFault.v_regno || defaultFault.vehicle,
      fromTime: fromTime,
      toTime: toTime
    };
    console.log("open Route Mapper modal", this.common.params);
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
  }

  reportIssue(kpi) {
    //console.log("Kpi:", kpi);
    let vehicleid = kpi._vehicleid || kpi._vid;
    this.common.params = { refPage: "db" };
    const activeModal = this.modalService.open(ReportIssueComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(
      data =>
        data.status && this.common.reportAnIssue(data.issue, kpi._vehicleid)
    );
  }

}
