import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'generic-input-type',
  templateUrl: './generic-input-type.component.html',
  styleUrls: ['./generic-input-type.component.scss']
})
export class GenericInputTypeComponent implements OnInit {
title='';
  mobile = null;
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api:ApiService
  ) {
    this.common.handleModalSize('class', 'modal-lg', '650');
    console.log("param", this.common.params);
    console.log("mobile 123", this.mobile);
    this.getMobile()
  }

  ngOnInit() {
  }

  closeModal(){
    this.activeModal.close();

  }

  getMobile(){
    this.common.loading++;
    this.api.get('FinanceRecovery/getCompanyContacts').subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.mobile=res['data']
        this.mobile=this.mobile[0].MobileNo
        this.common.showToast(res['msg']);
      }, 
      err => {
        this.common.loading--;
        this.common.showError();
       } );
  }

  
    }