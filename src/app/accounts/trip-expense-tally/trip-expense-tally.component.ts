import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

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
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  request=0

  constructor(public api:ApiService,
    public common:CommonService) {
   }

  ngOnInit() {

  }

  getVehicle(vehicle) {
    console.log('test fase', vehicle);
    this.selectedVehicle = vehicle;
    console.log('test fase',this.selectedVehicle.id);

  }

  getTripExpenseTally() {
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
