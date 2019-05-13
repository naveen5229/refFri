import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DateService } from '../../services/date.service';
@Component({
  selector: 'odo-meter',
  templateUrl: './odo-meter.component.html',
  styleUrls: ['./odo-meter.component.scss', '../../pages/pages.component.css']
})
export class OdoMeterComponent implements OnInit {

  regno = null;
  vehicleId = null;
  date = new Date();
  kM = null;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private modalService: NgbModal,
    public dateService: DateService) {
    this.vehicleId = this.common.params.vehicleId;
    this.regno = this.common.params.regno;

  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  saveOdoMaterData() {

    let params = {
      vehicleId: this.vehicleId,
      dateTime: this.common.dateFormatter(this.date),
      km: this.kM,
    };
    console.log("param:", params);

    this.common.loading++;
    this.api.post('Vehicles/saveOdoData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data'])
        if (res['data'][0]['r_id'] > 0) {
          this.common.showToast("Save SuccessFull");
        }
        else {
          let error = res['data'][0]['r_msg'];
          error = error.split(' \ "" ')[0];
          console.log("error", error);
          this.common.showError(error);
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }


}
