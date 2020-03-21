import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'vehicle-status',
  templateUrl: './vehicle-status.component.html',
  styleUrls: ['./vehicle-status.component.scss']
})
export class VehicleStatusComponent implements OnInit {
  vehicleId = null;
  data = [];
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
  ) { 
    this.common.handleModalSize('class', 'modal-lg', '400', 'px', 1);
    this.vehicleId = this.common.params && this.common.params.data ? this.common.params.data.vehicleId : null
    this.getVehicleStatus();
  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }


  getVehicleStatus(){
    this.common.loading++
    let params = "vId=" +this.vehicleId;
    this.api.get("Bidding/getVehicleBidStatus?"+params)
    .subscribe(res => {
      this.common.loading--;
      console.log('res[data]',res['data']);
      this.data = res['data'];
    }, err => {
      this.common.loading--;
      console.log(err);
    });

  }
}
