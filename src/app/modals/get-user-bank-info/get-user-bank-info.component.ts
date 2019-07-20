import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { Api2Service } from '../../services/api2.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'get-user-bank-info',
  templateUrl: './get-user-bank-info.component.html',
  styleUrls: ['./get-user-bank-info.component.scss']
})
export class GetUserBankInfoComponent implements OnInit {
foid = null;
bankData= null;
bankId = null;
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
  constructor(
    public activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1500');
    this.getBankName();
    console.log("Bank data-->",this.bankData);
   }

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
  saveUserDetails(){
    let params = {
      foid : this.foid,
      username: this.userName,
      bankid: this.bankId,
      password: this.password,
      username2 : this.userName2
    };
    console.log("params->",params);
    this.common.loading++;
    this.api.post('FoBankTransactions/saveUserBankCrediantials', params)
    .subscribe(res => {
      this.common.loading--;
      this.bankInfo = res['data'];
      console.log("bank info-->",this.bankInfo);
      if (this.bankInfo[0]['y_id'] > 0){
        this.common.showToast("Crediantial Has Inserted")
      }
      else{
        this.common.showToast("Error")
      }
    }, err => {
      this.common.loading--;
      console.log(err);
    });

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
          // this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-task', action: this.view.bind(this, doc.url) }, { class: 'fa fa-task', action: this.view.bind(this, doc.url) }] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }
}
