import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeVehicleStatusComponent } from '../change-vehicle-status/change-vehicle-status.component';
import { ImageViewComponent } from '../image-view/image-view.component';
import { from } from 'rxjs';
import { FuelEditComponent } from '../modal-wise-fuel-avg/fuel-edit/fuel-edit.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'modal-wise-fuel-avg',
  templateUrl: './modal-wise-fuel-avg.component.html',
  styleUrls: ['./modal-wise-fuel-avg.component.scss']
})
export class ModalWiseFuelAvgComponent implements OnInit {
  value1 = null;
  table = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    // this.value1 = this.common.params;
    this.modalWiseFuel();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  modalWiseFuel() {
    this.common.loading++;
    this.api.get('Fuel/getModelWiseFuelAvg')
      .subscribe(res => {
        this.common.loading--;
        this.value1 = res['data'];
        if (this.value1 == null) {
          this.value1 = [];
          this.table = null;
        }
        this.table = this.setTable();
        console.log('res', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });

  }
  setTable() {
    let headings = {
      name: { title: 'name', placeholder: 'Name' },
      vehicle_model: { title: 'vehicle_model', placeholder: 'vehicle_model' },
      load_avg: { title: 'load_avg', placeholder: 'load_avg' },
      unload_avg: { title: 'unload_avg', placeholder: 'unload_avg' },
      count: { title: 'count', placeholder: 'count' },

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
        name: { value: req.name, action: this.edit.bind(this, req), style: "background : '#0000FF'" },
        vehicle_model: { value: req.vehicle_model },
        load_avg: { value: req.load_avg },
        unload_avg: { value: req.unload_avg == null ? "-" : req.unload_avg },
        count: { value: req.count == null ? "-" : req.count },
        // style: { background: req.name ? 'blue' : 1 }
      },
        rowActions: {
          click: 'selectRow'

        };
      columns.push(column);
    });
    return columns;
  }
  edit(req) {
    this.common.params = { req };

    const activeModal = this.modalService.open(FuelEditComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
      if (data.response) {
        console.log("Test");
        this.modalWiseFuel();
      }
    })

  }
}
