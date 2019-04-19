import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLorryDetailsComponent } from '../../modals/edit-lorry-details/edit-lorry-details.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'lorry-receipt-details',
  templateUrl: './lorry-receipt-details.component.html',
  styleUrls: ['./lorry-receipt-details.component.scss', '../../pages/pages.component.css']
})
export class LorryReceiptDetailsComponent implements OnInit {
  pendinglr = [];
  fromDate='';
  endDate = '';

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      let today;
      today = new Date();
      this.endDate = this.common.dateFormatter(today);
      this.fromDate=this.common.dateFormatter(new Date(today.setDate(today.getDate() - 6)));
      console.log('dates start and end',this.endDate,this.fromDate);
    this.getPendingLr();
  }

  ngOnInit() {
  }

  getPendingLr() {
   
    let params={
      startDate:this.fromDate,
      endDate:this.endDate
    };
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/getPendingLr', params)
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
    this.common.params = { details: Object.assign({}, details) };
    const activeModel = this.modalService.open(EditLorryDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    this.common.handleModalSize('class', 'modal-lg', '1000');
    activeModel.result.then(data => {
      // if(!data.status){
      //  this.exitTicket(details);
       if(data.isUpdated){
        this.exitTicket(details);
       this.getPendingLr();
       }
     // }
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

  getDate(type) {

    this.common.params={ref_page:'lrDetails'};
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start'){
          this.fromDate='';
          this.fromDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('fromDate',this.fromDate);
        }
        else{
          this.endDate='';
          this.endDate = this.common.dateFormatter(data.date).split(' ')[0];
          console.log('endDate',this.endDate);
        }

      }

    });


  }


  revertLrDetails(details){

    let params={
      lr_id:details.id
    };
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/revertLrDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        this.common.showToast(res['msg']);
        if(res['msg']=="Success"){
          this.getPendingLr();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
    
  }



}