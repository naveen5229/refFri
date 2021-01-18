import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DateService } from '../../services/date.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'odo-meter',
  templateUrl: './odo-meter.component.html',
  styleUrls: ['./odo-meter.component.scss', '../../pages/pages.component.css']
})
export class OdoMeterComponent implements OnInit {

  regno = null;
  vehicleId = null;
  date = new Date();
  kM = null;
  d = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  endDate = new Date();

  data = [];
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
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal,
    public dateService: DateService) {
    this.vehicleId = this.common.params.vehicleId;
    this.regno = this.common.params.regno;

    this.getOdoMeterData();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  saveOdoMaterData() {

    let params = {
      vehicleId: this.vehicleId,
      dateTime: this.common.dateFormatter(this.date),
      km: this.kM,
    };
    console.log("param:", params);

    this.common.loading++;
    this.api.post('Vehicles/saveOdoData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        if (res['data'][0]['r_id'] > 0) {
          this.common.showToast("Save SuccessFull");
          this.getOdoMeterData();
          this.getTableColumns();
        }
        else {
          let error = res['data'][0]['r_msg'];
          error = error.split(' \ "" ')[0];
          console.log("error", error);
          this.common.showError(error);
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


  getOdoMeterData() {
    this.data = [];
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
    this.valobj = {};
    const params = "vehicleId=" + this.vehicleId +
      "&startTime=" + this.common.dateFormatter(this.startDate) +
      "&endTime=" + this.common.dateFormatter(this.endDate);
    console.log("param:", params);
    this.common.loading++;
    this.api.get('Vehicles/showManualKmData?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
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

  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {

      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }



}
