import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'user-call-summary',
  templateUrl: './user-call-summary.component.html',
  styleUrls: ['./user-call-summary.component.scss']
})
export class UserCallSummaryComponent implements OnInit {
  fromDate = '';
  endDate = '';
  title = '';
  data = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
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
      //this.fromDate = new Date().toISOString().slice(0,10);
      //this.endDate = new Date().toISOString().slice(0,10) + ' 23:59:00';
      console.log(this.fromDate);
      console.log(this.endDate);
    }

  ngOnInit() {
  }

  getDate(date) {
    this.common.params = {ref_page :'user-call-summary'};
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        console.log("data date:");
        console.log(data.date);
        if(date == 'startdate') {
          this.fromDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.fromDate);
        } else {
          this.endDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.endDate);
        }
      }
    });
  }

  getCallSummary() {
    this.common.loading++;
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //let stDate = this.fromDate.split('-').reverse().join('-');
    let stDate = this.fromDate;
    //let enDate = this.endDate.split('-').reverse().join('-');
    let enDate = this.endDate;
    this.api.post('Drivers/getUserCallSummary', {x_start_date:  stDate, x_end_date:  enDate + ' 23:59:00'})
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        
        let first_rec = this.data[0];
        console.log("first_Rec", first_rec);
        
        for (var key in first_rec) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);
        
      }, err => {
        this.common.loading--;
        console.log(err);
      }); 
  }

  getTableColumns() {
    let columns = [];
    for(var i= 0; i<this.data.length; i++) {
      this.valobj = {};
      for(let j=0; j<this.headings.length; j++) {j
        this.valobj[this.headings[j]] = {value: this.data[i][this.headings[j]], class: 'black', action:  ''};
      }
      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

}
