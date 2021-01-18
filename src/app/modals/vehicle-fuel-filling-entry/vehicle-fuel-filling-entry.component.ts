import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-fuel-filling-entry',
  templateUrl: './vehicle-fuel-filling-entry.component.html',
  styleUrls: ['./vehicle-fuel-filling-entry.component.scss']
})
export class VehicleFuelFillingEntryComponent implements OnInit {
  startDate;
  endDate;
  vid;
  showTable = false;
  table = null;
  vehicleFFE = [];
  constructor(public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    if (this.common.params.value) {
      this.vid = this.common.params.value.vehicle_id;
      this.startDate = this.common.params.value.start_time;
      this.endDate = this.common.params.value.end_time
    }

    this.getVehicleFFEntry();

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getVehicleFFEntry() {

    let params = {
      vehicle_id: this.vid,
      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate)
    };
    this.common.loading++;
    this.api.post('FuelDetails/getVehicleFFEWrtDate', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleFFE = res['data'];
        if (this.vehicleFFE != null) {
          this.showTable = true;
          this.table = this.setTable();
        } else {
          this.common.showToast('Record Not Found!!');
        }
        console.log('res', res['data']);


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  setTable() {
    let headings = {

      litre: { title: 'Litre', placeholder: 'Litre' },
      rate: { title: 'Rate', placeholder: 'Rate' },
      amount: { title: 'Amount ', placeholder: 'Amount' },
      Station: { title: 'Station', placeholder: 'Station' },

      //action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"

      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.vehicleFFE.map(res => {
      let column = {
        litre: { value: res.litres },
        rate: { value: res.rate },
        amount: { value: res.amount },
        Station: { value: res.station_name },


        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }

  closeModal() {
    this.activeModal.close();
  }

}
