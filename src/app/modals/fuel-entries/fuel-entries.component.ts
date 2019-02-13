import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'fuel-entries',
  templateUrl: './fuel-entries.component.html',
  styleUrls: ['./fuel-entries.component.scss', '../../pages/pages.component.css']
})
export class FuelEntriesComponent implements OnInit {
  fuelDetails = null;

  constructor(
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal
  ) {
    this.getDetails();
  }

  ngOnInit() {
  }


  getDetails() {
    console.log(this.common.params);
    let params = {
      vehId: this.common.params.vehicle_id ? this.common.params.vehicle_id : null,
      lastFilling: this.common.params.last_filling_entry_time ? this.common.params.last_filling_entry_time : null,
      currentFilling: this.common.params.current_filling_entry_time ? this.common.params.current_filling_entry_time : null
    }
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        let data = [];
        this.fuelDetails = res['data'];
        console.log("fuelDetails", this.fuelDetails);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeFullDetail(fuelDetail) {
    console.log(fuelDetail);
    let params = {
      x_ff_id : fuelDetail.id,
      x_is_full : fuelDetail.is_full
    }
    this.common.loading++;
    this.api.post('FuelDetails/changeFullFillingStatus', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.common.showToast(res['msg']);
        console.log("fuelDetails", this.fuelDetails);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close();
  }
}
