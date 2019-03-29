import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLorryDetailsComponent } from '../../modals/edit-lorry-details/edit-lorry-details.component';

@Component({
  selector: 'lorry-receipt-details',
  templateUrl: './lorry-receipt-details.component.html',
  styleUrls: ['./lorry-receipt-details.component.scss', '../../pages/pages.component.css']
})
export class LorryReceiptDetailsComponent implements OnInit {
  pendinglr = [];

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getPendingLr();
  }

  ngOnInit() {
  }

  getPendingLr() {
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getPendingLr', {})
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.pendinglr = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  openEditLorryDetailsModel(details) {
    this.common.params = { details };
    const activeModel = this.modalService.open(EditLorryDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    this.common.handleModalSize('class', 'modal-lg', '1000');
    activeModel.result.then(data =>{
      if(!data.status){
       this.exitTicket(details);
       if(data.isDelete){
       this.getPendingLr();
       }
      }
    });
  }

  enterTicket(details) {
    let result;
    let params = {
      tblRefId: 6,
      tblRowId: details.id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/insertTicketActivity', params)
      .subscribe(res => {
        this.common.loading--;
        result = res;
        console.log(result);
        if (!result['success']) {
          //alert(result.msg);
          return false;
        }
        else {
          this.openEditLorryDetailsModel(details);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  exitTicket(details) {
    let result;
    var params = {
      tblRefId: 6,
      tblRowId: details.id
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('TicketActivityManagment/updateActivityEndTime', params)
      .subscribe(res => {
        this.common.loading--;
        result = res
        console.log(result);
        if (!result.sucess) {
         // alert(result.msg);
          return false;
        }
        else {
          return true;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

  

}