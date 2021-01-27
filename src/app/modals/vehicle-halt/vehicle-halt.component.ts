import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { RemarkModalComponent } from '../remark-modal/remark-modal.component';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-halt',
  templateUrl: './vehicle-halt.component.html',
  styleUrls: ['./vehicle-halt.component.scss', '../../pages/pages.component.css']
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
    private activeModal: NgbActiveModal, ) {
    this.details = this.common.params;
    this.title = this.common.params.title;
    this.description = this.common.params.description;
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  confirmOption(option) {
    this.common.params = {
      title: this.title,
      description: `<p>You have selected <strong>${option.name}</strong> option. Confirm it.`
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout',backdrop: 'static'});
    activeModal.result.then(data => {
      if (data.response) {
        this.dismiss(true, option);
      }
    });
  }

  getReason(option) {
    this.common.params = {
      title: 'Halt Info ',
      Placeholder: 'Write Halt Name Here ............',
      label: 'Halt Name',
    };
    console.log(this.common.params);
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.dismiss(true, { name: data.remark, id: option.id });
      }
    });
  }

  dismiss(response, option?) {
    this.activeModal.close({
      response: response,
      option: option
    });
  }

}
