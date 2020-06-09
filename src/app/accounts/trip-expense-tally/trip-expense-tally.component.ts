import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'trip-expense-tally',
  templateUrl: './trip-expense-tally.component.html',
  styleUrls: ['./trip-expense-tally.component.scss']
})
export class TripExpenseTallyComponent implements OnInit {
  tripExpense=[];
  selectedVehicle = {
    id: 0
  };
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
  endDate = this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
  //startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  startDate= ((((new Date()).getMonth()) + 1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear()) - 1) + '-04-01', 'ddMMYYYY', false, '-');
  request=0;
  allowBackspace = true;


  constructor(public api:ApiService,
    public common:CommonService,
    public accountService: AccountService) {
      this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate: this.startDate;
      this.accountService.todate = (this.accountService.todate)? this.accountService.todate: this.endDate;  
    this.common.currentPage = 'Trip Expense Tally';

   }

  ngOnInit() {

  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase',this.selectedVehicle.id);

  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    let activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      this.allowBackspace = true;
      if (activeId.includes('startdate')) {
        this.startDate = this.common.handleDateOnEnterNew(this.startDate);
        this.setFoucus('enddate');
      } else if (activeId.includes('enddate')) {
        this.endDate = this.common.handleDateOnEnterNew(this.endDate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'enddate') this.setFoucus('startdate');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((activeId == 'startdate' || activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }else if (key != 'backspace') {
      this.allowBackspace = false;
    }
  }
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
  getTripExpenseTally() {
    this.startDate = this.accountService.fromdate;
    this.endDate = this.accountService.todate;
   this.tripExpense=[];
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

    if (this.startDate > this.endDate) {
      return this.common.showError("Start Date should not be Greater than End Date")
    }
    let startDate = this.startDate != null ? this.common.dateFormatter(this.startDate) : null;
    let endDate = this.endDate != null ? this.common.dateFormatter(this.endDate) : null;
    if (startDate == null)
    {
       return this.common.showError("Start Date is Missing");
      
    }
    else if(endDate == null){
     return this.common.showError("End Date is Missing");

    }
    const params= {
      vehid:this.selectedVehicle.id,
      startdate:startDate,
      enddate:endDate,
      diffrentonly:this.request
    }
    this.api.post("Voucher/getTripTally", params).subscribe(
      res => {
        this.tripExpense = res['data'] || [];
        console.log("result", res);
        let first_rec = this.tripExpense[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }  
        this.table.data.columns = this.getTableColumns();
      }
    );
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.tripExpense);
    this.tripExpense.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };  
      }
  
      columns.push(this.valobj);
    });
    return columns;
  }
  
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
}
