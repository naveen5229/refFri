import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vehicle-trip-stages',
  templateUrl: './vehicle-trip-stages.component.html',
  styleUrls: ['./vehicle-trip-stages.component.scss', '../pages.component.css']
})
export class VehicleTripStagesComponent implements OnInit {

  vehicleId = null;
  startDate = '';
  endDate = '';
  tripstagesData = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      tableHeight: '75vh'
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {

    let today = new Date();
    this.endDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.startDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)))).split(' ')[0];
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.vehicleId = null;
    this.gettripStages();
  }
  getDate(type) {
    this.common.params = { ref_page: 'vehicle trip stages' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.startDate);
        }
        else {
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.vehicleId = vehicle.id;

  }

  gettripStages() {
    this.tripstagesData = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        tableHeight: '75vh',
      }
    };

    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    const params = {
      vehicleId: this.vehicleId ? this.vehicleId : -1,
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(enddate.setDate(enddate.getDate() + 1)).split(' ')[0],
    }

    console.log("params:", params);
    const data = "startDate=" + params.startDate +
      "&endDate=" + params.endDate + "&vehicleId=" + params.vehicleId;
    this.common.loading++;

    this.api.get('TripsOperation/vehicleDynTripSummary?' + data)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        this.tripstagesData = res['data'];
        console.log('tripstagesData', this.tripstagesData);
        let first_rec = this.tripstagesData[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }

        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);


      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.tripstagesData.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        j
        this.valobj[this.headings[j]] = { value: this.tripstagesData[i][this.headings[j]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }






}
