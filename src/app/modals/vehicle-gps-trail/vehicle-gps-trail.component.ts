import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
@Component({
  selector: 'vehicle-gps-trail',
  templateUrl: './vehicle-gps-trail.component.html',
  styleUrls: ['./vehicle-gps-trail.component.scss','../../pages/pages.component.css']
})
export class VehicleGpsTrailComponent implements OnInit {
  startDate = null;
  endDate = null;
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

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal) {
      console.log("common params", this.common.params);
    this.startDate = this.common.params.vehicleData.startDate;
    this.endDate = this.common.params.vehicleData.endDate;
    this.vId = this.common.params.vehicleData.vehicleId;
    this.vehicleNo = this.common.params.vehicleData.vehicleRegNo;
    this.result(1);
     }

  ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  searchVehicle(vehicleList) {
    this.vId = vehicleList.id;
  }

  getDate(type) {

    this.common.params = { ref_page: 'trip status feedback' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {

          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log("start date:", this.startDate);
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }

      }

    });
  }


  result(button) {
    this.startDate = this.common.dateFormatter(this.startDate);
    this.endDate = this.common.dateFormatter(this.endDate);
    let selectapi = '';
    let params = {
      vehicleId: this.vId,
      startTime: this.startDate,
      toTime: this.endDate
    };
    if (button == 1) {
      selectapi = 'VehicleTrail/getVehicleTrailAll';
    }
    else if (button == 2) {
      selectapi = 'VehicleTrail/showVehicleTrail';
    }
    else if (button == 3) {
      selectapi = 'AutoHalts/getSingleVehicleHalts';
    }
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
