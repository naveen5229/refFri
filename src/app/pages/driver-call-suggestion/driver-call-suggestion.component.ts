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
  }

  ngOnInit() {
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

  openDistanceprev(distObj) {
    this.common.params = { distObj, title: 'Distance Report' };
    const activeModal = this.modalService.open(DriverDistanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        //window.location.reload();
      }
    });
  }

  openDistance(vehid, vehicleRegNo) {
    this.common.loading++;
    let today = new Date();
    let strcurdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today.setDate(today.getDate() - 1);
    let stryesterday = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.api.post('Vehicles/getVehDistanceBwTime', { vehicleId: vehid, fromTime: stryesterday, tTime: strcurdate })
      .subscribe(res => {
        this.common.loading--;
        let data = res['data'];
        if (data > 0)
          this.distance = Math.round((data / 1000) * 100) / 100;
        this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
        this.common.params = {
          vehicleId: vehid,
          vehicleRegNo: vehicleRegNo,
          fromTime: stryesterday,
          toTime: strcurdate,
          title: "Distance: " + this.distance + " Kms"
        };
        const activeModal = this.modalService.open(RouteMapperComponent, {
          size: "lg",
          container: "nb-layout",
          windowClass: "myCustomModalClass"
        });
        activeModal.result.then(
          data => console.log("data", data)
          // this.reloadData()
        );
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
    /*
    if(typeof x_runhour == "string") {
      x_runhour = parseInt(x_runhour);
    }
    */
    //this.api.post('Drivers/getDriverCallSuggestion', {x_user_id: x_user_id, x_kmpd: x_kmpd, x_runhour: x_runhour })
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
        if (this.headings[j].toUpperCase() == "LAST 24HR KM") {
          let vid = this.driverData[i]['_vehicleid'];
          let vehicleRegNo = this.driverData[i]['Vehicle'];
          this.api.post('Vehicles/getVehDistanceBwTime', { vehicleId: vid, fromTime: this.stryesterday, tTime: this.strcurdate })
            .subscribe(resdist => {
              let distance = 0;
              if (resdist['data'] > 0) {
                distance = Math.round(resdist['data'] / 1000);
              }
              valobj[this.headings[j]] = { value: distance, class: 'blue', action: this.openDistance.bind(this, vid, vehicleRegNo) };
              console.log("valobj:" + j, valobj[this.headings[j]]);
            }, err => {
              this.common.loading--;
              console.log(err);
            });
        } else if (this.headings[j] == "Driver Name" || this.headings[j] == "Driver Mobile") {
          valobj[this.headings[j]] = { value: val, class: 'blue', action: this.openChangeDriverModal.bind(this, this.driverData[i]) };

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

  openChangeDriverModal(vehicleTrip) {
    console.log("vehicleTrip", vehicleTrip);
    this.common.params = { vehicleId: vehicleTrip._vehicleid, vehicleRegNo: vehicleTrip.Vehicle };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.respone);


    });
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

  getOnwardDelayData() {
    this.onwardDelayData = [];
    this.common.loading++;
    this.api.get('TripsOperation/tripOnwardDelay')
      .subscribe(res => {
        this.common.loading--;

        console.log("result", res['data'][0].fn_trips_onwarddelay);
        this.onwardDelayData = JSON.parse(res['data'][0].fn_trips_onwarddelay);
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
        this.valobj2[this.headings[j]] = { value: this.onwardDelayData[i][this.headings[j]], class: 'black', action: '' };
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
        this.delayFaults = JSON.parse(res['data'][0].fn_placements_getfaults);
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
        if (this.headings[j] == "endpt") {
          console.log("headings[j]", this.headings[j]);
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openPlacementModal.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "%Dist") {
          console.log("headings[j]", this.headings[j]);
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.openRouteMapper.bind(this, this.delayFaults[i]) };
        }
        else if (this.headings[j] == "vehicle") {
          console.log("headings[j]", this.headings[j]);
          this.valobj3[this.headings[j]] = { value: this.delayFaults[i][this.headings[j]], class: 'blue', action: this.addShortTarget.bind(this, this.delayFaults[i]) };
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



  openPlacementModal(placement) {
    console.log("openPlacementModal", placement);
    let tripDetails = {
      vehicleId: placement._vid,
      siteId: placement._site_id ? placement._site_id : -1
    }
    this.common.params = { tripDetils: tripDetails, ref_page: 'placements' };
    console.log("vehicleTrip", tripDetails);
    const activeModal = this.modalService.open(VehicleTripUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      //console.log("data", data.respone);

    });
  }

  openRouteMapper(defaultFault) {
    console.log("defaultFault", defaultFault);
    let fromTime = this.common.dateFormatter(defaultFault._start_time);
    let toTime = this.common.dateFormatter(new Date());
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: defaultFault._vid,
      vehicleRegNo: defaultFault.vehicle,
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
  addShortTarget(target) {
    this.common.params = {
      vehicleId: target._vid,
      vehicleRegNo: target.vehicle

    };

    const activeModal = this.modalService.open(AddShortTargetComponent, {
      size: "sm",
      container: "nb-layout"
    });
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
        this.shortTarget = JSON.parse(res['data'][0].result);
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

        this.valobj4[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'black', action: '' };


      }
      this.valobj4['style'] = { background: this.shortTarget[i]._rowcolor };
      columns.push(this.valobj4);
    }

    console.log('Columns:', columns);
    return columns;
  }
}




