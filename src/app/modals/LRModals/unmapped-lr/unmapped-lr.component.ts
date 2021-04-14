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
  selector: 'unmapped-lr',
  templateUrl: './unmapped-lr.component.html',
  styleUrls: ['./unmapped-lr.component.scss']
})
export class UnmappedLrComponent implements OnInit {
  value1 = null;
  table = null;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal
  ) {
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
  // getDate(date) {
  //   this.common.params = { ref_page: "card usage" };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.dates);
  //   });
  // }
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
        action: {
          value: '', isHTML: false, action: null, icons: [
            { class: 'unmaped_table_icon fa fa-tasks', action: this.view.bind(this, req.lr_date, req.vehicle_id, req.lr_image) },
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

  view(date, id, url) {
    let start = '';
    let end = '';
    start = this.common.dateFormatter1(new Date(new Date(date).setDate(new Date(date).getDate() - 4)));
    end = this.common.dateFormatter1(new Date(new Date(date).setDate(new Date(date).getDate() + 4)));
    let params = {
      vehicle_id: id,
      latch_time: start,
      tTime: end
    }
    this.common.params = params;
    const activeModal = this.modalService.open(ChangeVehicleStatusComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "changeVehicle" });


    let images = [{
      name: "LR",
      image: url
    }]
    this.common.params = { images, title: 'LR Image' };
    const activeModal2 = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: "lrModal" });

  }
  // getIcon(url) {

  //   let images = [{
  //     name: "LR",
  //     image: url
  //   }]
  //   this.common.params = { images, title: 'LR Image' };
  //   const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });

  // }

}
