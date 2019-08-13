import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'fuel-consumption',
  templateUrl: './fuel-consumption.component.html',
  styleUrls: ['./fuel-consumption.component.scss']
})
export class FuelConsumptionComponent implements OnInit {
  startDate = null;
  endDate = null;
  fuelConsumption=[];
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
  constructor(public common:CommonService,
    public api:ApiService) { }

  ngOnInit() {
  }


  getFuelConsumption(){
    this.fuelConsumption=[];
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

  
    let startDate = this.startDate != null ? this.common.dateFormatter1(this.startDate) : null;
    let endDate = this.endDate != null ? this.common.dateFormatter1(this.endDate) : null;
    if (startDate == null)
    {
       return this.common.showError("Start Date is Missing");
      
    }
    else if(endDate == null){
     return this.common.showError("End Date is Missing");

    }
   else  if (this.startDate > this.endDate) {
      return this.common.showError("Start Date should not be Greater than End Date")
    }
    const params=
             {start_time:startDate,
              end_time:endDate
  }
  
    console.log(params);
   
    this.common.loading++;
    this.api.post("FuelDetails/getFuelConsumption", params).subscribe(
      res => {
        this.common.loading--;
        this.fuelConsumption = res['data'];
     
        console.log("result", res);

        let first_rec = this.fuelConsumption[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
      },);

  }
    
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.fuelConsumption);
    this.fuelConsumption.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
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

