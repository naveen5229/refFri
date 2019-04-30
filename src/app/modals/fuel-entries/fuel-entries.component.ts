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
      lastFilling: this.common.params.startdate ? this.common.params.startdate : null,
      currentFilling: this.common.params.enddate ? this.common.params.enddate : null
    }
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
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
      x_ff_id: fuelDetail.id,
      x_is_full: fuelDetail.is_full ? 1 : 0,
    }
    this.common.loading++;
    this.api.post('FuelDetails/changeFullFillingStatus', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.common.showToast(res['msg']);
        console.log("fuelDetails", this.fuelDetails);
        this.closeModal();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    this.activeModal.close();
  }
}
