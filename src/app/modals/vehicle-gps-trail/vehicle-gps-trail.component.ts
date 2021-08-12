import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-gps-trail',
  templateUrl: './vehicle-gps-trail.component.html',
  styleUrls: ['./vehicle-gps-trail.component.scss', '../../pages/pages.component.css']
})
export class VehicleGpsTrailComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  vId = null;
  vehicleNo = null
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
  newGpsTrail = [];
  showHaltTable:boolean = false;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    console.log("common params", this.common.params.vehicleData);
    if (this.common.params && this.common.params.vehicleData) {
      this.startDate = new Date(this.common.params.vehicleData.startDate);
      this.endDate = new Date(this.common.params.vehicleData.endDate);
      this.vId = this.common.params.vehicleData.vehicleId;
      this.vehicleNo = this.common.params.vehicleData.vehicleRegNo;
      setTimeout(() => {
        this.result(1);
      }, 2000);
    }
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  searchVehicle(vehicleList) {
    this.vId = vehicleList.id;
  }


  result(button) {

    let startDate = this.common.dateFormatter(this.startDate);
    let endDate = this.common.dateFormatter(this.endDate);
    if (startDate > endDate) {
      this.common.showError("Entered Valid  Date");
      return;
    }

    let selectapi = '';
    let params = {
      vehicleId: this.vId,
      startTime: startDate,
      toTime: endDate
    };
    if (button == 1) {
      selectapi = 'VehicleTrail/getVehicleTrailAll';
    }
    else if (button == 2) {
      selectapi = 'VehicleTrail/showVehicleTrail';
    }
    else if (button == 3) {
      this.createHalts(params);
      return;
      // selectapi = 'AutoHalts/getSingleVehicleHalts';
    }
    console.log('params: ', params);
    this.common.loading++;
    this.api.post(selectapi, params)
      .subscribe(res => {
        this.common.loading--;
        this.showHaltTable = false;
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
        console.log('res: ', res['data']);
        this.gpsTrail = [];
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

  createHalts(params){
    this.common.loading ++;
    this.api.getJavaPortDost(8081, `halts?vehId=${params.vehicleId}&receivedStartTime=${params.startTime}&receivedEndTime=${params.toTime}` )
      .subscribe((res) => {
        this.common.loading --;
        this.showHaltTable = true;
        console.log('halts is: ', res);
        console.log('res: ', res['generatedHalts']);
        this.newGpsTrail = res['generatedHalts'];
        
      }, err => {
        this.common.loading --;
        console.log('err is: ', err)
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
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }
}
