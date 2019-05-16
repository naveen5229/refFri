import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { AddFoComponent } from '../../modals/add-fo/add-fo.component';
import { PullHistoryGPSDataComponent } from '../../modals/pull-history-gps-data/pull-history-gps-data.component';


@Component({
  selector: 'vehicle-tyres',
  templateUrl: './vehicle-tyres.component.html',
  styleUrls: ['./vehicle-tyres.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class VehicleTyresComponent implements OnInit {
  refMode = "701";
  mappedTyres = [];
  vehicleTyres = [
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
    },
    {
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
    },
  ]
  vehicleNo = "";
  vehicleId = null;
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  getDate(index) {
    this.common.params = { ref_page: "Tyre Inputs" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.vehicleTyres[index].date = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.vehicleTyres[index].date);
    });
  }
  getTyreDetails(tyreDetails, index) {
    this.vehicleTyres[index].tyreId = tyreDetails.id;
    this.vehicleTyres[index].tyreNo = tyreDetails.tyrenum;
  }
  getvehicleData(vehicleDetails) {
    this.vehicleId = vehicleDetails.id;
    this.getMappedTyres();
  }
  resetVehDetails() {
    this.vehicleNo = "";
    this.vehicleId = null;
  }

  addMore() {
    this.vehicleTyres.push({
      tyreNo: null,
      tyreId: null,
      details: null,
      kms: null,
      date: (this.common.dateFormatter(new Date())).split(' ')[0],
    });
  }

  saveDetails() {
    if (!this.vehicleId) {
      this.common.showError("Please Select Vehicle");
    } else {
      this.common.loading++;
      let params = {
        vehicleId: this.vehicleId,
        refMode: this.refMode,
        vehicleTyres: JSON.stringify(this.vehicleTyres)
      };
      console.log('Params:', params);

      this.api.post('Tyres/saveTyreInputs', params)
        .subscribe(res => {
          this.common.loading--;
          console.log("return id ", res['data'][0].r_id);
          if (res['data'][0].r_id > 0) {
            console.log("sucess");
            this.common.showToast("sucess");
            this.getMappedTyres();
          } else {
            console.log("fail");
            this.common.showToast(res['data'][0].r_msg);
          }
        }, err => {
          this.common.loading--;
          console.error(err);
          this.common.showError();
        });
    }
  }

  getMappedTyres() {
    let params = 'vehicleId=' + this.vehicleId +
      '&refMode=' + this.refMode;
    console.log("params ", params);
    this.api.get('Tyres/getVehicleTyreDetails?' + params)
      .subscribe(res => {
        console.log("data===", res['data']);
        this.mappedTyres = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });

  }
  submitted1() {
    const activeModal = this.modalService.open(AddFoComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  submitted2() {
    const activeModal = this.modalService.open(PullHistoryGPSDataComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

}
