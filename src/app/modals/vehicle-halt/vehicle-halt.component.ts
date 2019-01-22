import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

@Component({
  selector: 'vehicle-halt',
  templateUrl: './vehicle-halt.component.html',
  styleUrls: ['./vehicle-halt.component.scss']
})
export class VehicleHaltComponent implements OnInit {

  details = null;
  title = '';
  description = '';
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,){
    this.details = this.common.params;
    this.title = this.common.params.title;
    this.description = this.common.params.description;
  }

  ngOnInit() {
  }
  openModal(option) {
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout' });

  }

  // ngViewDidLoad() {
  //   console.log('ionViewDidLoad VehicleHaltPage');
  // }

  // openModal(option) {
  //   let modal = this.common.params.create('VehicleHaltConfirmPage', { option });
  //   modal.onDidDismiss(data => {
  //     if (data.response) {
  //       this.dismiss(true, { name: data.haltName, id: option.id });
  //     }
  //   });
  //   modal.present();
  // }

  dismiss(response, option) {
    this.activeModal.dismiss({
      response: response,
      option: option
    });
  }



}
