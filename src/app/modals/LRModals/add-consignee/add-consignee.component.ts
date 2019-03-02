import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-consignee',
  templateUrl: './add-consignee.component.html',
  styleUrls: ['./add-consignee.component.scss']
})
export class AddConsigneeComponent implements OnInit {
consignee={
  name:null,
  address:null,
  panNo:null,
  mobileNo:null

}

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  addConsignee() {
    let params = {
      pan:this.consignee.panNo,
      name:this.consignee.name,
      mobileNo:this.consignee.mobileNo,
     address:this.consignee.address

    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('LorryReceiptsOperation/InsertCompanies', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
}
