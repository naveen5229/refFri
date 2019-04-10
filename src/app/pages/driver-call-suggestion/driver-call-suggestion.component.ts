import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverDistanceComponent } from '../../modals/driver-distance/driver-distance.component';
import { RouteMapperComponent } from "../../modals/route-mapper/route-mapper.component";

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
  stryesterday= '';
  
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
      this.strcurdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      today.setDate(today.getDate() - 1);
      this.stryesterday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.getReport();
  }

  ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  fetchReport() {
    //if((this.kmpdval == undefined || !this.kmpdval) || (this.runhourval == undefined || !this.runhourval)) {
    if(this.kmpdval == undefined || !this.kmpdval) {
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
    let strcurdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    today.setDate(today.getDate() - 1);
    let stryesterday = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.api.post('Vehicles/getVehDistanceBwTime', {vehicleId: vehid, fromTime : stryesterday, tTime : strcurdate})
      .subscribe(res => {
        this.common.loading--;
        let data = res['data'];
        if(data > 0)
          this.distance = Math.round((data/1000) * 100)/100;
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
    if(this.kmpdval == 0 || this.kmpdval == undefined) {
      x_kmpd = null;
    } else {
      x_kmpd = this.kmpdval;
    }
    if(this.runhourval == 0 || this.runhourval == undefined) {
      x_runhour = null;
    } else {
      x_runhour = this.runhourval;
    }
    let x_user_id = this.user._details.id;
    if(this.user._loggedInBy == "admin") {
      x_user_id = this.user._customer.id;
    }
    if(typeof x_kmpd == "string") {
      x_kmpd = parseInt(x_kmpd);
    }
    /*
    if(typeof x_runhour == "string") {
      x_runhour = parseInt(x_runhour);
    }
    */
    //this.api.post('Drivers/getDriverCallSuggestion', {x_user_id: x_user_id, x_kmpd: x_kmpd, x_runhour: x_runhour })
    this.api.post('Drivers/getDriverCallSuggestion', {x_user_id: x_user_id, x_kmpd: x_kmpd })
      .subscribe(res => {
        this.common.loading--;
        this.resetDisplayTable();
        this.driverData = res['data'];
        if(this.driverData == null || res['data'] == null) {
          console.log("resetting table");
          this.driverData = [];
          this.resetDisplayTable();
        }
        console.info("driver Data", this.driverData);
        let first_rec = this.driverData[0];
        this.table.data.headings = {};
        for(var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = {title: this.formatTitle(key), placeholder: this.formatTitle(key)};
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
    
    for(let i=0; i<this.driverData.length; i++) {
      let valobj = {};
      for(let j=0; j<this.headings.length; j++) {
        let val = this.driverData[i][this.headings[j]];        
        if(this.headings[j].toUpperCase() == "LAST 24HR KM") {
          let vid = this.driverData[i]['_vehicleid'];
          let vehicleRegNo = this.driverData[i]['Vehicle'];
          this.api.post('Vehicles/getVehDistanceBwTime', {vehicleId: vid, fromTime : this.stryesterday, tTime : this.strcurdate})
            .subscribe(resdist => {
              let distance = 0;
              if(resdist['data'] > 0) {
                distance = Math.round(resdist['data']/1000); 
              }
              valobj[this.headings[j]] = { value: distance, class: 'blue', action: this.openDistance.bind(this, vid, vehicleRegNo) };  
              console.log("valobj:" + j, valobj[this.headings[j]]);
            }, err => {
              this.common.loading--;
              console.log(err);
            });
        } else {
          valobj[this.headings[j]] = { value: val, class: 'black', action: '' };
        }
      }
      columns.push(valobj);
    }
    console.log("datalength:");
    console.log(this.driverData.length);
    return columns;
  }
}
