import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateService } from '../../services/date.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'driver-performance',
  templateUrl: './driver-performance.component.html',
  styleUrls: ['./driver-performance.component.scss', '../../pages/pages.component.css']
})
export class DriverPerformanceComponent implements OnInit {
  startDate = null;
  endDate = null;
  driverPerformance = [];
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
  click = false;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public dateService: DateService) {
    let today = new Date(), start = new Date();
    this.endDate = today;
    this.endDate = this.common.dateFormatter(today);
    start = new Date(today.setDate(today.getDate() - 7));
    this.startDate = this.common.dateFormatter(start);
    console.log("Start Date:", this.startDate);
    console.log("end Date:", this.endDate);

  }

  ngOnDestroy(){}
ngOnInit() {
  }


  getDate(type) {
    this.common.params = { ref_page: 'driver-performance' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          this.startDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
        }
        else {
          this.endDate = this.dateService.dateFormatter(data.date, '', false).split(' ')[0];
          console.log('endDate', this.endDate);
        }
      }
    });

  }

  getDriverPerformance() {
    // this.driverPerformance = [];
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
    this.driverPerformance = [];
    this.headings = [];
    this.valobj = {};
    const params = {
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(this.endDate.split(' ')[0])
    }
    this.click = true;
    const data = "startDate=" + params.startDate +
      "&endDate=" + params.endDate;
    this.common.loading++;
    this.api.get('Drivers/driverPerformance?' + data)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        if (res['data'] == null) {

          this.driverPerformance = [];
          // this.click=false;
          this.table = null;
          return;

        }
        this.driverPerformance = res['data'];

        console.log('tripstagesData', this.driverPerformance);
        let first_rec = this.driverPerformance[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
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
    for (var i = 0; i < this.driverPerformance.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        this.valobj[this.headings[j]] = { value: this.driverPerformance[i][this.headings[j]] };
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
