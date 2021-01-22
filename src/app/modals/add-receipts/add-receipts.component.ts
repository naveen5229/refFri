import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-receipts',
  templateUrl: './add-receipts.component.html',
  styleUrls: ['./add-receipts.component.scss']
})
export class AddReceiptsComponent implements OnInit {

  Recep={
    material:null
  }
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal

  ) { }

  ngOnDestroy(){}
ngOnInit() {
  }

  saveReceipts() {
    
    if(this.Recep.material==null || this.Recep.material=='')
    {
      this.common.showToast("Please input Material.");
      return;
    }
    //this.submitted = true;
    let params = {
      material: this.Recep.material
    };
    console.log("Receipts_Material:",this.Recep.material);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/addMateria', params)
    
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.common.showToast(res['msg']);
        this.activeModal.close();

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

  closeModal()
  {
    this.activeModal.dismiss({ex: 'Modal has been closed'});
  }

}
