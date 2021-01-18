import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-mileage-with-odo',
  templateUrl: './fuel-mileage-with-odo.component.html',
  styleUrls: ['./fuel-mileage-with-odo.component.scss']
})
export class FuelMileageWithOdoComponent implements OnInit {
  startDate=null;
  endDate=null;
  averageWithOdo=[];
  table = {
    averageWithOdo: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  odoObj = {};

  constructor(public api:ApiService,
    public common:CommonService) {

     }

  ngOnDestroy(){}
ngOnInit() {
  }

  getFuelFillingsAverageWithOdo(){
    if(this.startDate==null && this.endDate==null){
      this.common.showError("Please enter startDate and endDate");
      return;
    }
    else if(this.startDate==null){
      this.common.showError("Please enter startDate");
      return;
    }
    else if(this.endDate==null){
      this.common.showError("please Enter endDate");
      return;
    }else if(this.endDate<this.startDate){
      this.common.showError("StartDate Should be less then EndDate");
      return;
    }else{
      let params={
        startTime:this.startDate,
        endTime:this.endDate,
      }
      this.common.loading++;
      this.api.post('Fuel/getFuelFillingsAverageWithOdo',params)
      .subscribe(res => {
        this.common.loading--;
        this.averageWithOdo = [];
        this.table = {
          averageWithOdo: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.odoObj = {};
        if (!res['data']) return;
        this.averageWithOdo = res['data'];
        let firstRecord = this.averageWithOdo[0];
        for (var key in firstRecord) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.averageWithOdo.headings[key] = headerObj;
          }
        }
        this.table.averageWithOdo.columns = this.getTableColumns();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });

    }
    
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.averageWithOdo);
    this.averageWithOdo.map(average => {
      this.odoObj = {};
      for (let i = 0; i < this.headings.length; i++) {
          this.odoObj[this.headings[i]] = { value: average[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.odoObj);
    });
    return columns;
  }

}
