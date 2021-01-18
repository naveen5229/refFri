import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'issue-report',
  templateUrl: './issue-report.component.html',
  styleUrls: ['./issue-report.component.scss']
})
export class IssueReportComponent implements OnInit {
  submitBtn = '';
  cancelBtn = '';
  newIssue={
    type:"",
    remark:null
  };
  vehicleId = null;
  cardUsageId = null ;
  imageData = null;
  issues = [{
    id:1,
    name:'Double Toll Reciept'
  },
  {
    id:2,
    name:'Double Toll Report'
  },
  {
    id:3,
    name:'Other Issue'
  }];
  cardUsage = null;
  constructor(public common: CommonService, public api: ApiService,
    private activeModal: NgbActiveModal) { 
      this.cardUsage = this.common.params.cardUsage;
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        //this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }
        this.imageData = res;

        console.log('Base 64: ', res);
        //this.compressImage(res, index);
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }


  saveIssues() {
    this.common.loading++;
    const params = {
      id:this.cardUsage.id ,
      vehid:this.cardUsage.vehId,
      remark:this.newIssue.remark,
      issueid:this.newIssue.type,
      image:this.imageData
    };
    console.log('DATA: ', params);
    const subURL = "DoubleTollApi/InsertDoubleTollRequest.json";
    this.api.walle8Post(subURL , params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['responsemessage']);
        this.common.showToast(res['responsemessage']);
        this.dismiss(true);
      }, err => {
        console.error('Error: ', err);
        this.common.loading--;
        this.common.showError();
        this.dismiss(true);

      });
  }

  dismiss(status) {
    
    this.activeModal.close({ status: status });
  }
}
