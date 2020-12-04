import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tollpaymentmanagement',
  templateUrl: './tollpaymentmanagement.component.html',
  styleUrls: ['./tollpaymentmanagement.component.scss']
})
export class TollpaymentmanagementComponent implements OnInit {

  startDate = null;
  endDate = null;
  vehicleId = null;
  vehicleRegNo = '';
  vehicleClass = [];
  vClass = '';
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {
      this.common.handleModalSize('class', 'modal-lg', '1200');
    let today = new Date();
    this.endDate = new Date(today);
    this.startDate = new Date(today.setDate(today.getDate() - 14))
    this.getVehicleClass();
  }

  // ngOnInit(): void {
  // }

  ngOnInit() {
  }

  searchVehicle(event) {
    this.vehicleId = event.id;
    this.vehicleRegNo = event.regno;
  }

  getVehicleClass() {
    this.api.get("Suggestion/getTypeMaster?typeId=14")
      .subscribe(res => {
        console.log('Vehicle Class:', res['data']);
        this.vehicleClass = res['data'] ? res['data'] : [];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  tollPayManagement(){
    let param={
      startDt:this.common.dateFormatter(this.startDate),
      endDt:this.common.dateFormatter(this.endDate),
      vid:this.vehicleId,
      vclass:this.vClass
    }
    console.log("data:",param);
  }

}
