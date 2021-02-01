import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'pump-wise-fuel-filling',
  templateUrl: './pump-wise-fuel-filling.component.html',
  styleUrls: ['./pump-wise-fuel-filling.component.scss']
})
export class PumpWiseFuelFillingComponent implements OnInit {

  value1 = [];
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    //  private zone: NgZone,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {
    //this.getreport();
    // this.data = this.common.params;
    // console.log('yash', this.common.params);

    this.value1 = this.common.params;
    if (this.value1 == null) {
      this.value1 = [];
      this.table = null;
    }


    this.table = this.setTable();

    //this.setTable();
    //this.getTableColumns();

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }
  setTable() {
    let headings = {
      name: { title: 'name', placeholder: 'name' },
      fuel_station_id: { title: 'fuel station id', placeholder: 'fuel station id' },
      site_id: { title: 'site id', placeholder: 'site id' },
      location: { title: 'location', placeholder: 'location' },
      total: { title: 'total', placeholder: 'total' },
      start_time: { title: 'start time', placeholder: 'start time' },
      end_time: { title: 'end time', placeholder: 'end time' },
      notisfull: { title: 'notisFull', placeholder: 'notisFull' },
      notfse: { title: 'notfse', placeholder: 'notfse' },
      isfullfse: { title: 'eligible Entry', placeholder: 'eligible Entry' },


    };
    return {
      value1: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.value1.map(req => {
      let column = {
        name: { value: req.name },
        fuel_station_id: { value: req.fuel_station_id },
        site_id: { value: req.site_id == null ? "-" : req.site_id },
        location: { value: req.location == null ? "-" : req.location },
        total: { value: req.total == null ? "-" : req.total },
        start_time: { value: req.start_time == null ? "-" : this.common.changeDateformat(req.start_time) },
        end_time: { value: req.end_time == null ? "-" : this.common.changeDateformat(req.end_time) },
        notisfull: { value: req.notisfull == null ? "-" : req.notisfull },
        notfse: { value: req.notfse == null ? "-" : req.notfse },
        isfullfse: { value: req.isfullfse == null ? "-" : req.isfullfse },



      };
      columns.push(column);
    });
    return columns;
  }


}
