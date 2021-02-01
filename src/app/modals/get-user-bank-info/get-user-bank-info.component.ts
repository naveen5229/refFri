import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { Api2Service } from '../../services/api2.service';
import { ApiService } from '../../services/api.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'get-user-bank-info',
  templateUrl: './get-user-bank-info.component.html',
  styleUrls: ['./get-user-bank-info.component.scss']
})
export class GetUserBankInfoComponent implements OnInit {
foid = null;
type = null;
bankData= null;
selected = null;
bankId = -1;
fuelId=-1;
userName = null;
bankView=null;
userName2 = null;
password = null;
bankInfo=null;
showPass = 0;
data = null;
table = {
  data: {
    headings: {},
    columns: []
  },
  settings: {
    hideHeader: true
  }
};
headings = [];
valobj = {};
fuelInfo=null;
fuelData=null;
  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1500');
    this.getBankName();
    this.getFuelName();
    console.log("Bank data-->",this.bankData);
   }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  selectFoUser(user) {
    console.log("user", user);
    this.foid = user.id;
  }
  getBankName() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=61')
      .subscribe(res => {
        this.common.loading--;
        this.bankData = res['data'];
        console.log('type', this.bankData);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  getFuelName() {
    this.common.loading++;
    this.api.get('Suggestion/getTypeMaster?typeId=65')
      .subscribe(res => {
        this.common.loading--;
        this.fuelData = res['data'];
        console.log('type', this.fuelData);
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  saveUserDetails(){
    console.log("response type----->",this.type)
    if(this.type == 'bank'){
      let params = {
        foid : this.foid,
        username: this.userName,
        typeid: this.bankId,
        password: this.password,
        username2 : this.userName2,
        type : 'bank'
      };
      console.log("params->",params);
      this.common.loading++;
      this.api.post('FoBankTransactions/saveUserCrediantials', params)
      .subscribe(res => {
        this.common.loading--;
        this.bankInfo = res['data'];
        console.log("bank info-->",this.bankInfo);
        if (this.bankInfo[0]['y_id'] > 0){
          this.common.showToast(this.bankInfo[0]['y_msg'])
          this.viewFoDetails();
          this.resetDetails();
  
        }
        else{
          this.common.showError(this.bankInfo[0]['y_msg'])
        }
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    }
    if (this.type == 'fuel'){
      let params = {
        foid : this.foid,
        username: this.userName,
        typeid: this.fuelId,
        password: this.password,
        username2 : this.userName2,
        type : 'fuel'
      };
      console.log("params->",params);
      this.common.loading++;
      this.api.post('FoBankTransactions/saveUserCrediantials', params)
      .subscribe(res => {
        this.common.loading--;
        this.fuelInfo = res['data'];
        console.log("fuel info-->",this.fuelInfo);
        if (this.fuelInfo[0]['y_id'] > 0){
          this.common.showToast(this.fuelInfo[0]['y_msg'])
          this.viewFoDetails();
          this.resetDetails();
  
        }
        else{
          this.common.showError(this.fuelInfo[0]['y_msg'])
        }
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    }

  }
  showPassword(type){
    if ( type ==0){
      this.showPass = 1;
    }
    else{
      this.showPass = 0;
    }
   
  }
  viewFoDetails(){
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.valobj = {};
    this.data=[];
    let params = {
      foid: this.foid
    };
    console.log("params->",params);
    this.common.loading++;
    this.api.post('FoBankTransactions/viewUserBankCrediantials', params)
    .subscribe(res => {
      this.common.loading--;
      this.data = res['data'];
      console.log("bank view-->",this.data);
      
    if (this.data == null) {
         this.data = [];
         this.table = null;
       }
       let first_rec = this.data[0];
       for (var key in first_rec) {
         if (key.charAt(0) != "_") {
           this.headings.push(key);
           let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
           this.table.data.headings[key] = headerObj;
         }
       }
       // this.showdoughnut();
       console.log("coloumns--.",this.getTableColumns());
       this.table.data.columns = this.getTableColumns();
    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        // console.log("Type", this.headings[i]);
        // console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "",  icons: [{ class: 'fas fa-trash-alt', action: this.clickDelete.bind(this, doc) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  resetDetails(){
    this.userName2 = null;
    this.password = null;
    this.userName = null;
    this.bankId = -1;
    this.type = null;
    this.selected = null;
  }
  deleteRow(doc){
    let params = {
      rowId : doc._id
    }
    console.log("params->",params);
    this.common.loading++;
    this.api.post('FoBankTransactions/deleteFoInfo', params)
    .subscribe(res => {
      this.common.loading--;
      this.data = res['data'];
      console.log("response",res);
      this.viewFoDetails();
    }, err => {
      this.common.loading--;
      console.log(err);
    });

  }
  clickDelete(doc) {
    if (confirm("Are you sure to delete ")) {
      this.deleteRow(doc);
    }
  }
  setRadio(type){
    if (type == 0){
      this.selected = 0;
      this.type = 'bank';
    }
    else{
      this.selected = 1;
      this.type = 'fuel';
    }
  }
}
