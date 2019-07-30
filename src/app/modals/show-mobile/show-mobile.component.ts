import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'show-mobile',
  templateUrl: './show-mobile.component.html',
  styleUrls: ['./show-mobile.component.scss']
})
export class ShowMobileComponent implements OnInit {

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



