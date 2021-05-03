import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'error-coomon-vehicles',
  templateUrl: './error-coomon-vehicles.component.html',
  styleUrls: ['./error-coomon-vehicles.component.scss']
})
export class ErrorCoomonVehiclesComponent implements OnInit {
  vehicles = [];
  title = '';
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.vehicles = this.common.params.errorData;
    this.title = this.common.params.title;
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

}
