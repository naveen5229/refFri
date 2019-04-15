import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { StorerequisitionComponent } from '../../acounts-modals/storerequisition/storerequisition.component';

@Component({
  selector: 'storerequisitions',
  templateUrl: './storerequisitions.component.html',
  styleUrls: ['./storerequisitions.component.scss']
})
export class StorerequisitionsComponent implements OnInit {

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
      this.common.currentPage = 'Store Requisitions';
    }

  ngOnInit() {
  }



  openStoreRequisitions() {
      const activeModal = this.modalService.open(StorerequisitionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {

      });
    
  }
}
