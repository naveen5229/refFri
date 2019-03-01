import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLorryDetailsComponent } from '../../modals/edit-lorry-details/edit-lorry-details.component';

@Component({
  selector: 'lorry-receipt-details',
  templateUrl: './lorry-receipt-details.component.html',
  styleUrls: ['./lorry-receipt-details.component.scss','../../pages/pages.component.css']
})
export class LorryReceiptDetailsComponent implements OnInit {
   getpendinglr=[];
  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 
     this.getPendingLr();
    }

  ngOnInit() {
  }
  getPendingLr(){
   this.common.loading++;
   this.api.post('LorryReceiptsOperation/getPendingLr',"null")
           .subscribe(res =>{
             this.common.loading--;
             console.log('res: ',res['data']);
             this.getpendinglr=res['data'];
           }, err =>{
             this.common.loading--;
             this.common.showError();
           })
  }
  openEditLorryDetailsModel(details?){
    this.common.params={details};
    this.common.handleModalSize('class', 'modal-lg', '1000');
    const activeModel=this.modalService.open(EditLorryDetailsComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'})
     
  }

}