import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeService } from '@nebular/theme';
import { DatePipe, NumberFormatStyle } from '@angular/common';

@Component({
  selector: 'vehicle-gps-trail',
  templateUrl: './vehicle-gps-trail.component.html',
  styleUrls: ['./vehicle-gps-trail.component.scss', '../../pages/pages.component.css']
})
export class VehicleGpsTrailComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  vId = '';
  gpsTrail = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(public api: ApiService, public common: CommonService,
    private theme: NbThemeService,
    public user: UserService,
    public datepipe: DatePipe,
    public modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);
    // let today;
    // today = new Date();
    // this.endDate = this.common.dateFormatter(today);
    // this.startDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)));
    // console.log('dates ', this.endDate, this.startDate);
  }

  ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }

  searchVehicle(vehicleList) {
    this.vId = vehicleList.id;
  }



  result(button) {
    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    let selectapi = '';
    let params = {
      vehicleId: this.vId,
      startTime: startDate,
      toTime: endDate
    };
    switch (button) {
      case 1: selectapi = 'VehicleTrail/getVehicleTrailAll';
        break;

      case 2: selectapi = 'VehicleTrail/showVehicleTrail';
        break;
      case 3: selectapi = 'AutoHalts/getSingleVehicleHalts';
        break;

      default:
        break;
    }
    // if (button == 1) {
    //   selectapi = 'VehicleTrail/getVehicleTrailAll';
    // }
    // else if (button == 2) {
    //   selectapi = 'VehicleTrail/showVehicleTrail';
    // }
    // else if (button == 3) {
    //   selectapi = 'AutoHalts/getSingleVehicleHalts';
    // }
    console.log('params: ', params);
    this.common.loading++;
    this.api.post(selectapi, params)
      .subscribe(res => {
        this.common.loading--;
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        console.log('res: ', res['data'])
        this.gpsTrail = res['data'];
        console.log('Length', res['data'].length);

        let first_rec = this.gpsTrail[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.gpsTrail);
    this.gpsTrail.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

}
