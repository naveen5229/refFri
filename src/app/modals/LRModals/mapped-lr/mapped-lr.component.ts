import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../../change-vehicle-status/change-vehicle-status.component';
import { ImageViewComponent } from '../../image-view/image-view.component';
import { from } from 'rxjs';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'mapped-lr',
  templateUrl: './mapped-lr.component.html',
  styleUrls: ['./mapped-lr.component.scss']
})
export class MappedLrComponent implements OnInit {
  value1 = null;
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.value1 = this.common.params;
    if (this.value1 == null) {
      this.value1 = [];
      this.table = null;
    }


    this.table = this.setTable();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  setTable() {
    let headings = {
      name: { title: 'name', placeholder: 'Name' },
      source: { title: 'source', placeholder: 'source' },
      destination: { title: 'destination', placeholder: 'destination' },
      regno: { title: 'regno', placeholder: 'regno' },
      lr_date: { title: 'lr_date', placeholder: 'lr_date' },
      addtime: { title: 'addtime', placeholder: 'addtime' },
      start_time: { title: 'start_time', placeholder: 'start_time' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
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
        source: { value: req.source },
        destination: { value: req.destination },
        regno: { value: req.regno == null ? "-" : req.regno },
        lr_date: { value: req.lr_date == null ? "-" : this.common.changeDateformat(req.lr_date) },
        addtime: { value: req.addtime == null ? "-" : this.common.changeDateformat(req.addtime) },
        start_time: { value: req.start_time },
        action: {
          value: '', isHTML: false, action: null, icons: [
            { class: 'unmaped_table_icon fa fa-tasks', action: this.view.bind(this, req.start_time, req.end_time, req.vehicle_id, req.lr_image) },


          ]
        },
        rowActions: {
          click: 'selectRow'
        }





      };
      columns.push(column);
    });
    return columns;
  }
  view(date, date1, id, url) {



    let start = '';
    let end = '';
    start = this.common.dateFormatter(new Date(new Date(date).setDate(new Date(date).getDate() - 1)));
    if (date1) {
      end = this.common.dateFormatter(new Date(new Date(date1).setDate(new Date(date1).getDate() + 1)));
    } else {

      end = this.common.dateFormatter(new Date(new Date(date).setDate(new Date(date).getDate() + 2)));
    }
    let params = {
      vehicle_id: id,
      latch_time: start,
      tTime: end
    }
    this.common.params = params;
    console.log('params', this.common.params);
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "changeVehicle" });


    let images = [{
      name: "LR",
      image: url
    }]
    this.common.params = { images, title: 'LR Image' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal", });

  }
}
