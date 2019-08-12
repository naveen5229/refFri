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
  bgc = [];
  update = false;

  constructor(
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    console.log('fuelentries....', this.common.params);
    this.getDetails();
  }

  ngOnInit() {
  }


  getDetails() {
    console.log(this.common.params);
    let params = {
      vehId: this.common.params.vehicle_id ? this.common.params.vehicle_id : null,
      lastFilling: this.common.params.startdate ? this.common.params.startdate : null,
      currentFilling: this.common.params.enddate ? this.common.params.enddate : this.common.dateFormatter(new Date())
    }
    console.log('params', params);
    this.common.loading++;
    this.api.post('FuelDetails/getFillingsBwTime', params)
      .subscribe(res => {
        this.common.loading--;
       // console.log(res);
        this.fuelDetails = res['data'] || [];
        this.fuelDetails.forEach((element) => {
          if (element.is_last_filling) {
            this.bgc.push(true);
          } else {
            this.bgc.push(false);
          }

          console.log('bgc: ', this.bgc);


        });

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
      vid: this.common.params.vehicle_id,
      startTime: this.common.params.startdate,
      endTime: this.common.params.enddate
    };
    this.common.loading++;
    this.api.post('FuelDetails/changeFullFillingStatusV1', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        if (res['success']) {
          this.common.loading++;
          let params = {

          };
          this.api.post('FuelDetails/getEmptyFuelAvgEntry', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res', res['data']);
              this.common.showToast(res['msg']);
              this.update = true;
              //console.log("fuelDetails", this.fuelDetails);
              this.closeModal();
            }, err => {
              this.common.loading--;
              this.common.showError();
            })
        }
        //this.common.showToast(res['msg']);

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal() {
    if (this.update)
      this.activeModal.close({ update: this.update });
    else
      this.activeModal.close();
  }
}
