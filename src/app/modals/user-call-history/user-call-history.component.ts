import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../services/excel/excel.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'user-call-history',
  templateUrl: './user-call-history.component.html',
  styleUrls: ['./user-call-history.component.scss']
})
export class UserCallHistoryComponent implements OnInit {
  callHistory = [];
  headings = [];
callData = null;
  table = {
    data: {
      headings: {        
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private excelService: ExcelService,
    private activeModal : NgbActiveModal
  ) {
    this.callData = this.common.params.callData;
    console.log("call data",this.callData);
    this.getReport();
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

 

  getReport() {
    this.common.loading++;
    this.headings = [];
    let params = {
      vehicleId :this.callData.vehicleId,
      foAdminUserId : this.callData.foAdminUserId,
      currentDay : this.callData.currentDay,
      nextDay : this.callData.nextDay,
      type : this.callData.type
    };

    console.log("params",params);
    this.api.post('FoDetails/userCallHistoryLogs',params)
      .subscribe(res => {
        this.common.loading--;
        this.resetDisplayTable();
        this.callHistory = JSON.parse(res['data'][0].get_callslog_hist);
        if(this.callHistory == null || res['data'] == null) {
          console.log("callHistory",this.callHistory);
          this.callHistory = [];
          this.resetDisplayTable();
        }
        console.info("callHistory Data", this.callHistory);

        let first_rec = this.callHistory[0];
        this.table.data.headings = {};
        console.log("first_rec",first_rec);
        for(var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = {title: this.formatTitle(key), placeholder: this.formatTitle(key)};
            this.table.data.headings[key] = hdgobj;
          }
        }
        console.log("this.headings",this.headings);

     

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetDisplayTable() {
    this.table = {
      data: {
        headings: {        
        },
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }

  getTableColumns() {
    let columns = [];
    this.callHistory.map(drvrec => {
      let valobj = {};
      for(var i = 0; i < this.headings.length; i++) {
        let val = drvrec[this.headings[i]];
        let status = '';
        
        valobj[this.headings[i]] = { value: val, class: 'black', action: '' };       

      }
     
      columns.push(valobj);     
    });
    return columns;
  }

  closeModal() {
    this.activeModal.close();
  }

  generateExcel() {
    let foName =   this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let headerDetails=[];
    headerDetails=[
        {sDate:''},
        {eDate:''},
        {name:foName}
    ]
    let headersArray = ["Vehicle Name", "Name", "Category", "Mobile No", "Call Type", "Call Time", "Call Duration (seconds)"];
    let json = this.callHistory.map(calhistory => {
      return {
        "Vehicle Name": calhistory['Vehicle Name'],
        "Name":calhistory['Name'],
        "Category": calhistory['Category'],
        "Mobile No": calhistory['Mobile No'],
        "Call Type": calhistory['Call Type'],
        "Call Time": calhistory['Call Time'],
        "Call Duration (seconds)": calhistory['Call Duration (seconds)'],
      };
    });
    this.excelService.jrxExcel("User Call History",headerDetails,headersArray, json, 'User Call History', false);
  }
  

}
