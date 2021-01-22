import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-consumption',
  templateUrl: './fuel-consumption.component.html',
  styleUrls: ['./fuel-consumption.component.scss']
})
export class FuelConsumptionComponent implements OnInit {
  totalFillCount:Number=0;
  totalFuel:Number=0;
  totelFuelCost:Number=0;
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
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

  ngOnDestroy(){}
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

  
    let startDate = this.startDate != null ? this.common.dateFormatter(this.startDate) : null;
    let endDate = this.endDate != null ? this.common.dateFormatter(this.endDate) : null;
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
        this.totalFillCount=0;
        this.totalFuel=0;
        this.totelFuelCost=0;
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
        if(this.headings[i]=="Filling Count"){
          this.totalFillCount=this.totalFillCount+doc[this.headings[i]];
        }
        if(this.headings[i]=="Total Fuel (Litres)"){
          this.totalFuel=this.totalFuel+doc[this.headings[i]];
        }
        if(this.headings[i]=="Total Fuel Cost"){
          this.totelFuelCost=this.totelFuelCost+doc[this.headings[i]];
        }
      }
      columns.push(this.valobj);
    });
    this.valobj={};
    for(let i=0;i<this.headings.length;i++){
      if(this.headings[i]=="Pump Name"){
        this.valobj[this.headings[i]] = { value: "Total", class: 'text-colour', action: '' };
      }
      if(this.headings[i]=="Filling Count"){
        this.valobj[this.headings[i]] = { value: this.totalFillCount, class: 'text-colour', action: '' };
      }
      if(this.headings[i]=="Total Fuel (Litres)"){
        this.valobj[this.headings[i]] = { value: this.totalFuel, class: 'text-colour', action: '' };
      }
      if(this.headings[i]=="Total Fuel Cost"){
        this.valobj[this.headings[i]] = { value: this.totelFuelCost, class: 'text-colour', action: '' };
      }
    }
     columns.push(this.valobj);
    return columns;
  }

 formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  }

