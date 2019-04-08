import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'driver-call-suggestion',
  templateUrl: './driver-call-suggestion.component.html',
  styleUrls: ['./driver-call-suggestion.component.scss']
})
export class DriverCallSuggestionComponent implements OnInit {
  driverData = [];
  headings = [];
  kmpdval = 300;
  runhourval = 10;
  
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
  
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) { 
    this.getReport();
  }

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

  fetchReport() {
    if((this.kmpdval == undefined || !this.kmpdval) || (this.runhourval == undefined || !this.runhourval)) {
      this.common.showError("Please provided Kmpd and RunHour values");
      return false;
    }
    this.getReport();
  }

  getReport() {
    this.common.loading++;
    this.headings = [];
    let x_kmpd, x_runhour;
    if(this.kmpdval == 0 || this.kmpdval == undefined) {
      x_kmpd = null;
    } else {
      x_kmpd = this.kmpdval;
    }
    if(this.runhourval == 0 || this.runhourval == undefined) {
      x_runhour = null;
    } else {
      x_runhour = this.runhourval;
    }
    let x_user_id = this.user._details.id;
    if(typeof x_kmpd == "string") {
      x_kmpd = parseInt(x_kmpd);
    }
    if(typeof x_runhour == "string") {
      x_runhour = parseInt(x_runhour);
    }
    this.api.post('Drivers/getDriverCallSuggestion', {x_user_id: x_user_id, x_kmpd: x_kmpd, x_runhour: x_runhour })
      .subscribe(res => {
        this.common.loading--;
        this.resetDisplayTable();
        this.driverData = res['data'];
        if(this.driverData == null || res['data'] == null) {
          console.log("resetting table");
          this.driverData = [];
          this.resetDisplayTable();
        }
        console.info("driver Data", this.driverData);
        let first_rec = this.driverData[0];
        this.table.data.headings = {};
        for(var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = {title: this.formatTitle(key), placeholder: this.formatTitle(key)};
            this.table.data.headings[key] = hdgobj;
          }
        }
        console.log("hdgs:");
        console.log(this.headings);
        console.log(this.table.data.headings);

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
    this.driverData.map(drvrec => {
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
}
