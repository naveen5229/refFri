import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bulk-vehicle-next-service-detail',
  templateUrl: './bulk-vehicle-next-service-detail.component.html',
  styleUrls: ['./bulk-vehicle-next-service-detail.component.scss']
})
export class BulkVehicleNextServiceDetailComponent implements OnInit {
  serviceDatas = [];
  btntxt = 'Update';

  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.getNextServiceEntries()
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  getNextServiceEntries() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/vehiclesDetailView?')
      .subscribe(res => {
        this.common.loading--;
        this.serviceDatas = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  saveData() {
    this.common.loading++;
    let params = { NextServiceData: JSON.stringify(this.serviceDatas) };

    this.api.post('VehicleMaintenance/bulkUpdateNextServiceDetail', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast("Successfully added", 3000);

        } else
          this.common.showError(res['data'][0].y_msg);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
