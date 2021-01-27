import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormDataTableComponent } from '../form-data-table/form-data-table.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ngx-ticket-form-field',
  templateUrl: './ticket-form-field.component.html',
  styleUrls: ['./ticket-form-field.component.scss']
})
export class TicketFormFieldComponent implements OnInit {
  title = 'Customer Issue Request';
  evenArray = [];
  oddArray = [];
  ticketFormFields;
  refId = null;
  refType = null;
  ticketId = null;
  requestId =null;
  info = null;
  isDisabled = false;
  priCatList = [];
  secCatList = [];
  typeList = [];
  attachmentFile = [{ name: null, file: null }];
  pageUrl = null;
  name=null;
  mobileNo=null;
  foName=null;

  constructor(public activeModal: NgbActiveModal,public common: CommonService, public api: ApiService, public modalService: NgbModal, public userService: UserService) { 
    // this.title = this.common.params.title ? this.common.params.title : 'Ticket Closing Form';
    console.log("TicketClosingFormComponent -> constructor -> common", common)
    // if (this.common.params && this.common.params.actionData) {
    //   this.ticketId = this.common.params.actionData.ticketId;
    //   this.refId = this.common.params.actionData.refId;
    //   this.refType = this.common.params.actionData.refType;
    //   this.isDisabled = (this.common.params.actionData.isDisabled) ? true : false;

    //   this.getTicketFormField();
    // }
    this.pageUrl = window.location.href;
    this.name=this.userService._details['name'];
    this.mobileNo=this.userService._details['mobile'];
    this.foName=this.userService._details['foName'];
    console.log("Page_Url:",this.pageUrl);
    this.getTicketProcessByTocken();
  }

  ngOnDestroy(){}
ngOnInit() {}

  getTicketProcessByTocken() {
    
    this.common.loading++;
    this.api.primePost('Ticket/getTicketProcessByToken',null).subscribe(res => {
      this.common.loading--;
      if (res['code']==1) {
        this.refId = res['data']['tp_id'];
        this.refType = 0; 
        if(this.refId){ 
          this.getTicketFormField()
          for (let i = 1; i <= 3; i++) {
            this.getCatListByType(this.refId, i)
          }
        }
      }else{
        // this.common.showError(res['msg']);
      }
    }, err => {
      this.common.showError();
      this.common.loading--;
      console.error('Api Error:', err);
    });
  }

  getTicketFormField() {
    const params = "refId=" + this.refId + "&refType=" + this.refType + "&ticketId=" + this.ticketId;
    console.log("params", params);
    this.common.loading++;
    this.api.primeGet('Ticket/getTicketFormFieldById?' + params).subscribe(res => {
      this.common.loading--;
      console.log("resss", res);
      if (res['data']) {
        this.ticketFormFields = res['data'];
        this.formatArray();
      }
    }, err => {
      this.common.showError();
      this.common.loading--;
      console.error('Api Error:', err);
    });
  }

  formatArray() {
    this.evenArray = [];
    this.oddArray = [];
    this.ticketFormFields.map(dd => {
      dd['r_is_disabled'] = false;
      if (dd.r_coltype == 'date') {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_coltype == 'checkbox') {
        dd.r_value = (dd.r_value == "true") ? true : false;
      }
      if (dd.r_fixedvalues) {
        dd.r_fixedvalues = dd.r_fixedvalues;
      }
      if(dd.r_coltitle == 'Page detail'){
        dd.r_value = this.pageUrl;
      }
      if(dd.r_coltitle == 'Contact Name'){
        dd.r_value=this.name;
      }
      if(dd.r_coltitle == 'Mobile No'){
        dd.r_value=this.mobileNo;
      }
      if(dd.r_coltitle == 'Company Name'){
        dd.r_value=this.foName;
      }
      if(['Page detail','Contact Name','Mobile No','Company Name'].includes(dd.r_coltitle)){
        dd['r_is_disabled'] = true;
      }
      if (dd.r_colorder && dd.r_colorder % 2 == 0) {
        this.evenArray.push(dd);
      } else {
        this.oddArray.push(dd);
      }
    });
    console.log("evenArray", this.evenArray);
    console.log("oddArray", this.oddArray);
  }

  dismiss(res,isContinue) {
    this.activeModal.close({ response: res,isContinue:isContinue });
  }

  saveFromDetail(isContinue) {
     let detailsTemp = this.evenArray.concat(this.oddArray);
    let details = detailsTemp.map(detail => {
      let copyDetails = Object.assign({"name":detail.r_coltitle,"inputType":detail.r_coltype,"value":detail.r_value,"url":detail.r_url,"doc_name":detail.r_doc_name,"param_child":detail._param_child});
      if (detail['r_coltype'] == 'date' && detail['r_value']) {
        copyDetails['value'] = this.common.dateFormatter(detail['r_value'],null,false);
      }
      return copyDetails;
    });

    const params = {
      info: JSON.stringify(details),
      refId: this.refId,
      refType: this.refType,
      ticketId: this.ticketId,
      requestId: null,
      priCat: null,
      secCat: null,
      type: null,
      remark: null,
    }
    console.log("param......", params);
    this.common.loading++;
    this.api.primePost('Ticket/addTicket', params,"I").subscribe(res => {
        this.common.loading--;
        if (res['code'] == 1) {
            this.common.showToast(res['msg']);
            this.dismiss(true,true);
        } else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
        console.error('Api Error:', err);
      });
  }

  AdditionalForm(arraytype, i) {
    let additionalData = null;
    if (arraytype === 'oddArray') {
      additionalData = this.oddArray[i]._param_child;
    } else if (arraytype === 'evenArray') {
      additionalData = this.evenArray[i]._param_child;
    }
    console.log(additionalData, 'final data');
    this.common.params = { additionalform: (additionalData && additionalData.length > 0) ? additionalData : null };
    const activeModal = this.modalService.open(FormDataTableComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        console.log(data.data, 'response')
        if (data.data) {
          if (arraytype === 'oddArray') {
            this.oddArray[i]._param_child = data.data;
          } else if (arraytype === 'evenArray') {
            this.evenArray[i]._param_child = data.data;
          }
        }
      }
    });
  }

  getCatListByType(process_id, type) {
    this.priCatList = [];
    this.secCatList = [];
    this.typeList = [];
    let param = `tpId=${process_id}&type=${type}`
    this.common.loading++;
    this.api.primeGet("Ticket/getTicketProcessCatByType?" + param).subscribe(res => {
      this.common.loading--;
      if (type == 1) {
        let priCatList = res['data'];
        this.priCatList = priCatList.map(x => { return { id: x._id, name: x.name } });
      } else if (type == 2) {
        let secCatList = res['data'];
        this.secCatList = secCatList.map(x => { return { id: x._id, name: x.name } });
      } else {
        let typeList = res['data'];
        this.typeList = typeList.map(x => { return { id: x._id, name: x.name } });
      }
    }, err => {
      this.common.loading--;
      this.common.showError();
      console.log('Error: ', err);
    });
  }

  
  handleFileSelection(event, i) {
    this.common.handleFileSelection(event,null).then(res=>{
      console.log("handleFileSelection:",res);
      this.attachmentFile[i]= { name: res['name'], file: res['file'] };
    },err=>{
      this.common.showError();
    });
  }

  uploadattachFile(arrayType, i) {
    if (!this.attachmentFile[i] || !this.attachmentFile[i].file) {
      this.common.showError("Browse a file first");
      return false;
    }
    let refId = null;
    if (arrayType == 'oddArray') {
      refId = this.oddArray[i].r_colid;
    } else {
      refId = this.evenArray[i].r_colid;
    }
    let params = {
      refId: (refId > 0) ? refId : null,
      name: this.attachmentFile[i].name,
      attachment: this.attachmentFile[i].file
    }
    this.common.loading++;
    this.api.primePost('Ticket/uploadAttachment', params).subscribe(res => {
      this.common.loading--;
      if (res['code'] == 1) {
        if (res['data'][0]['r_id'] > 0) {
          this.common.showToast(res['msg']);
          this.attachmentFile[i].name = null;
          this.attachmentFile[i].file = null;
          if (arrayType == 'oddArray') {
            this.oddArray[i].r_value = res['data'][0]['r_id'];
          } else {
            this.evenArray[i].r_value = res['data'][0]['r_id'];
          }
        } else {
          this.common.showError(res['msg']);
        }
      } else {
        this.common.showError(res['msg']);
      }
      console.log("evenArray:::", this.evenArray[i]);
      console.log("oddArray:::", this.oddArray[i]);
    }, err => {
      this.common.loading--;
      this.common.showError();
      console.error('Api Error:', err);
    });
  }

}
